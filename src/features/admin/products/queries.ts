import defaultClient from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";

export interface ProductSku {
  id: string;
  name: string;
  size: string;
  slug: string;
  primaryImage?: string;
  isAvailable: boolean;
  brandName: string;
  lineName: string;
  flavorName: string;
  packageType: string;
}

export interface CreateProductInput {
  lineId: string;
  packageType: "bulk" | "pouch" | "stick";
  size: string;
  servingsPerContainer?: number;
  flavors: Array<{
    lineFlavorId: string;
    skus: Array<{
      name: string;
      barcode?: string;
      slug: string;
      primaryImage?: string;
      images?: string[];
      purchaseUrl?: string;
      displayOrder?: number;
    }>;
  }>;
}

export async function createProduct(
  input: CreateProductInput,
  supabaseClient?: SupabaseClient<Database>,
): Promise<void> {
  const client = supabaseClient || defaultClient;

  // 기존 product 찾기 (4개 컬럼 조합으로 검색)
  const { data: existingProducts, error: findError } = await client
    .from("products")
    .select("*")
    .eq("line_id", input.lineId)
    .eq("package_type", input.packageType)
    .eq("size", input.size)
    .eq("servings_per_container", input.servingsPerContainer || 0);

  if (findError) {
    console.error("Error finding product:", findError);
    throw new Error(`Failed to find product: ${findError.message}`);
  }

  let productData;

  if (existingProducts && existingProducts.length > 0) {
    // 기존 product 사용 (이미 동일한 조합이 존재)
    productData = existingProducts[0];
  } else {
    // 새 product 생성
    const { data: newProduct, error: productError } = await client
      .from("products")
      .insert({
        line_id: input.lineId,
        package_type: input.packageType,
        size: input.size,
        servings_per_container: input.servingsPerContainer,
      })
      .select()
      .single();

    if (productError) {
      console.error("Error creating product:", {
        message: productError.message,
        details: productError.details,
        hint: productError.hint,
        code: productError.code,
      });
      throw new Error(`Failed to create product: ${productError.message}`);
    }

    productData = newProduct;
  }

  for (const flavor of input.flavors) {
    const { data: productFlavorData, error: productFlavorError } = await client
      .from("product_flavors")
      .insert({
        product_id: productData.id,
        line_flavor_id: flavor.lineFlavorId,
      })
      .select()
      .single();

    if (productFlavorError) {
      console.error("Error creating product flavor:", productFlavorError);
      throw new Error("Failed to create product flavor");
    }

    if (flavor.skus.length > 0) {
      const { error: skusError } = await client.from("product_skus").insert(
        flavor.skus.map((sku) => ({
          product_flavor_id: productFlavorData.id,
          name: sku.name,
          barcode: sku.barcode,
          slug: sku.slug,
          primary_image: sku.primaryImage,
          images: sku.images,
          purchase_url: sku.purchaseUrl,
          display_order: sku.displayOrder || 0,
        })),
      );

      if (skusError) {
        console.error("Error creating SKUs:", skusError);
        throw new Error("Failed to create SKUs");
      }
    }
  }
}

export async function getLineFlavorsByLineId(
  lineId: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<Array<{ id: string; flavorName: string; flavorCategory?: string }>> {
  const client = supabaseClient || defaultClient;

  const { data, error } = await client
    .from("line_flavors")
    .select("id, flavor_name, flavor_category")
    .eq("line_id", lineId)
    .order("flavor_name");

  if (error) {
    console.error("Error fetching line flavors:", error);
    throw new Error("Failed to fetch line flavors");
  }

  return (data || []).map((flavor) => ({
    id: flavor.id,
    flavorName: flavor.flavor_name,
    flavorCategory: flavor.flavor_category || undefined,
  }));
}

export async function getProductSkus(
  supabaseClient?: SupabaseClient<Database>,
): Promise<ProductSku[]> {
  const client = supabaseClient || defaultClient;

  const { data, error } = await client
    .from("product_skus")
    .select(
      `
      id,
      name,
      slug,
      primary_image,
      is_available,
      product_flavors (
        line_flavors (
          flavor_name,
          product_lines (
            name,
            brands (
              name
            )
          )
        ),
        products (
          package_type,
          size
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching product SKUs:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to fetch product SKUs: ${error.message}`);
  }

  return (data || []).map((sku) => ({
    id: sku.id,
    name: sku.name,
    size: sku.product_flavors?.products?.size || "",
    slug: sku.slug,
    primaryImage: sku.primary_image || undefined,
    isAvailable: sku.is_available ?? true,
    brandName: sku.product_flavors?.line_flavors?.product_lines?.brands?.name || "",
    lineName: sku.product_flavors?.line_flavors?.product_lines?.name || "",
    flavorName: sku.product_flavors?.line_flavors?.flavor_name || "",
    packageType: sku.product_flavors?.products?.package_type || "",
  }));
}

export async function toggleSkuAvailability(
  id: string,
  isAvailable: boolean,
  supabaseClient?: SupabaseClient<Database>,
): Promise<void> {
  const client = supabaseClient || defaultClient;

  const { error } = await client
    .from("product_skus")
    .update({ is_available: isAvailable })
    .eq("id", id);

  if (error) {
    console.error("Error toggling SKU availability:", error);
    throw new Error("Failed to toggle SKU availability");
  }
}

export async function deleteProductSku(
  id: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<void> {
  const client = supabaseClient || defaultClient;

  const { error } = await client.from("product_skus").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product SKU:", error);
    throw new Error("Failed to delete product SKU");
  }
}
