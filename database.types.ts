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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      article_tag_relations: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tag_relations_article_id_articles_id_fk"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tag_relations_tag_id_article_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "article_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: Database["public"]["Enums"]["article_category"]
          content: string
          created_at: string
          featured_image: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          published_at: string | null
          read_time: number | null
          slug: string | null
          status: Database["public"]["Enums"]["article_status"] | null
          summary: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category: Database["public"]["Enums"]["article_category"]
          content: string
          created_at?: string
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          read_time?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["article_status"] | null
          summary?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: Database["public"]["Enums"]["article_category"]
          content?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string | null
          read_time?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["article_status"] | null
          summary?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          name_en: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          name_en?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          name_en?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          product_variant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_variant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_variant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_variant_id_product_variants_id_fk"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_product_variant_id_product_variants_id_fk"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "favorites_user_id_profiles_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          barcode: string | null
          created_at: string
          display_order: number | null
          favorites_count: number | null
          flavor_category: Database["public"]["Enums"]["flavor_category"] | null
          flavor_name: string | null
          id: string
          images: Json | null
          is_available: boolean | null
          name: string
          package_type: Database["public"]["Enums"]["package_type"] | null
          primary_image: string | null
          product_id: string
          purchase_url: string | null
          serving_size: number | null
          servings_per_container: number | null
          size: string | null
          slug: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          created_at?: string
          display_order?: number | null
          favorites_count?: number | null
          flavor_category?:
            | Database["public"]["Enums"]["flavor_category"]
            | null
          flavor_name?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          name: string
          package_type?: Database["public"]["Enums"]["package_type"] | null
          primary_image?: string | null
          product_id: string
          purchase_url?: string | null
          serving_size?: number | null
          servings_per_container?: number | null
          size?: string | null
          slug: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          created_at?: string
          display_order?: number | null
          favorites_count?: number | null
          flavor_category?:
            | Database["public"]["Enums"]["flavor_category"]
            | null
          flavor_name?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          name?: string
          package_type?: Database["public"]["Enums"]["package_type"] | null
          primary_image?: string | null
          product_id?: string
          purchase_url?: string | null
          serving_size?: number | null
          servings_per_container?: number | null
          size?: string | null
          slug?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["product_id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string
          created_at: string
          form: Database["public"]["Enums"]["product_form"]
          id: string
          is_active: boolean
          name: string
          protein_type: Database["public"]["Enums"]["protein_type"]
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          form?: Database["public"]["Enums"]["product_form"]
          id?: string
          is_active?: boolean
          name: string
          protein_type: Database["public"]["Enums"]["protein_type"]
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          form?: Database["public"]["Enums"]["product_form"]
          id?: string
          is_active?: boolean
          name?: string
          protein_type?: Database["public"]["Enums"]["protein_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_brands_id_fk"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      variant_nutrition: {
        Row: {
          additional_nutrients: Json | null
          allergen_info: string | null
          bcaa: number | null
          calcium: number | null
          calories: number | null
          carbs: number | null
          cholesterol: number | null
          created_at: string
          fat: number | null
          id: string
          protein: number
          saturated_fat: number | null
          sodium: number | null
          sugar: number | null
          updated_at: string
          variant_id: string
        }
        Insert: {
          additional_nutrients?: Json | null
          allergen_info?: string | null
          bcaa?: number | null
          calcium?: number | null
          calories?: number | null
          carbs?: number | null
          cholesterol?: number | null
          created_at?: string
          fat?: number | null
          id?: string
          protein: number
          saturated_fat?: number | null
          sodium?: number | null
          sugar?: number | null
          updated_at?: string
          variant_id: string
        }
        Update: {
          additional_nutrients?: Json | null
          allergen_info?: string | null
          bcaa?: number | null
          calcium?: number | null
          calories?: number | null
          carbs?: number | null
          cholesterol?: number | null
          created_at?: string
          fat?: number | null
          id?: string
          protein?: number
          saturated_fat?: number | null
          sodium?: number | null
          sugar?: number | null
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_nutrition_variant_id_product_variants_id_fk"
            columns: ["variant_id"]
            isOneToOne: true
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_nutrition_variant_id_product_variants_id_fk"
            columns: ["variant_id"]
            isOneToOne: true
            referencedRelation: "products_with_details"
            referencedColumns: ["variant_id"]
          },
        ]
      }
    }
    Views: {
      product_filter_options: {
        Row: {
          filter_option: Json | null
        }
        Relationships: []
      }
      products_with_details: {
        Row: {
          additional_nutrients: Json | null
          allergen_info: string | null
          barcode: string | null
          bcaa: number | null
          brand_id: string | null
          brand_logo_url: string | null
          brand_name: string | null
          brand_name_en: string | null
          brand_website: string | null
          calcium: number | null
          calories: number | null
          carbs: number | null
          cholesterol: number | null
          created_at: string | null
          display_order: number | null
          fat: number | null
          favorites_count: number | null
          flavor_category: string | null
          flavor_name: string | null
          form: string | null
          images: Json | null
          is_active: boolean | null
          is_available: boolean | null
          package_type: string | null
          primary_image: string | null
          product_id: string | null
          product_name: string | null
          protein: number | null
          protein_type: string | null
          purchase_url: string | null
          saturated_fat: number | null
          serving_size: number | null
          servings_per_container: number | null
          size: string | null
          sodium: number | null
          sugar: number | null
          total_amount: number | null
          updated_at: string | null
          variant_id: string | null
          variant_name: string | null
          variant_slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_brands_id_fk"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_article_category_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_read_time: number
          category: string
          latest_published: string
          total_articles: number
          total_views: number
        }[]
      }
      get_filter_options: {
        Args: { filter_type?: string }
        Returns: {
          option_type: string
          option_value: string
        }[]
      }
      get_product_detail: {
        Args: { variant_slug_param: string }
        Returns: {
          brand_info: Json
          is_favorited: boolean
          product_info: Json
          related_variants: Json
          selected_variant: Json
        }[]
      }
      get_related_articles_advanced: {
        Args: { article_id_param: string; limit_param?: number }
        Returns: {
          author_name: string
          category: string
          featured_image: string
          id: string
          published_at: string
          similarity_score: number
          summary: string
          title: string
          view_count: number
        }[]
      }
      get_user_favorites: {
        Args: Record<PropertyKey, never>
        Returns: {
          brand_id: string
          brand_logo_url: string
          brand_name: string
          brand_name_en: string
          calories: number
          carbs: number
          favorites_count: number
          flavor_category: string
          flavor_name: string
          form: string
          is_favorited: boolean
          package_type: string
          primary_image: string
          product_id: string
          product_name: string
          protein: number
          protein_type: string
          purchase_url: string
          size: string
          sugar: number
          variant_id: string
          variant_name: string
        }[]
      }
      increment_article_view_count: {
        Args: { article_id_param: string }
        Returns: boolean
      }
      search_articles: {
        Args: {
          category_param?: string
          limit_param?: number
          offset_param?: number
          search_query_param?: string
          sort_by_param?: string
          sort_order_param?: string
        }
        Returns: {
          author_id: string
          author_name: string
          category: string
          content: string
          created_at: string
          featured_image: string
          id: string
          is_featured: boolean
          meta_description: string
          meta_keywords: string
          published_at: string
          read_time: number
          relevance_score: number
          slug: string
          status: string
          summary: string
          title: string
          updated_at: string
          view_count: number
        }[]
      }
      search_products: {
        Args: {
          filter_flavors?: string[]
          filter_forms?: string[]
          filter_package_types?: string[]
          filter_protein_types?: string[]
          limit_count?: number
          max_calories?: number
          max_carbs?: number
          max_protein?: number
          max_sugar?: number
          min_calories?: number
          min_carbs?: number
          min_protein?: number
          min_sugar?: number
          offset_count?: number
          search_query?: string
          sort_by?: string
          sort_order?: string
        }
        Returns: {
          brand_id: string
          brand_logo_url: string
          brand_name: string
          brand_name_en: string
          calories: number
          carbs: number
          favorites_count: number
          flavor_category: string
          flavor_name: string
          form: string
          is_favorited: boolean
          package_type: string
          primary_image: string
          product_id: string
          product_name: string
          protein: number
          protein_type: string
          purchase_url: string
          size: string
          slug: string
          sugar: number
          variant_id: string
          variant_name: string
        }[]
      }
    }
    Enums: {
      article_category: "guide" | "brand" | "exercise" | "diet" | "trend"
      article_status: "draft" | "review" | "published" | "archived"
      flavor_category:
        | "chocolate"
        | "strawberry"
        | "banana"
        | "matcha"
        | "grain"
        | "milktea"
        | "greentea"
        | "coffee"
        | "other"
      package_type: "bulk" | "pouch" | "stick"
      product_form: "powder" | "rtd"
      protein_type:
        | "wpi"
        | "wpc"
        | "wph"
        | "wpih"
        | "casein"
        | "goat_milk"
        | "colostrum"
        | "isp"
        | "spc"
        | "pea"
        | "rice"
        | "oat"
        | "mpc"
        | "mpi"
        | "egg"
        | "mixed"
      user_role: "user" | "admin"
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
      article_category: ["guide", "brand", "exercise", "diet", "trend"],
      article_status: ["draft", "review", "published", "archived"],
      flavor_category: [
        "chocolate",
        "strawberry",
        "banana",
        "matcha",
        "grain",
        "milktea",
        "greentea",
        "coffee",
        "other",
      ],
      package_type: ["bulk", "pouch", "stick"],
      product_form: ["powder", "rtd"],
      protein_type: [
        "wpi",
        "wpc",
        "wph",
        "wpih",
        "casein",
        "goat_milk",
        "colostrum",
        "isp",
        "spc",
        "pea",
        "rice",
        "oat",
        "mpc",
        "mpi",
        "egg",
        "mixed",
      ],
      user_role: ["user", "admin"],
    },
  },
} as const
