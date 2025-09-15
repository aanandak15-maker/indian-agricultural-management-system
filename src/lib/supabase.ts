import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      fields: {
        Row: {
          id: string
          user_id: string
          name: string
          area: number
          crop: string | null
          status: 'active' | 'inactive' | 'planned'
          soil_type: string | null
          coordinates: any | null
          irrigation: string | null
          planting_date: string | null
          harvest_date: string | null
          rainfall: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          area: number
          crop?: string | null
          status?: 'active' | 'inactive' | 'planned'
          soil_type?: string | null
          coordinates?: any | null
          irrigation?: string | null
          planting_date?: string | null
          harvest_date?: string | null
          rainfall?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          area?: number
          crop?: string | null
          status?: 'active' | 'inactive' | 'planned'
          soil_type?: string | null
          coordinates?: any | null
          irrigation?: string | null
          planting_date?: string | null
          harvest_date?: string | null
          rainfall?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      crop_history: {
        Row: {
          id: string
          field_id: string
          year: number
          crop: string
          yield: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          field_id: string
          year: number
          crop: string
          yield?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          field_id?: string
          year?: number
          crop?: string
          yield?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      financial_records: {
        Row: {
          id: string
          user_id: string
          field_id: string | null
          type: 'revenue' | 'expense'
          amount: number
          description: string | null
          date: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          field_id?: string | null
          type: 'revenue' | 'expense'
          amount: number
          description?: string | null
          date: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          field_id?: string | null
          type?: 'revenue' | 'expense'
          amount?: number
          description?: string | null
          date?: string
          category?: string | null
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          quantity: number
          unit: string
          price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          quantity: number
          unit: string
          price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          quantity?: number
          unit?: string
          price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
