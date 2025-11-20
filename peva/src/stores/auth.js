import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userProfile = computed(() => user.value?.user_metadata || {})
  const userRole = computed(() => user.value?.profile?.role || 'user')
  const isAdmin = computed(() => {
    // Vérifier plusieurs sources pour le rôle admin
    const profileRole = user.value?.profile?.role
    const metadataRole = user.value?.user_metadata?.role
    const appMetadataRole = user.value?.app_metadata?.role
    
    return profileRole === 'admin' || profileRole === 'super_admin' ||
           metadataRole === 'admin' || metadataRole === 'super_admin' ||
           appMetadataRole === 'admin' || appMetadataRole === 'super_admin'
  })

  // Actions
  const initialize = async () => {
    if (initialized.value) return

    loading.value = true
    try {
      // Récupérer la session actuelle
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        
        // Récupérer le profil utilisateur complet
        await fetchUserProfile()
      }

      // Écouter les changements d'authentification
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event, newSession)
        
        session.value = newSession
        user.value = newSession?.user || null

        if (event === 'SIGNED_IN' && newSession?.user) {
          await fetchUserProfile()
        } else if (event === 'SIGNED_OUT') {
          clearUserData()
        }
      })

      initialized.value = true
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUserProfile = async () => {
    if (!user.value) return

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (profile) {
        // Fusionner les données du profil avec l'utilisateur
        user.value = {
          ...user.value,
          profile
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            user_type: userData.userType,
            ...userData
          }
        }
      })

      if (error) throw error

      // Si l'inscription réussit, créer le profil
      if (data.user && !data.user.email_confirmed_at) {
        return {
          user: data.user,
          needsConfirmation: true
        }
      }

      return { user: data.user }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const signInWithOAuth = async (provider) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error(`Erreur lors de la connexion ${provider}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      clearUserData()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email) => {
    loading.value = true
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password/confirm`
      })

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPassword) => {
    loading.value = true
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const resendConfirmation = async (email) => {
    loading.value = true
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors du renvoi de confirmation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    if (!user.value) throw new Error('Utilisateur non connecté')

    loading.value = true
    try {
      console.log('Mise à jour du profil pour l\'utilisateur:', user.value.id)
      console.log('Métadonnées utilisateur:', user.value.user_metadata)
      console.log('Données à sauvegarder:', profileData)

      // Mettre à jour les métadonnées utilisateur
      const { error: authError } = await supabase.auth.updateUser({
        data: profileData
      })

      if (authError) {
        console.error('Erreur auth:', authError)
        throw authError
      }

      // Utiliser upsert pour créer ou mettre à jour le profil
      const { data, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.value.id,
          email: user.value.email,
          first_name: user.value.user_metadata?.first_name || user.value.user_metadata?.firstName || null,
          last_name: user.value.user_metadata?.last_name || user.value.user_metadata?.lastName || null,
          display_name: user.value.user_metadata?.display_name || `${user.value.user_metadata?.first_name || ''} ${user.value.user_metadata?.last_name || ''}`.trim() || null,
          ...profileData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Erreur profil:', profileError)
        throw profileError
      }

      console.log('Profil mis à jour avec succès:', data)

      // Rafraîchir le profil
      await fetchUserProfile()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      console.error('Message d\'erreur:', error.message)
      console.error('Code d\'erreur:', error.code)
      throw error
    } finally {
      loading.value = false
    }
  }

  const clearUserData = () => {
    user.value = null
    session.value = null
  }

  // Vérifier si l'utilisateur a complété son onboarding
  const hasCompletedOnboarding = computed(() => {
    return user.value?.profile?.onboarding_completed || false
  })

  // Vérifier si l'utilisateur a vérifié son email
  const isEmailVerified = computed(() => {
    return user.value?.email_confirmed_at !== null
  })

  return {
    // État
    user,
    session,
    loading,
    initialized,
    
    // Getters
    isAuthenticated,
    userProfile,
    userRole,
    isAdmin,
    hasCompletedOnboarding,
    isEmailVerified,
    
    // Actions
    initialize,
    fetchUserProfile,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    updateProfile,
    clearUserData
  }
})