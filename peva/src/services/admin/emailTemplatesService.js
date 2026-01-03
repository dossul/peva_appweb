/**
 * Service de gestion des templates d'emails - 2iE GreenHub
 * CRUD complet pour les templates d'emails avec Supabase
 */

import { supabase } from '@/lib/supabase'

export const emailTemplatesService = {
  // =====================================================
  // CATÉGORIES
  // =====================================================

  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('pev_email_categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur getCategories:', error)
      return { success: false, error: error.message }
    }
  },

  async createCategory(category) {
    try {
      const { data, error } = await supabase
        .from('pev_email_categories')
        .insert(category)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur createCategory:', error)
      return { success: false, error: error.message }
    }
  },

  async updateCategory(id, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_email_categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur updateCategory:', error)
      return { success: false, error: error.message }
    }
  },

  async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from('pev_email_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Erreur deleteCategory:', error)
      return { success: false, error: error.message }
    }
  },

  // =====================================================
  // TEMPLATES
  // =====================================================

  async getTemplates(options = {}) {
    try {
      let query = supabase
        .from('pev_email_templates')
        .select(`
          *,
          category:category_id(id, name, slug, icon, color)
        `)
        .order('created_at', { ascending: false })

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId)
      }

      if (options.activeOnly) {
        query = query.eq('is_active', true)
      }

      if (options.code) {
        query = query.eq('code', options.code)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur getTemplates:', error)
      return { success: false, error: error.message }
    }
  },

  async getTemplateByCode(code) {
    try {
      const { data, error } = await supabase
        .from('pev_email_templates')
        .select(`
          *,
          category:category_id(id, name, slug, icon, color),
          variables:pev_email_template_variables(*)
        `)
        .eq('code', code)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur getTemplateByCode:', error)
      return { success: false, error: error.message }
    }
  },

  async getTemplate(id) {
    try {
      const { data, error } = await supabase
        .from('pev_email_templates')
        .select(`
          *,
          category:category_id(id, name, slug, icon, color),
          variables:pev_email_template_variables(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur getTemplate:', error)
      return { success: false, error: error.message }
    }
  },

  async createTemplate(template) {
    try {
      const { data: user } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('pev_email_templates')
        .insert({
          ...template,
          created_by: user?.user?.id,
          updated_by: user?.user?.id
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur createTemplate:', error)
      return { success: false, error: error.message }
    }
  },

  async updateTemplate(id, updates) {
    try {
      const { data: user } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('pev_email_templates')
        .update({
          ...updates,
          updated_by: user?.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur updateTemplate:', error)
      return { success: false, error: error.message }
    }
  },

  async deleteTemplate(id) {
    try {
      const { error } = await supabase
        .from('pev_email_templates')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Erreur deleteTemplate:', error)
      return { success: false, error: error.message }
    }
  },

  async toggleTemplateActive(id) {
    try {
      const { data: current } = await supabase
        .from('pev_email_templates')
        .select('is_active')
        .eq('id', id)
        .single()

      const { data, error } = await supabase
        .from('pev_email_templates')
        .update({ 
          is_active: !current?.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur toggleTemplateActive:', error)
      return { success: false, error: error.message }
    }
  },

  // =====================================================
  // VARIABLES
  // =====================================================

  async getTemplateVariables(templateId) {
    try {
      const { data, error } = await supabase
        .from('pev_email_template_variables')
        .select('*')
        .eq('template_id', templateId)
        .order('variable_name', { ascending: true })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur getTemplateVariables:', error)
      return { success: false, error: error.message }
    }
  },

  async addTemplateVariable(templateId, variable) {
    try {
      const { data, error } = await supabase
        .from('pev_email_template_variables')
        .insert({
          template_id: templateId,
          ...variable
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur addTemplateVariable:', error)
      return { success: false, error: error.message }
    }
  },

  async deleteTemplateVariable(id) {
    try {
      const { error } = await supabase
        .from('pev_email_template_variables')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Erreur deleteTemplateVariable:', error)
      return { success: false, error: error.message }
    }
  },

  // =====================================================
  // UTILITAIRES
  // =====================================================

  /**
   * Remplacer les variables dans un template
   */
  renderTemplate(template, variables = {}) {
    let subject = template.subject
    let htmlContent = template.html_content
    let textContent = template.text_content || ''

    // Remplacer les variables {{variable_name}}
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      const value = variables[key] || ''
      subject = subject.replace(regex, value)
      htmlContent = htmlContent.replace(regex, value)
      textContent = textContent.replace(regex, value)
    })

    // Nettoyer les variables non remplacées
    subject = subject.replace(/{{[^}]+}}/g, '')
    htmlContent = htmlContent.replace(/{{[^}]+}}/g, '')
    textContent = textContent.replace(/{{[^}]+}}/g, '')

    return {
      subject,
      html: htmlContent,
      text: textContent
    }
  },

  /**
   * Envoyer un email à partir d'un template
   */
  async sendTemplateEmail(templateCode, recipientEmail, variables = {}) {
    try {
      // Récupérer le template
      const result = await this.getTemplateByCode(templateCode)
      if (!result.success || !result.data) {
        throw new Error(`Template "${templateCode}" non trouvé`)
      }

      const template = result.data
      const rendered = this.renderTemplate(template, variables)

      // Envoyer via l'API
      const apiUrl = import.meta.env.VITE_EMAIL_API_URL || 'https://apiemail2iegreenhub.vercel.app/api/send-email'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Erreur sendTemplateEmail:', error)
      return { success: false, error: error.message }
    }
  },

  // =====================================================
  // STATISTIQUES
  // =====================================================

  async getStats() {
    try {
      const { data: templates } = await supabase
        .from('pev_email_templates')
        .select('id, is_active, is_system')

      const { data: categories } = await supabase
        .from('pev_email_categories')
        .select('id, is_active')

      return {
        success: true,
        data: {
          totalTemplates: templates?.length || 0,
          activeTemplates: templates?.filter(t => t.is_active).length || 0,
          systemTemplates: templates?.filter(t => t.is_system).length || 0,
          customTemplates: templates?.filter(t => !t.is_system).length || 0,
          totalCategories: categories?.length || 0
        }
      }
    } catch (error) {
      console.error('Erreur getStats:', error)
      return { success: false, error: error.message }
    }
  }
}

export default emailTemplatesService
