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
          slug: string
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
          slug: string
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
          slug?: string
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
          product_sku_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_sku_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_sku_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_sku_id_product_skus_id_fk"
            columns: ["product_sku_id"]
            isOneToOne: false
            referencedRelation: "product_skus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_product_sku_id_product_skus_id_fk"
            columns: ["product_sku_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["sku_id"]
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
      line_flavor_protein_types: {
        Row: {
          created_at: string
          id: string
          line_flavor_id: string
          protein_type_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_flavor_id: string
          protein_type_id: string
        }
        Update: {
          created_at?: string
          id?: string
          line_flavor_id?: string
          protein_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "line_flavor_protein_types_line_flavor_id_line_flavors_id_fk"
            columns: ["line_flavor_id"]
            isOneToOne: false
            referencedRelation: "line_flavors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "line_flavor_protein_types_line_flavor_id_line_flavors_id_fk"
            columns: ["line_flavor_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["line_flavor_id"]
          },
          {
            foreignKeyName: "line_flavor_protein_types_protein_type_id_protein_types_id_fk"
            columns: ["protein_type_id"]
            isOneToOne: false
            referencedRelation: "protein_types"
            referencedColumns: ["id"]
          },
        ]
      }
      line_flavors: {
        Row: {
          created_at: string
          flavor_category: Database["public"]["Enums"]["flavor_category"] | null
          flavor_name: string
          id: string
          line_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          flavor_category?:
            | Database["public"]["Enums"]["flavor_category"]
            | null
          flavor_name: string
          id?: string
          line_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          flavor_category?:
            | Database["public"]["Enums"]["flavor_category"]
            | null
          flavor_name?: string
          id?: string
          line_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "line_flavors_line_id_product_lines_id_fk"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "line_flavors_line_id_product_lines_id_fk"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["product_line_id"]
          },
        ]
      }
      nutrition_info: {
        Row: {
          additional_nutrients: Json | null
          allergen_info: string | null
          calcium: number | null
          calories: number | null
          carbs: number | null
          cholesterol: number | null
          created_at: string
          dietary_fiber: number | null
          fat: number | null
          id: string
          line_flavor_id: string | null
          protein: number
          saturated_fat: number | null
          serving_size: number | null
          sodium: number | null
          sugar: number | null
          trans_fat: number | null
          unsaturated_fat: number | null
          updated_at: string
        }
        Insert: {
          additional_nutrients?: Json | null
          allergen_info?: string | null
          calcium?: number | null
          calories?: number | null
          carbs?: number | null
          cholesterol?: number | null
          created_at?: string
          dietary_fiber?: number | null
          fat?: number | null
          id?: string
          line_flavor_id?: string | null
          protein: number
          saturated_fat?: number | null
          serving_size?: number | null
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          unsaturated_fat?: number | null
          updated_at?: string
        }
        Update: {
          additional_nutrients?: Json | null
          allergen_info?: string | null
          calcium?: number | null
          calories?: number | null
          carbs?: number | null
          cholesterol?: number | null
          created_at?: string
          dietary_fiber?: number | null
          fat?: number | null
          id?: string
          line_flavor_id?: string | null
          protein?: number
          saturated_fat?: number | null
          serving_size?: number | null
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          unsaturated_fat?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_info_line_flavor_id_line_flavors_id_fk"
            columns: ["line_flavor_id"]
            isOneToOne: true
            referencedRelation: "line_flavors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_info_line_flavor_id_line_flavors_id_fk"
            columns: ["line_flavor_id"]
            isOneToOne: true
            referencedRelation: "products_with_details"
            referencedColumns: ["line_flavor_id"]
          },
        ]
      }
      product_flavors: {
        Row: {
          created_at: string
          id: string
          line_flavor_id: string
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_flavor_id: string
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          line_flavor_id?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_flavors_line_flavor_id_line_flavors_id_fk"
            columns: ["line_flavor_id"]
            isOneToOne: false
            referencedRelation: "line_flavors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_flavors_line_flavor_id_line_flavors_id_fk"
            columns: ["line_flavor_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["line_flavor_id"]
          },
          {
            foreignKeyName: "product_flavors_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_flavors_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_lines: {
        Row: {
          brand_id: string
          created_at: string
          description: string | null
          form: Database["public"]["Enums"]["product_form"]
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          description?: string | null
          form?: Database["public"]["Enums"]["product_form"]
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          description?: string | null
          form?: Database["public"]["Enums"]["product_form"]
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_lines_brand_id_brands_id_fk"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_lines_brand_id_brands_id_fk"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      product_skus: {
        Row: {
          barcode: string | null
          created_at: string
          display_order: number | null
          favorites_count: number | null
          id: string
          images: Json | null
          is_available: boolean | null
          name: string
          primary_image: string | null
          product_flavor_id: string
          purchase_url: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          created_at?: string
          display_order?: number | null
          favorites_count?: number | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          name: string
          primary_image?: string | null
          product_flavor_id: string
          purchase_url?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          created_at?: string
          display_order?: number | null
          favorites_count?: number | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          name?: string
          primary_image?: string | null
          product_flavor_id?: string
          purchase_url?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_skus_product_flavor_id_product_flavors_id_fk"
            columns: ["product_flavor_id"]
            isOneToOne: false
            referencedRelation: "product_flavors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_skus_product_flavor_id_product_flavors_id_fk"
            columns: ["product_flavor_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["product_flavor_id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: string
          line_id: string | null
          package_type: Database["public"]["Enums"]["package_type"]
          servings_per_container: number | null
          size: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_id?: string | null
          package_type: Database["public"]["Enums"]["package_type"]
          servings_per_container?: number | null
          size?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          line_id?: string | null
          package_type?: Database["public"]["Enums"]["package_type"]
          servings_per_container?: number | null
          size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_line_id_product_lines_id_fk"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_line_id_product_lines_id_fk"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "products_with_details"
            referencedColumns: ["product_line_id"]
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
      protein_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["protein_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["protein_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["protein_type"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_filter_options: {
        Row: {
          label: unknown | null
          label_en: string | null
          logo_url: string | null
          option_type: string | null
          product_count: number | null
          value: string | null
        }
        Relationships: []
      }
      products_with_details: {
        Row: {
          additional_nutrients: Json | null
          allergen_info: string | null
          barcode: string | null
          brand_id: string | null
          brand_is_active: boolean | null
          brand_logo_url: string | null
          brand_name: string | null
          brand_name_en: string | null
          brand_website: string | null
          calcium: number | null
          calories: number | null
          carbs: number | null
          cholesterol: number | null
          created_at: string | null
          dietary_fiber: number | null
          display_order: number | null
          fat: number | null
          favorites_count: number | null
          flavor_category: string | null
          flavor_name: string | null
          form: string | null
          images: Json | null
          is_available: boolean | null
          line_description: string | null
          line_flavor_id: string | null
          line_name: string | null
          package_type: string | null
          primary_image: string | null
          product_flavor_id: string | null
          product_id: string | null
          product_line_id: string | null
          protein: number | null
          protein_types: Json | null
          purchase_url: string | null
          saturated_fat: number | null
          serving_size: number | null
          servings_per_container: number | null
          size: string | null
          sku_id: string | null
          sku_name: string | null
          slug: string | null
          sodium: number | null
          sugar: number | null
          trans_fat: number | null
          unsaturated_fat: number | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_random_username: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
          option_name: string
          option_type: string
          option_value: string
        }[]
      }
      get_product_detail: {
        Args: { sku_id_param: string }
        Returns: {
          brand_info: Json
          is_favorited: boolean
          product_line_info: Json
          related_skus: Json
          selected_sku: Json
        }[]
      }
      get_product_detail_by_slug: {
        Args: { slug_param: string }
        Returns: {
          brand_info: Json
          is_favorited: boolean
          product_line_info: Json
          related_skus: Json
          selected_sku: Json
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
          barcode: string
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
          line_description: string
          line_id: string
          line_name: string
          package_type: string
          primary_image: string
          product_id: string
          product_name: string
          protein: number
          protein_types: Json
          purchase_url: string
          size: string
          sku_id: string
          sku_name: string
          slug: string
          sugar: number
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
          barcode: string
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
          line_description: string
          line_id: string
          line_name: string
          package_type: string
          primary_image: string
          product_id: string
          product_name: string
          protein: number
          protein_types: Json
          purchase_url: string
          size: string
          sku_id: string
          sku_name: string
          slug: string
          sugar: number
        }[]
      }
    }
    Enums: {
      article_category: "guide" | "brand" | "exercise" | "diet" | "trend"
      article_status: "draft" | "review" | "published" | "archived"
      flavor_category:
        | "grain"
        | "chocolate"
        | "strawberry"
        | "banana"
        | "milk"
        | "coffee"
        | "original"
        | "black_sesame"
        | "milktea"
        | "greentea"
        | "vanilla"
        | "corn"
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
        "grain",
        "chocolate",
        "strawberry",
        "banana",
        "milk",
        "coffee",
        "original",
        "black_sesame",
        "milktea",
        "greentea",
        "vanilla",
        "corn",
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
