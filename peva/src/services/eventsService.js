import { supabase } from '@/lib/supabase'

/**
 * Service Events (Frontend) - 2iEGreenHub
 * Colonnes pev_events vérifiées le 08/01/2026:
 * id, title, description, category, category_id, event_type, location, location_type,
 * address, city, country_id, online_link, start_date, end_date, registration_deadline,
 * max_participants, registration_required, is_free, price, currency, image_url, document_url,
 * organizer_name, organizer_id, contact_email, contact_phone, status, is_featured,
 * participants_count, views_count, created_by, created_at, updated_at
 */
export const eventsService = {
  /**
   * Récupérer les événements publiés
   */
  async getEvents(options = {}) {
    try {
      const { page = 1, limit = 20, categoryId, upcoming, search } = options

      let query = supabase
        .from('pev_events')
        .select(`
          *,
          pev_event_categories:category_id(id, name, icon, color)
        `, { count: 'exact' })
        .eq('status', 'published')

      if (categoryId) query = query.eq('category_id', categoryId)
      if (upcoming) query = query.gte('start_date', new Date().toISOString())
      if (search) query = query.ilike('title', `%${search}%`)

      query = query
        .order('start_date', { ascending: true })
        .range((page - 1) * limit, page * limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return { success: true, data: data || [], total: count }
    } catch (error) {
      console.error('Erreur récupération événements:', error)
      return { success: false, error: error.message, data: [], total: 0 }
    }
  },

  /**
   * Récupérer un événement par ID + incrémenter views_count
   */
  async getEventById(id) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .select(`
          *,
          pev_event_categories:category_id(id, name, icon, color)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Incrémenter views_count
      if (data) {
        await supabase
          .from('pev_events')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', id)
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erreur récupération événement:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Créer un événement (soumission pour modération)
   */
  async createEvent(eventData, imageFile = null, documentFile = null) {
    try {
      let imageUrl = eventData.image_url || null
      let documentUrl = eventData.document_url || null

      // Upload image si fournie
      if (imageFile) {
        const fileName = `events/${Date.now()}_${imageFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile)

        if (uploadError) {
          console.warn('Erreur upload image:', uploadError.message)
        } else {
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(fileName)
          imageUrl = urlData?.publicUrl
        }
      }

      // Upload document si fourni
      if (documentFile) {
        const docFileName = `events/documents/${Date.now()}_${documentFile.name}`
        const { data: docUploadData, error: docUploadError } = await supabase.storage
          .from('documents')
          .upload(docFileName, documentFile)

        if (docUploadError) {
          console.warn('Erreur upload document:', docUploadError.message)
        } else {
          const { data: docUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(docFileName)
          documentUrl = docUrlData?.publicUrl
        }
      }

      const { data, error } = await supabase
        .from('pev_events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          category_id: eventData.category_id,
          event_type: eventData.event_type || 'conference',
          location: eventData.location,
          location_type: eventData.location_type || 'physical',
          address: eventData.address,
          city: eventData.city,
          country_id: eventData.country_id,
          online_link: eventData.online_link,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          registration_deadline: eventData.registration_deadline,
          max_participants: eventData.max_participants,
          registration_required: eventData.registration_required !== false,
          is_free: eventData.is_free || false,
          price: eventData.price,
          currency: eventData.currency || 'XOF',
          image_url: imageUrl,
          document_url: documentUrl,
          organizer_name: eventData.organizer_name,
          organizer_id: eventData.organizer_id,
          contact_email: eventData.contact_email,
          contact_phone: eventData.contact_phone,
          status: 'in_review', // Pour modération
          is_featured: false,
          participants_count: 0,
          views_count: 0,
          created_by: eventData.created_by
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur création événement:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Sauvegarder un brouillon
   */
  async saveDraft(eventData, imageFile = null) {
    try {
      let imageUrl = eventData.image_url || null

      // Upload image si fournie
      if (imageFile) {
        const fileName = `events/drafts/${Date.now()}_${imageFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, imageFile)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(fileName)
          imageUrl = urlData?.publicUrl
        }
      }

      const payload = {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        category_id: eventData.category_id,
        event_type: eventData.event_type,
        location: eventData.location,
        location_type: eventData.location_type,
        address: eventData.address,
        city: eventData.city,
        country_id: eventData.country_id,
        online_link: eventData.online_link,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        registration_deadline: eventData.registration_deadline,
        max_participants: eventData.max_participants,
        registration_required: eventData.registration_required,
        is_free: eventData.is_free,
        price: eventData.price,
        currency: eventData.currency || 'XOF',
        image_url: imageUrl,
        contact_email: eventData.contact_email,
        contact_phone: eventData.contact_phone,
        status: 'draft'
      }

      let result
      if (eventData.id) {
        // UPDATE - ne pas inclure created_by
        const { data, error } = await supabase
          .from('pev_events')
          .update(payload)
          .eq('id', eventData.id)
          .eq('created_by', eventData.created_by)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // INSERT - inclure created_by
        payload.created_by = eventData.created_by
        payload.participants_count = 0
        payload.views_count = 0

        const { data, error } = await supabase
          .from('pev_events')
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        result = data
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Erreur sauvegarde brouillon:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Récupérer les événements de l'utilisateur
   */
  async getUserEvents(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .select(`
          *,
          pev_event_categories:category_id(id, name, icon, color)
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération événements utilisateur:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * S'inscrire à un événement
   * Gère le workflow d'approbation manuelle si require_approval est activé
   */
  async registerForEvent(eventId, userId) {
    try {
      // Vérifier si déjà inscrit
      const { data: existing } = await supabase
        .from('pev_event_participants')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle()

      if (existing) {
        if (existing.status === 'pending') {
          return { success: false, error: 'Votre demande est en attente d\'approbation' }
        }
        return { success: false, error: 'Vous êtes déjà inscrit à cet événement' }
      }

      // Récupérer les infos de l'événement
      const { data: event } = await supabase
        .from('pev_events')
        .select('id, title, max_participants, participants_count, created_by, require_approval, contact_email, organizer_name')
        .eq('id', eventId)
        .maybeSingle()

      // Vérifier si c'est son propre événement
      if (event?.created_by === userId) {
        return { success: false, error: 'Vous ne pouvez pas vous inscrire à votre propre événement' }
      }

      if (event?.max_participants && event.participants_count >= event.max_participants) {
        return { success: false, error: 'Plus de places disponibles' }
      }

      // Récupérer les infos du participant
      const { data: userProfile } = await supabase
        .from('pev_profiles')
        .select('first_name, last_name, email')
        .eq('id', userId)
        .maybeSingle()

      // Déterminer le statut selon require_approval
      const status = event?.require_approval ? 'pending' : 'registered'

      // Inscrire
      const { data, error } = await supabase
        .from('pev_event_participants')
        .insert({
          event_id: eventId,
          user_id: userId,
          status: status,
          registration_date: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Si pas d'approbation requise, incrémenter participants_count
      if (!event?.require_approval) {
        await supabase
          .from('pev_events')
          .update({ participants_count: (event?.participants_count || 0) + 1 })
          .eq('id', eventId)
      }

      // Envoyer email au participant
      const participantName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Participant'
      const participantEmail = userProfile?.email

      if (participantEmail) {
        try {
          if (event?.require_approval) {
            // Email: demande prise en compte
            await this.sendEventEmail({
              to: participantEmail,
              subject: `Demande d'inscription - ${event.title}`,
              type: 'registration_pending',
              data: {
                participantName,
                eventTitle: event.title,
                message: 'Votre demande d\'inscription a été prise en compte et est en attente d\'approbation par l\'organisateur.'
              }
            })
          } else {
            // Email: inscription confirmée
            await this.sendEventEmail({
              to: participantEmail,
              subject: `Inscription confirmée - ${event.title}`,
              type: 'registration_confirmed',
              data: {
                participantName,
                eventTitle: event.title,
                message: 'Votre inscription à l\'événement a été confirmée.'
              }
            })
          }
        } catch (emailError) {
          console.warn('Erreur envoi email:', emailError.message)
        }
      }

      return { 
        success: true, 
        data,
        requiresApproval: event?.require_approval,
        message: event?.require_approval 
          ? 'Votre demande a été soumise et est en attente d\'approbation'
          : 'Inscription confirmée'
      }
    } catch (error) {
      console.error('Erreur inscription événement:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Approuver un participant (pour l'organisateur)
   */
  async approveParticipant(participantId, eventId) {
    try {
      // Récupérer les infos du participant et de l'événement
      const { data: participant } = await supabase
        .from('pev_event_participants')
        .select('user_id, status')
        .eq('id', participantId)
        .single()

      if (!participant || participant.status !== 'pending') {
        return { success: false, error: 'Participant non trouvé ou déjà traité' }
      }

      const { data: event } = await supabase
        .from('pev_events')
        .select('title, participants_count')
        .eq('id', eventId)
        .single()

      const { data: userProfile } = await supabase
        .from('pev_profiles')
        .select('first_name, last_name, email')
        .eq('id', participant.user_id)
        .single()

      // Mettre à jour le statut
      const { error } = await supabase
        .from('pev_event_participants')
        .update({ status: 'registered', approved_at: new Date().toISOString() })
        .eq('id', participantId)

      if (error) throw error

      // Incrémenter participants_count
      await supabase
        .from('pev_events')
        .update({ participants_count: (event?.participants_count || 0) + 1 })
        .eq('id', eventId)

      // Envoyer email de confirmation
      if (userProfile?.email) {
        await this.sendEventEmail({
          to: userProfile.email,
          subject: `Inscription approuvée - ${event?.title}`,
          type: 'registration_approved',
          data: {
            participantName: `${userProfile.first_name} ${userProfile.last_name}`,
            eventTitle: event?.title,
            message: 'Félicitations ! Votre inscription a été approuvée par l\'organisateur.'
          }
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur approbation participant:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Rejeter un participant (pour l'organisateur)
   */
  async rejectParticipant(participantId, eventId, reason = '') {
    try {
      const { data: participant } = await supabase
        .from('pev_event_participants')
        .select('user_id')
        .eq('id', participantId)
        .single()

      const { data: event } = await supabase
        .from('pev_events')
        .select('title')
        .eq('id', eventId)
        .single()

      const { data: userProfile } = await supabase
        .from('pev_profiles')
        .select('first_name, last_name, email')
        .eq('id', participant?.user_id)
        .single()

      // Mettre à jour le statut
      const { error } = await supabase
        .from('pev_event_participants')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', participantId)

      if (error) throw error

      // Envoyer email de rejet
      if (userProfile?.email) {
        await this.sendEventEmail({
          to: userProfile.email,
          subject: `Inscription non retenue - ${event?.title}`,
          type: 'registration_rejected',
          data: {
            participantName: `${userProfile.first_name} ${userProfile.last_name}`,
            eventTitle: event?.title,
            message: reason || 'Votre demande d\'inscription n\'a pas été retenue par l\'organisateur.'
          }
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur rejet participant:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Notifier les participants d'un changement d'événement (annulation, reprogrammation)
   */
  async notifyParticipants(eventId, type, newDate = null) {
    try {
      const { data: event } = await supabase
        .from('pev_events')
        .select('title, start_date')
        .eq('id', eventId)
        .single()

      const { data: participants } = await supabase
        .from('pev_event_participants')
        .select('user_id, pev_profiles:user_id(first_name, last_name, email)')
        .eq('event_id', eventId)
        .in('status', ['registered', 'pending'])

      if (!participants || participants.length === 0) {
        return { success: true, notified: 0 }
      }

      let subject, message
      if (type === 'cancelled') {
        subject = `Événement annulé - ${event?.title}`
        message = `Nous vous informons que l'événement "${event?.title}" a été annulé.`
      } else if (type === 'rescheduled') {
        subject = `Événement reprogrammé - ${event?.title}`
        message = `L'événement "${event?.title}" a été reprogrammé${newDate ? ` au ${new Date(newDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` : ''}.`
      }

      let notified = 0
      for (const p of participants) {
        const profile = p.pev_profiles
        if (profile?.email) {
          try {
            await this.sendEventEmail({
              to: profile.email,
              subject,
              type: type === 'cancelled' ? 'event_cancelled' : 'event_rescheduled',
              data: {
                participantName: `${profile.first_name} ${profile.last_name}`,
                eventTitle: event?.title,
                message
              }
            })
            notified++
          } catch (e) { /* ignore individual failures */ }
        }
      }

      return { success: true, notified }
    } catch (error) {
      console.error('Erreur notification participants:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Envoyer un email lié aux événements
   */
  async sendEventEmail({ to, subject, type, data }) {
    const API_URL = 'https://apiemail2iegreenhub.vercel.app/api/send-email'
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">2iE GreenHub</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Bonjour <strong>${data.participantName}</strong>,</p>
          <h2 style="color: #7b1fa2;">${data.eventTitle}</h2>
          <p style="font-size: 16px; color: #333;">${data.message}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">Cordialement,<br>L'équipe 2iE GreenHub</p>
        </div>
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          © 2026 2iE GreenHub - Tous droits réservés
        </div>
      </div>
    `

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html: htmlContent })
    })

    if (!response.ok) {
      throw new Error('Échec envoi email')
    }

    return { success: true }
  },

  /**
   * Annuler inscription
   */
  async cancelRegistration(eventId, userId) {
    try {
      const { error } = await supabase
        .from('pev_event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId)

      if (error) throw error

      // Décrémenter participants_count
      const { data: event } = await supabase
        .from('pev_events')
        .select('participants_count')
        .eq('id', eventId)
        .single()

      if (event) {
        await supabase
          .from('pev_events')
          .update({ participants_count: Math.max(0, (event.participants_count || 1) - 1) })
          .eq('id', eventId)
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur annulation inscription:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Vérifier si utilisateur inscrit
   */
  async isUserRegistered(eventId, userId) {
    try {
      const { data } = await supabase
        .from('pev_event_participants')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle()

      return { registered: !!data, registration: data }
    } catch (error) {
      return { registered: false, registration: null }
    }
  },

  /**
   * Récupérer les catégories
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('pev_event_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération catégories:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * Supprimer un événement (brouillon ou rejeté uniquement)
   */
  async deleteEvent(eventId) {
    try {
      const { error } = await supabase
        .from('pev_events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression événement:', error)
      return { success: false, error: error.message }
    }
  }
}
