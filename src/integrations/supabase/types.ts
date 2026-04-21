export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      company_profiles: {
        Row: {
          company_name: string
          company_size: string | null
          contact_role: string | null
          created_at: string
          id: string
          industry: string | null
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_name: string
          company_size?: string | null
          contact_role?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_name?: string
          company_size?: string | null
          contact_role?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      corporate_inquiries: {
        Row: {
          budget: string | null
          company_id: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          expectations: string | null
          format: string | null
          id: string
          needs: string[]
          recommendation: Json | null
          user_id: string
        }
        Insert: {
          budget?: string | null
          company_id?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          expectations?: string | null
          format?: string | null
          id?: string
          needs?: string[]
          recommendation?: Json | null
          user_id: string
        }
        Update: {
          budget?: string | null
          company_id?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          expectations?: string | null
          format?: string | null
          id?: string
          needs?: string[]
          recommendation?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_inquiries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_applications: {
        Row: {
          course_description: string | null
          course_name: string
          created_at: string
          duration: string | null
          email: string
          format: string
          free_intro: boolean
          full_name: string
          id: string
          level: string
          phone: string
          price: number
          professional_title: string
          sample_link: string | null
          teaching_experience: string | null
          tools: string[] | null
          topic: string
          user_id: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          course_description?: string | null
          course_name: string
          created_at?: string
          duration?: string | null
          email: string
          format: string
          free_intro?: boolean
          full_name: string
          id?: string
          level: string
          phone: string
          price?: number
          professional_title: string
          sample_link?: string | null
          teaching_experience?: string | null
          tools?: string[] | null
          topic: string
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          course_description?: string | null
          course_name?: string
          created_at?: string
          duration?: string | null
          email?: string
          format?: string
          free_intro?: boolean
          full_name?: string
          id?: string
          level?: string
          phone?: string
          price?: number
          professional_title?: string
          sample_link?: string | null
          teaching_experience?: string | null
          tools?: string[] | null
          topic?: string
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          id: string
          message: string | null
          seeker_email: string
          seeker_name: string
          seeker_phone: string | null
          status: string
          therapist_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          seeker_email: string
          seeker_name: string
          seeker_phone?: string | null
          status?: string
          therapist_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          seeker_email?: string
          seeker_name?: string
          seeker_phone?: string | null
          status?: string
          therapist_id?: string
        }
        Relationships: []
      }
      practitioner_applications: {
        Row: {
          accepting_new_clients: boolean
          approaches: string[]
          area: string | null
          bio: string | null
          created_at: string
          email: string
          format: string
          full_name: string
          id: string
          languages: string[]
          phone: string
          price_per_session: number
          professional_title: string
          profile_image_url: string | null
          service_types: string[]
          specialties: string[]
          status: string
          user_id: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          accepting_new_clients?: boolean
          approaches?: string[]
          area?: string | null
          bio?: string | null
          created_at?: string
          email: string
          format?: string
          full_name: string
          id?: string
          languages?: string[]
          phone: string
          price_per_session?: number
          professional_title: string
          profile_image_url?: string | null
          service_types?: string[]
          specialties?: string[]
          status?: string
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          accepting_new_clients?: boolean
          approaches?: string[]
          area?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          format?: string
          full_name?: string
          id?: string
          languages?: string[]
          phone?: string
          price_per_session?: number
          professional_title?: string
          profile_image_url?: string | null
          service_types?: string[]
          specialties?: string[]
          status?: string
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          answers: Json
          created_at: string
          free_text: string | null
          id: string
          recommendation: Json | null
          seeker_email: string | null
          track: string
          user_id: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string
          free_text?: string | null
          id?: string
          recommendation?: Json | null
          seeker_email?: string | null
          track: string
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          free_text?: string | null
          id?: string
          recommendation?: Json | null
          seeker_email?: string | null
          track?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "consumer" | "practitioner" | "company"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["consumer", "practitioner", "company"],
    },
  },
} as const
