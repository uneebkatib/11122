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
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          content_type: string
          created_at: string
          email_id: string
          filename: string
          id: string
          size: number
          storage_path: string
        }
        Insert: {
          content_type: string
          created_at?: string
          email_id: string
          filename: string
          id?: string
          size: number
          storage_path: string
        }
        Update: {
          content_type?: string
          created_at?: string
          email_id?: string
          filename?: string
          id?: string
          size?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_verified: boolean | null
          last_verification_attempt: string | null
          mx_record: string | null
          user_id: string | null
          verification_status:
            | Database["public"]["Enums"]["domain_status"]
            | null
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_verified?: boolean | null
          last_verification_attempt?: string | null
          mx_record?: string | null
          user_id?: string | null
          verification_status?:
            | Database["public"]["Enums"]["domain_status"]
            | null
          verification_token: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_verified?: boolean | null
          last_verification_attempt?: string | null
          mx_record?: string | null
          user_id?: string | null
          verification_status?:
            | Database["public"]["Enums"]["domain_status"]
            | null
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      custom_emails: {
        Row: {
          created_at: string | null
          domain: string
          email_address: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          email_address: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          email_address?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean | null
          is_global: boolean | null
          last_verification_attempt: string | null
          mx_record: string | null
          verification_status: string | null
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          last_verification_attempt?: string | null
          mx_record?: string | null
          verification_status?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          last_verification_attempt?: string | null
          mx_record?: string | null
          verification_status?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      email_filters: {
        Row: {
          created_at: string
          created_by: string | null
          filter_type: string
          id: string
          is_active: boolean | null
          pattern: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          filter_type: string
          id?: string
          is_active?: boolean | null
          pattern: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          filter_type?: string
          id?: string
          is_active?: boolean | null
          pattern?: string
        }
        Relationships: []
      }
      email_usage: {
        Row: {
          id: string
          ip_address: string | null
          used_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          used_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          used_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          attachments: Json | null
          body: string | null
          created_at: string | null
          created_by: string | null
          email_type: Database["public"]["Enums"]["email_type"] | null
          expires_at: string | null
          from_email: string
          headers: Json | null
          html_body: string | null
          id: string
          is_expired: boolean | null
          is_read: boolean | null
          message_id: string | null
          received_at: string | null
          subject: string | null
          temp_email: string
          to_email: string | null
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          created_at?: string | null
          created_by?: string | null
          email_type?: Database["public"]["Enums"]["email_type"] | null
          expires_at?: string | null
          from_email: string
          headers?: Json | null
          html_body?: string | null
          id?: string
          is_expired?: boolean | null
          is_read?: boolean | null
          message_id?: string | null
          received_at?: string | null
          subject?: string | null
          temp_email: string
          to_email?: string | null
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          created_at?: string | null
          created_by?: string | null
          email_type?: Database["public"]["Enums"]["email_type"] | null
          expires_at?: string | null
          from_email?: string
          headers?: Json | null
          html_body?: string | null
          id?: string
          is_expired?: boolean | null
          is_read?: boolean | null
          message_id?: string | null
          received_at?: string | null
          subject?: string | null
          temp_email?: string
          to_email?: string | null
        }
        Relationships: []
      }
      imap_configs: {
        Row: {
          created_at: string
          encryption: string
          host: string
          id: string
          is_active: boolean | null
          password: string
          port: number
          username: string
        }
        Insert: {
          created_at?: string
          encryption?: string
          host: string
          id?: string
          is_active?: boolean | null
          password: string
          port: number
          username: string
        }
        Update: {
          created_at?: string
          encryption?: string
          host?: string
          id?: string
          is_active?: boolean | null
          password?: string
          port?: number
          username?: string
        }
        Relationships: []
      }
      mail_server_config: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_username: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_username: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          smtp_host?: string
          smtp_password?: string
          smtp_port?: number
          smtp_username?: string
          updated_at?: string
        }
        Relationships: []
      }
      mail_servers: {
        Row: {
          created_at: string
          domain: string
          hostname: string
          id: string
          is_active: boolean | null
          last_check_at: string | null
          password: string
          port: number
          server_type: Database["public"]["Enums"]["mail_server_type"]
          updated_at: string
          use_tls: boolean | null
          username: string
        }
        Insert: {
          created_at?: string
          domain: string
          hostname: string
          id?: string
          is_active?: boolean | null
          last_check_at?: string | null
          password: string
          port: number
          server_type: Database["public"]["Enums"]["mail_server_type"]
          updated_at?: string
          use_tls?: boolean | null
          username: string
        }
        Update: {
          created_at?: string
          domain?: string
          hostname?: string
          id?: string
          is_active?: boolean | null
          last_check_at?: string | null
          password?: string
          port?: number
          server_type?: Database["public"]["Enums"]["mail_server_type"]
          updated_at?: string
          use_tls?: boolean | null
          username?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          crypto_transaction_id: string | null
          currency: string
          id: string
          payment_intent_id: string | null
          payment_method: string
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          crypto_transaction_id?: string | null
          currency: string
          id?: string
          payment_intent_id?: string | null
          payment_method: string
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          crypto_transaction_id?: string | null
          currency?: string
          id?: string
          payment_intent_id?: string | null
          payment_method?: string
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          created_at: string
          duration_days: number
          features: Json
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          duration_days: number
          features: Json
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          duration_days?: number
          features?: Json
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email_limit_per_hour: number | null
          id: string
          is_admin: boolean | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
        }
        Insert: {
          created_at?: string
          email_limit_per_hour?: number | null
          id: string
          is_admin?: boolean | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
        }
        Update: {
          created_at?: string
          email_limit_per_hour?: number | null
          id?: string
          is_admin?: boolean | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          coinpayments_transaction_id: string | null
          created_at: string
          crypto_payment_address: string | null
          currency: string | null
          current_period_end: string
          current_period_start: string
          id: string
          payment_method: string | null
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_period: string | null
          user_id: string
        }
        Insert: {
          coinpayments_transaction_id?: string | null
          created_at?: string
          crypto_payment_address?: string | null
          currency?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          payment_method?: string | null
          plan_id: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period?: string | null
          user_id: string
        }
        Update: {
          coinpayments_transaction_id?: string | null
          created_at?: string
          crypto_payment_address?: string | null
          currency?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          payment_method?: string | null
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          provider: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          provider?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_use_custom_domains: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      domain_status: "pending" | "verified" | "failed"
      email_type: "temporary" | "custom"
      mail_server_type: "smtp" | "imap" | "pop3"
      subscription_tier: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
