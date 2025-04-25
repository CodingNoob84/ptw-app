export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      floors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: number
          tower_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: number
          tower_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: number
          tower_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "floors_tower_id_fkey"
            columns: ["tower_id"]
            isOneToOne: false
            referencedRelation: "towers"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          permit_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          permit_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          permit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permit_attachments_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permits"
            referencedColumns: ["id"]
          },
        ]
      }
      permits: {
        Row: {
          assigned_to: string | null
          category_id: string | null
          comments: string | null
          created_at: string | null
          created_by: string | null
          floor_id: string | null
          id: string
          ismanager_completed: boolean | null
          issa_completed: boolean | null
          manager_id: string | null
          project_id: string | null
          sa_id: string | null
          status: string | null
          status_msg: string | null
          subcategory_id: string | null
          tower_id: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category_id?: string | null
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          floor_id?: string | null
          id?: string
          ismanager_completed?: boolean | null
          issa_completed?: boolean | null
          manager_id?: string | null
          project_id?: string | null
          sa_id?: string | null
          status?: string | null
          status_msg?: string | null
          subcategory_id?: string | null
          tower_id?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category_id?: string | null
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          floor_id?: string | null
          id?: string
          ismanager_completed?: boolean | null
          issa_completed?: boolean | null
          manager_id?: string | null
          project_id?: string | null
          sa_id?: string | null
          status?: string | null
          status_msg?: string | null
          subcategory_id?: string | null
          tower_id?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permits_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "floors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_sa_id_fkey"
            columns: ["sa_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_tower_id_fkey"
            columns: ["tower_id"]
            isOneToOne: false
            referencedRelation: "towers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reporting: {
        Row: {
          created_at: string
          id: string
          reportingid: string | null
          userid: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          reportingid?: string | null
          userid?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          reportingid?: string | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reporting_reportingid_fkey"
            columns: ["reportingid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reporting_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      request_status: {
        Row: {
          comments: string | null
          id: string
          permit_id: string
          stage: number | null
          status: string | null
          status_msg: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comments?: string | null
          id?: string
          permit_id: string
          stage?: number | null
          status?: string | null
          status_msg?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comments?: string | null
          id?: string
          permit_id?: string
          stage?: number | null
          status?: string | null
          status_msg?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_status_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      towers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "towers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string | null
          description: string | null
          floor_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          floor_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          floor_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "floors"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          authid: string | null
          created_at: string
          email: string
          firstname: string | null
          id: string
          lastname: string | null
          password: string | null
          position: number | null
          role: string | null
        }
        Insert: {
          authid?: string | null
          created_at?: string
          email: string
          firstname?: string | null
          id?: string
          lastname?: string | null
          password?: string | null
          position?: number | null
          role?: string | null
        }
        Update: {
          authid?: string | null
          created_at?: string
          email?: string
          firstname?: string | null
          id?: string
          lastname?: string | null
          password?: string | null
          position?: number | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_permit_by_id: {
        Args: { p_permit_id: string; p_user_id: string }
        Returns: {
          permit_id: string
          project_id: string
          project_name: string
          tower_id: string
          tower_name: string
          floor_id: string
          floor_number: number
          unit_id: string
          unit_number: string
          category_id: string
          category_name: string
          subcategory_id: string
          subcategory_name: string
          assigned_to: string
          permit_comments: string
          created_by: string
          created_by_name: string
          created_by_email: string
          created_at: string
          updated_at: string
          sa_id: string
          sa_name: string
          sa_email: string
          manager_id: string
          manager_name: string
          manager_email: string
          current_status_id: string
          current_status: Database["public"]["Enums"]["status_type"]
          status_comments: string
          status_updated_at: string
          current_sender_id: string
          current_receiver_id: string
          action_required: boolean
          action_due_date: string
          status_history: Json
        }[]
      }
      get_permit_details: {
        Args: { p_permitid: string }
        Returns: Json
      }
      get_permits_by_user: {
        Args: { user_id: string }
        Returns: {
          permit_id: string
          project_id: string
          project_name: string
          tower_id: string
          tower_name: string
          floor_id: string
          floor_number: number
          unit_id: string
          unit_number: string
          category_id: string
          category_name: string
          subcategory_id: string
          subcategory_name: string
          assigned_to: string
          permit_comments: string
          created_by: string
          created_by_name: string
          created_by_email: string
          created_at: string
          updated_at: string
          current_status: Database["public"]["Enums"]["status_type"]
          status_comments: string
          status_updated_at: string
          current_sender_id: string
          current_receiver_id: string
          action_required: boolean
          action_due_date: string
          status_history: Json
        }[]
      }
      get_project_details: {
        Args: { p_project_id: string }
        Returns: Json
      }
      get_user_permits: {
        Args: { p_userid: string }
        Returns: Json
      }
      get_user_permits_with_latest_status: {
        Args: { p_userid: string }
        Returns: Json
      }
      get_user_permits_with_status_history: {
        Args: { p_userid: string }
        Returns: Json
      }
      get_user_with_reporting: {
        Args: { auth_id: string }
        Returns: Json
      }
      get_users_with_reporting: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          firstname: string
          lastname: string
          email: string
          role: string
          reporting_to: Json
        }[]
      }
    }
    Enums: {
      status_type:
        | "requested"
        | "pending"
        | "approved"
        | "rejected"
        | "resubmit"
        | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_type: [
        "requested",
        "pending",
        "approved",
        "rejected",
        "resubmit",
        "completed",
      ],
    },
  },
} as const
