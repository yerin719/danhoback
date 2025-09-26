import defaultClient from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";

export interface Brand {
  id: string;
  name: string;
  nameEn?: string;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
}

export async function getBrands(
  supabaseClient?: SupabaseClient<Database>,
): Promise<Brand[]> {
  const client = supabaseClient || defaultClient;

  const { data, error } = await client
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }

  return (data || []).map((brand) => ({
    id: brand.id,
    name: brand.name,
    nameEn: brand.name_en || undefined,
    logoUrl: brand.logo_url || undefined,
    website: brand.website || undefined,
    isActive: brand.is_active,
  }));
}