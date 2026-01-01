/**
 * Service de gestion de fichiers avec Supabase Storage
 * Gestion complète des uploads, téléchargements et métadonnées
 */

import { supabase } from '@/lib/supabase'

class FileService {
  constructor() {
    this.buckets = {
      avatars: 'avatars',
      logos: 'logos',
      documents: 'documents',
      images: 'images',
      videos: 'videos'
    }
  }

  /**
   * Initialiser les buckets de stockage
   */
  async initializeBuckets() {
    try {
      for (const [key, bucketName] of Object.entries(this.buckets)) {
        const { data, error } = await supabase.storage.getBucket(bucketName)
        
        if (error && error.message.includes('not found')) {
          // Créer le bucket s'il n'existe pas
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: key === 'avatars' || key === 'logos', // Buckets publics pour avatars et logos
            allowedMimeTypes: this.getAllowedMimeTypes(key),
            fileSizeLimit: this.getFileSizeLimit(key)
          })
          
          if (createError) {
            console.error(`Erreur lors de la création du bucket ${bucketName}:`, createError)
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des buckets:', error)
    }
  }

  /**
   * Obtenir les types MIME autorisés par catégorie
   */
  getAllowedMimeTypes(category) {
    const mimeTypes = {
      avatars: ['image/jpeg', 'image/png', 'image/webp'],
      logos: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      videos: ['video/mp4', 'video/webm', 'video/ogg']
    }
    return mimeTypes[category] || []
  }

  /**
   * Obtenir la limite de taille par catégorie (en bytes)
   */
  getFileSizeLimit(category) {
    const limits = {
      avatars: 2 * 1024 * 1024, // 2MB
      logos: 5 * 1024 * 1024, // 5MB
      images: 10 * 1024 * 1024, // 10MB
      documents: 50 * 1024 * 1024, // 50MB
      videos: 100 * 1024 * 1024 // 100MB
    }
    return limits[category] || 10 * 1024 * 1024
  }

  /**
   * Valider un fichier avant upload
   */
  validateFile(file, category) {
    const errors = []
    
    // Vérifier la taille
    const maxSize = this.getFileSizeLimit(category)
    if (file.size > maxSize) {
      errors.push(`Le fichier est trop volumineux. Taille maximum: ${this.formatFileSize(maxSize)}`)
    }
    
    // Vérifier le type MIME
    const allowedTypes = this.getAllowedMimeTypes(category)
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`)
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Générer un nom de fichier unique
   */
  generateFileName(originalName, userId) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${userId}_${timestamp}_${random}.${extension}`
  }

  /**
   * Uploader un fichier
   */
  async uploadFile(file, category, relatedEntity = null, relatedId = null, isPublic = false) {
    try {
      // Obtenir l'utilisateur actuel
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      // Valider le fichier
      const validation = this.validateFile(file, category)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      // Vérifier le quota utilisateur
      const canUpload = await this.checkUserQuota(user.id, file.size)
      if (!canUpload) {
        throw new Error('Quota de stockage dépassé')
      }

      // Générer le nom de fichier
      const fileName = this.generateFileName(file.name, user.id)
      const bucket = this.buckets[category] || this.buckets.documents
      const filePath = `${user.id}/${fileName}`

      // Uploader le fichier vers Supabase Storage d'abord
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Enregistrer les métadonnées du fichier
      const { data: fileRecord, error: dbError } = await supabase
        .from('pev_file_uploads')
        .insert({
          user_id: user.id,
          bucket_id: bucket,
          file_name: fileName,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          category: category,
          related_entity: relatedEntity,
          related_id: relatedId ? relatedId.toString() : null,
          is_public: isPublic,
          metadata: {
            original_name: file.name,
            original_size: file.size,
            upload_date: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (dbError) {
        // Supprimer le fichier uploadé si l'insertion en DB échoue
        await supabase.storage.from(bucket).remove([filePath])
        throw dbError
      }

      // Obtenir l'URL publique si nécessaire
      let publicUrl = null
      if (isPublic) {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath)
        publicUrl = urlData.publicUrl
      }

      return {
        ...updatedRecord,
        public_url: publicUrl,
        download_url: await this.getSignedUrl(fileRecord.id)
      }

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      throw error
    }
  }

  /**
   * Vérifier le quota utilisateur
   */
  async checkUserQuota(userId, fileSize) {
    try {
      const { data, error } = await supabase
        .from('pev_storage_quotas')
        .select('total_quota, used_space')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      const quota = data?.total_quota || 104857600 // 100MB par défaut
      const used = data?.used_space || 0

      return (used + fileSize) <= quota
    } catch (error) {
      console.error('Erreur lors de la vérification du quota:', error)
      return false
    }
  }

  /**
   * Obtenir une URL signée pour télécharger un fichier
   */
  async getSignedUrl(fileId, expiresIn = 3600) {
    try {
      const { data: fileData, error } = await supabase
        .from('pev_file_uploads')
        .select('file_path, category, bucket_id')
        .eq('id', fileId)
        .single()

      if (error) throw error

      const bucket = fileData.bucket_id || this.buckets[fileData.category] || this.buckets.documents
      
      const { data, error: signError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(fileData.file_path, expiresIn)

      if (signError) throw signError

      return data.signedUrl
    } catch (error) {
      console.error('Erreur lors de la génération de l\'URL signée:', error)
      throw error
    }
  }

  /**
   * Supprimer un fichier
   */
  async deleteFile(fileId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      // Récupérer les informations du fichier
      const { data: fileData, error } = await supabase
        .from('pev_file_uploads')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', user.id) // S'assurer que l'utilisateur possède le fichier
        .single()

      if (error) throw error

      const bucket = fileData.bucket_id || this.buckets[fileData.category] || this.buckets.documents

      // Supprimer le fichier du storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([fileData.file_path])

      if (storageError) {
        console.warn('Erreur lors de la suppression du fichier du storage:', storageError)
      }

      // Supprimer l'enregistrement de la base de données
      const { error: dbError } = await supabase
        .from('pev_file_uploads')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  /**
   * Obtenir les fichiers d'un utilisateur
   */
  async getUserFiles(userId, category = null, limit = 50) {
    try {
      let query = supabase
        .from('pev_file_uploads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error)
      return []
    }
  }

  /**
   * Obtenir les informations de quota d'un utilisateur
   */
  async getUserQuota(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_storage_quotas')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data || {
        total_quota: 104857600, // 100MB
        used_space: 0,
        file_count: 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du quota:', error)
      return {
        total_quota: 104857600,
        used_space: 0,
        file_count: 0
      }
    }
  }

  /**
   * Enregistrer un accès à un fichier
   */
  async logFileAccess(fileId, accessType = 'view') {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase
        .from('pev_file_access_logs')
        .insert({
          file_id: fileId,
          accessed_by: user?.id,
          access_type: accessType,
          ip_address: null, // À implémenter côté serveur
          user_agent: navigator.userAgent
        })
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'accès:', error)
    }
  }

  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Obtenir l'icône d'un type de fichier
   */
  getFileIcon(mimeType) {
    const icons = {
      'image/': 'mdi-image',
      'video/': 'mdi-video',
      'audio/': 'mdi-music',
      'application/pdf': 'mdi-file-pdf-box',
      'application/msword': 'mdi-file-word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'mdi-file-word',
      'application/vnd.ms-excel': 'mdi-file-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'mdi-file-excel',
      'text/': 'mdi-file-document',
      'application/zip': 'mdi-zip-box',
      'application/x-rar-compressed': 'mdi-zip-box'
    }

    for (const [type, icon] of Object.entries(icons)) {
      if (mimeType.startsWith(type)) {
        return icon
      }
    }

    return 'mdi-file'
  }
}

// Instance singleton
const fileService = new FileService()

// Initialiser les buckets au chargement
fileService.initializeBuckets()

export default fileService
