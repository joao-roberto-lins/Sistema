export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          location: string
          area: number
          progress: number
          description: string
          current_status: string | null
          notes: string | null
          image_url: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          area: number
          progress: number
          description: string
          current_status?: string | null
          notes?: string | null
          image_url?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          area?: number
          progress?: number
          description?: string
          current_status?: string | null
          notes?: string | null
          image_url?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}