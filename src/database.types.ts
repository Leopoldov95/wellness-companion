export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      daily_tasks: {
        Row: {
          completed: boolean;
          date: string;
          id: number;
          weekly_goal_id: number;
        };
        Insert: {
          completed?: boolean;
          date?: string;
          id?: number;
          weekly_goal_id: number;
        };
        Update: {
          completed?: boolean;
          date?: string;
          id?: number;
          weekly_goal_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "daily_tasks_weekly_goal_id_fkey";
            columns: ["weekly_goal_id"];
            isOneToOne: false;
            referencedRelation: "weekly_goals";
            referencedColumns: ["id"];
          }
        ];
      };
      goals: {
        Row: {
          category: string;
          color: string;
          created_at: string;
          due_date: string;
          id: number;
          last_updated: string;
          num_tasks: number;
          progress: number;
          status: Database["public"]["Enums"]["goal_status"];
          title: string;
          user_id: string;
        };
        Insert: {
          category: string;
          color: string;
          created_at?: string;
          due_date: string;
          id?: number;
          last_updated?: string;
          num_tasks: number;
          progress?: number;
          status?: Database["public"]["Enums"]["goal_status"];
          title: string;
          user_id: string;
        };
        Update: {
          category?: string;
          color?: string;
          created_at?: string;
          due_date?: string;
          id?: number;
          last_updated?: string;
          num_tasks?: number;
          progress?: number;
          status?: Database["public"]["Enums"]["goal_status"];
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      journal: {
        Row: {
          created_at: string;
          id: number;
          is_favorite: boolean;
          is_shared: boolean;
          item_1: string;
          item_2: string;
          item_3: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_favorite?: boolean;
          is_shared?: boolean;
          item_1: string;
          item_2: string;
          item_3: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_favorite?: boolean;
          is_shared?: boolean;
          item_1?: string;
          item_2?: string;
          item_3?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journal_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      journal_shared_views: {
        Row: {
          created_at: string;
          id: number;
          journal_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          journal_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          journal_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journal_shared_views_journal_id_fkey";
            columns: ["journal_id"];
            isOneToOne: false;
            referencedRelation: "journal";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "journal_shared_views_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      moods: {
        Row: {
          created_at: string;
          id: number;
          mood: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          mood: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          mood?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "moods_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name: string;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      weekly_goals: {
        Row: {
          created_at: string;
          end_date: string;
          goal_id: number;
          id: number;
          start_date: string;
          status: Database["public"]["Enums"]["goal_status"];
          title: string;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          goal_id: number;
          id?: number;
          start_date: string;
          status?: Database["public"]["Enums"]["goal_status"];
          title: string;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          goal_id?: number;
          id?: number;
          start_date?: string;
          status?: Database["public"]["Enums"]["goal_status"];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "weekly_goals_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      extract_date: {
        Args: { "": string };
        Returns: string;
      };
      get_unseen_shared_journals: {
        Args: { p_user_id: string };
        Returns: {
          id: number;
          created_at: string;
          user_id: string;
          item_1: string;
          item_2: string;
          item_3: string;
          is_shared: boolean;
          is_favorite: boolean;
          updated_at: string;
        }[];
      };
      insert_goal_with_weekly_goal: {
        Args: {
          p_user_id: string;
          p_title: string;
          p_category: string;
          p_num_tasks: number;
          p_color: string;
          p_due_date: string;
          p_weekly_task: string;
          p_start_date: string;
          p_end_date: string;
        };
        Returns: {
          goal_id: number;
          weekly_goal_id: number;
        }[];
      };
    };
    Enums: {
      goal_status: "active" | "completed" | "expired";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      goal_status: ["active", "completed", "expired"],
    },
  },
} as const;
