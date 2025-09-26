import defaultClient from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";

export interface ProductLine {
  id: string;
  brandId: string;
  name: string;
  description?: string;
  form: "powder" | "rtd";
  createdAt: string;
  updatedAt: string;
  brand?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
}

export interface CreateProductLineInput {
  brandId: string;
  name: string;
  description?: string;
  form: "powder" | "rtd";
}

export async function getProductLines(
  supabaseClient?: SupabaseClient<Database>,
): Promise<ProductLine[]> {
  const client = supabaseClient || defaultClient;

  const { data, error } = await client
    .from("product_lines")
    .select(
      `
      id,
      brand_id,
      name,
      description,
      form,
      created_at,
      updated_at,
      brands (
        id,
        name,
        logo_url
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching product lines:", error);
    throw new Error("Failed to fetch product lines");
  }

  return (data || []).map((line) => ({
    id: line.id,
    brandId: line.brand_id,
    name: line.name,
    description: line.description || undefined,
    form: line.form as "powder" | "rtd",
    createdAt: line.created_at,
    updatedAt: line.updated_at,
    brand: line.brands
      ? {
          id: line.brands.id,
          name: line.brands.name,
          logoUrl: line.brands.logo_url || undefined,
        }
      : undefined,
  }));
}

export async function createProductLine(
  input: CreateProductLineInput,
  supabaseClient?: SupabaseClient<Database>,
): Promise<ProductLine> {
  const client = supabaseClient || defaultClient;

  const { data, error } = await client
    .from("product_lines")
    .insert({
      brand_id: input.brandId,
      name: input.name,
      description: input.description,
      form: input.form,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating product line:", error);
    throw new Error("Failed to create product line");
  }

  return {
    id: data.id,
    brandId: data.brand_id,
    name: data.name,
    description: data.description || undefined,
    form: data.form as "powder" | "rtd",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteProductLine(
  id: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<void> {
  const client = supabaseClient || defaultClient;

  const { error } = await client.from("product_lines").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product line:", error);
    throw new Error("Failed to delete product line");
  }
}