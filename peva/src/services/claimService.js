import { supabase } from '@/lib/supabase'
import emailService from '@/services/emailService'

/**
 * Service de gestion des Claims (Réclamations d'entreprise)
 * 
 * Workflow:
 * 1. Utilisateur trouve une entreprise sur la carte/annuaire
 * 2. Il clique "Réclamer cette entreprise"
 * 3. Il remplit un formulaire avec justificatifs
 * 4. L'admin reçoit une notification et modère
 * 5. Si approuvé: l'entreprise est attribuée à l'utilisateur
 * 6. Email de confirmation envoyé
 */
export const claimService = {
  
  /**
   * Soumettre une demande de réclamation d'entreprise
   * @param {Object} claimData - Données de la réclamation
   * @returns {Promise<Object>} Résultat de la soumission
   */
  async submitClaim(claimData) {
    try {
      const { companyId, userId, message, position, proofDocuments = [] } = claimData

      // Vérifier si l'entreprise existe
      const { data: company, error: companyError } = await supabase
        .from('pev_companies')
        .select('id, name, owner_id, claimed_by')
        .eq('id', companyId)
        .single()

      if (companyError || !company) {
        throw new Error('Entreprise non trouvée')
      }

      // Vérifier si l'entreprise n'est pas déjà réclamée
      if (company.claimed_by || company.owner_id === userId) {
        throw new Error('Cette entreprise est déjà attribuée')
      }

      // Vérifier s'il n'y a pas déjà un claim pending pour cet utilisateur
      const { data: existingClaim } = await supabase
        .from('pev_company_claims')
        .select('id, status')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single()

      if (existingClaim) {
        throw new Error('Vous avez déjà une demande en cours pour cette entreprise')
      }

      // Créer la demande de claim
      const { data: claim, error: claimError } = await supabase
        .from('pev_company_claims')
        .insert({
          company_id: companyId,
          user_id: userId,
          message: message,
          position_in_company: position,
          proof_documents: proofDocuments,
          status: 'pending'
        })
        .select()
        .single()

      if (claimError) throw claimError

      // Notifier les admins (non-bloquant)
      this.notifyAdminsNewClaim(claim, company).catch(console.error)

      return {
        success: true,
        data: claim,
        message: 'Votre demande de réclamation a été soumise. Elle sera examinée par un administrateur.'
      }
    } catch (error) {
      console.error('Erreur soumission claim:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Récupérer les claims d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des claims
   */
  async getUserClaims(userId) {
    const { data, error } = await supabase
      .from('pev_company_claims')
      .select(`
        *,
        company:company_id(id, name, logo_url, city, country, industry)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Récupérer les entreprises attribuées à un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des entreprises
   */
  async getUserCompanies(userId) {
    const { data, error } = await supabase
      .from('pev_companies')
      .select('*')
      .or(`owner_id.eq.${userId},claimed_by.eq.${userId}`)
      .order('name')

    if (error) throw error
    return data || []
  },

  /**
   * [ADMIN] Récupérer tous les claims en attente
   * @returns {Promise<Array>} Liste des claims pending
   */
  async getPendingClaims() {
    const { data, error } = await supabase
      .from('pev_company_claims')
      .select(`
        *,
        company:company_id(id, name, logo_url, city, country, industry, status),
        user:user_id(id, first_name, last_name, email, avatar_url, organization)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  /**
   * [ADMIN] Récupérer tous les claims avec filtres
   * @param {Object} filters - Filtres (status, companyId, userId)
   * @returns {Promise<Array>} Liste des claims
   */
  async getAllClaims(filters = {}) {
    let query = supabase
      .from('pev_company_claims')
      .select(`
        *,
        company:company_id(id, name, logo_url, city, country, industry),
        user:user_id(id, first_name, last_name, email, avatar_url)
      `)

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.companyId) {
      query = query.eq('company_id', filters.companyId)
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * [ADMIN] Approuver un claim
   * @param {string} claimId - ID du claim
   * @param {string} adminId - ID de l'admin qui approuve
   * @param {string} notes - Notes admin (optionnel)
   * @returns {Promise<Object>} Résultat
   */
  async approveClaim(claimId, adminId, notes = '') {
    try {
      // Récupérer le claim avec les infos
      const { data: claim, error: fetchError } = await supabase
        .from('pev_company_claims')
        .select(`
          *,
          company:company_id(id, name, email),
          user:user_id(id, first_name, last_name, email)
        `)
        .eq('id', claimId)
        .single()

      if (fetchError || !claim) {
        throw new Error('Claim non trouvé')
      }

      if (claim.status !== 'pending') {
        throw new Error('Ce claim a déjà été traité')
      }

      // Mettre à jour le claim
      const { error: updateClaimError } = await supabase
        .from('pev_company_claims')
        .update({
          status: 'approved',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId)

      if (updateClaimError) throw updateClaimError

      // Attribuer l'entreprise à l'utilisateur
      const { error: updateCompanyError } = await supabase
        .from('pev_companies')
        .update({
          claimed_by: claim.user_id,
          claimed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', claim.company_id)

      if (updateCompanyError) throw updateCompanyError

      // Envoyer l'email de confirmation
      await this.sendClaimApprovedEmail(claim)

      return {
        success: true,
        message: `L'entreprise ${claim.company?.name} a été attribuée à ${claim.user?.first_name} ${claim.user?.last_name}`
      }
    } catch (error) {
      console.error('Erreur approbation claim:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * [ADMIN] Rejeter un claim
   * @param {string} claimId - ID du claim
   * @param {string} adminId - ID de l'admin
   * @param {string} reason - Raison du rejet
   * @returns {Promise<Object>} Résultat
   */
  async rejectClaim(claimId, adminId, reason) {
    try {
      if (!reason || reason.trim().length < 10) {
        throw new Error('Veuillez fournir une raison de rejet (minimum 10 caractères)')
      }

      // Récupérer le claim
      const { data: claim, error: fetchError } = await supabase
        .from('pev_company_claims')
        .select(`
          *,
          company:company_id(id, name),
          user:user_id(id, first_name, last_name, email)
        `)
        .eq('id', claimId)
        .single()

      if (fetchError || !claim) {
        throw new Error('Claim non trouvé')
      }

      if (claim.status !== 'pending') {
        throw new Error('Ce claim a déjà été traité')
      }

      // Mettre à jour le claim
      const { error: updateError } = await supabase
        .from('pev_company_claims')
        .update({
          status: 'rejected',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId)

      if (updateError) throw updateError

      // Envoyer l'email de rejet
      await this.sendClaimRejectedEmail(claim, reason)

      return {
        success: true,
        message: `La demande de ${claim.user?.first_name} ${claim.user?.last_name} a été rejetée`
      }
    } catch (error) {
      console.error('Erreur rejet claim:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Vérifier si un utilisateur peut réclamer une entreprise
   * @param {string} companyId - ID de l'entreprise
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statut de la possibilité de claim
   */
  async canClaimCompany(companyId, userId) {
    try {
      // Vérifier l'entreprise
      const { data: company } = await supabase
        .from('pev_companies')
        .select('id, name, owner_id, claimed_by')
        .eq('id', companyId)
        .single()

      if (!company) {
        return { canClaim: false, reason: 'Entreprise non trouvée' }
      }

      // Déjà propriétaire
      if (company.owner_id === userId) {
        return { canClaim: false, reason: 'Vous êtes déjà propriétaire de cette entreprise' }
      }

      // Déjà réclamée par l'utilisateur
      if (company.claimed_by === userId) {
        return { canClaim: false, reason: 'Cette entreprise vous est déjà attribuée' }
      }

      // Déjà réclamée par quelqu'un d'autre
      if (company.claimed_by) {
        return { canClaim: false, reason: 'Cette entreprise est déjà attribuée à un autre utilisateur' }
      }

      // Vérifier s'il y a un claim pending
      const { data: pendingClaim } = await supabase
        .from('pev_company_claims')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single()

      if (pendingClaim) {
        return { canClaim: false, reason: 'Vous avez déjà une demande en cours pour cette entreprise' }
      }

      return { canClaim: true, company }
    } catch (error) {
      return { canClaim: false, reason: error.message }
    }
  },

  /**
   * Annuler un claim (par l'utilisateur)
   * @param {string} claimId - ID du claim
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Résultat
   */
  async cancelClaim(claimId, userId) {
    try {
      const { data: claim } = await supabase
        .from('pev_company_claims')
        .select('id, user_id, status')
        .eq('id', claimId)
        .single()

      if (!claim) {
        throw new Error('Demande non trouvée')
      }

      if (claim.user_id !== userId) {
        throw new Error('Vous ne pouvez annuler que vos propres demandes')
      }

      if (claim.status !== 'pending') {
        throw new Error('Seules les demandes en attente peuvent être annulées')
      }

      const { error } = await supabase
        .from('pev_company_claims')
        .delete()
        .eq('id', claimId)

      if (error) throw error

      return { success: true, message: 'Demande annulée' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Notifier les admins d'un nouveau claim
   */
  async notifyAdminsNewClaim(claim, company) {
    try {
      // Récupérer les admins
      const { data: admins } = await supabase
        .from('pev_profiles')
        .select('email, first_name')
        .in('role', ['admin', 'super_admin'])

      if (!admins || admins.length === 0) return

      // Récupérer les infos de l'utilisateur
      const { data: user } = await supabase
        .from('pev_profiles')
        .select('first_name, last_name, email')
        .eq('id', claim.user_id)
        .single()

      for (const admin of admins) {
        await emailService.sendTemplateEmail('claim_new', admin.email, {
          admin_name: admin.first_name,
          user_name: `${user?.first_name} ${user?.last_name}`,
          user_email: user?.email,
          company_name: company.name,
          message: claim.message || 'Aucun message',
          position: claim.position_in_company || 'Non spécifié',
          review_url: `${window.location.origin}/admin/moderation?tab=claims`
        })
      }
    } catch (error) {
      console.error('Erreur notification admins:', error)
    }
  },

  /**
   * Envoyer l'email de confirmation d'approbation
   */
  async sendClaimApprovedEmail(claim) {
    try {
      await emailService.sendTemplateEmail('claim_approved', claim.user?.email, {
        user_name: claim.user?.first_name,
        company_name: claim.company?.name,
        dashboard_url: `${window.location.origin}/my-companies`
      })
    } catch (error) {
      console.error('Erreur envoi email approbation:', error)
    }
  },

  /**
   * Envoyer l'email de rejet
   */
  async sendClaimRejectedEmail(claim, reason) {
    try {
      await emailService.sendTemplateEmail('claim_rejected', claim.user?.email, {
        user_name: claim.user?.first_name,
        company_name: claim.company?.name,
        rejection_reason: reason
      })
    } catch (error) {
      console.error('Erreur envoi email rejet:', error)
    }
  },

  /**
   * Statistiques des claims pour l'admin
   */
  async getClaimStats() {
    try {
      const [pending, approved, rejected] = await Promise.all([
        supabase.from('pev_company_claims').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('pev_company_claims').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('pev_company_claims').select('id', { count: 'exact', head: true }).eq('status', 'rejected')
      ])

      return {
        pending: pending.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0,
        total: (pending.count || 0) + (approved.count || 0) + (rejected.count || 0)
      }
    } catch (error) {
      console.error('Erreur stats claims:', error)
      return { pending: 0, approved: 0, rejected: 0, total: 0 }
    }
  }
}

export default claimService
