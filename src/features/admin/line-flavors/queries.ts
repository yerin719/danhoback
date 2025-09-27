import defaultClient from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";

export interface LineFlavor {
  id: string;
  lineId: string;
  flavorCategory?: string;
  flavorName: string;
  createdAt: string;
  updatedAt: string;
  productLine?: {
    id: string;
    name: string;
    brandName: string;
  };
  nutrition?: {
    id: string;
    servingSize?: number;
    calories?: number;
    protein: number;
    carbs?: number;
    sugar?: number;
    fat?: number;
    saturatedFat?: number;
    unsaturatedFat?: number;
    transFat?: number;
    dietaryFiber?: number;
    sodium?: number;
    cholesterol?: number;
    calcium?: number;
    allergenInfo?: string;
  };
  proteinTypes?: Array<{
    id: string;
    type: string;
    name: string;
  }>;
}

export interface CreateLineFlavorInput {
  lineId: string;
  flavorCategory?: string;
  flavorName: string;
  nutrition: {
    servingSize?: number;
    calories?: number;
    protein: number;
    carbs?: number;
    sugar?: number;
    fat?: number;
    saturatedFat?: number;
    unsaturatedFat?: number;
    transFat?: number;
    dietaryFiber?: number;
    sodium?: number;
    cholesterol?: number;
    calcium?: number;
    allergenInfo?: string;
  };
  proteinTypes: Array<{
    proteinTypeId: string;
  }>;
}

export async function getLineFlavors(
  supabaseClient?: SupabaseClient<Database>,
): Promise<LineFlavor[]> {
  const client = supabaseClient || defaultClient;

  const { data, error } = await client
    .from("line_flavors")
    .select(
      `
      id,
      line_id,
      flavor_category,
      flavor_name,
      created_at,
      updated_at,
      product_lines (
        id,
        name,
        brands (
          name
        )
      ),
      nutrition_info (
        id,
        serving_size,
        calories,
        protein,
        carbs,
        sugar,
        fat,
        saturated_fat,
        unsaturated_fat,
        trans_fat,
        dietary_fiber,
        sodium,
        cholesterol,
        calcium,
        allergen_info
      ),
      line_flavor_protein_types (
        id,
        protein_types (
          id,
          type,
          name
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching line flavors:", error);
    throw new Error("Failed to fetch line flavors");
  }

  return (data || []).map((flavor) => ({
    id: flavor.id,
    lineId: flavor.line_id,
    flavorCategory: flavor.flavor_category || undefined,
    flavorName: flavor.flavor_name,
    createdAt: flavor.created_at,
    updatedAt: flavor.updated_at,
    productLine: flavor.product_lines
      ? {
          id: flavor.product_lines.id,
          name: flavor.product_lines.name,
          brandName: flavor.product_lines.brands?.name || "",
        }
      : undefined,
    nutrition: flavor.nutrition_info
      ? {
          id: flavor.nutrition_info.id,
          servingSize: flavor.nutrition_info.serving_size
            ? Number(flavor.nutrition_info.serving_size)
            : undefined,
          calories: flavor.nutrition_info.calories
            ? Number(flavor.nutrition_info.calories)
            : undefined,
          protein: Number(flavor.nutrition_info.protein),
          carbs: flavor.nutrition_info.carbs ? Number(flavor.nutrition_info.carbs) : undefined,
          sugar: flavor.nutrition_info.sugar ? Number(flavor.nutrition_info.sugar) : undefined,
          fat: flavor.nutrition_info.fat ? Number(flavor.nutrition_info.fat) : undefined,
          saturatedFat: flavor.nutrition_info.saturated_fat
            ? Number(flavor.nutrition_info.saturated_fat)
            : undefined,
          unsaturatedFat: flavor.nutrition_info.unsaturated_fat
            ? Number(flavor.nutrition_info.unsaturated_fat)
            : undefined,
          transFat: flavor.nutrition_info.trans_fat
            ? Number(flavor.nutrition_info.trans_fat)
            : undefined,
          dietaryFiber: flavor.nutrition_info.dietary_fiber
            ? Number(flavor.nutrition_info.dietary_fiber)
            : undefined,
          sodium: flavor.nutrition_info.sodium ? Number(flavor.nutrition_info.sodium) : undefined,
          cholesterol: flavor.nutrition_info.cholesterol
            ? Number(flavor.nutrition_info.cholesterol)
            : undefined,
          calcium: flavor.nutrition_info.calcium
            ? Number(flavor.nutrition_info.calcium)
            : undefined,
          allergenInfo: flavor.nutrition_info.allergen_info || undefined,
        }
      : undefined,
    proteinTypes: (flavor.line_flavor_protein_types || []).map((pt) => ({
      id: pt.id,
      type: pt.protein_types?.type || "",
      name: pt.protein_types?.name || "",
    })),
  }));
}

export async function createLineFlavor(
  input: CreateLineFlavorInput,
  supabaseClient?: SupabaseClient<Database>,
): Promise<void> {
  const client = supabaseClient || defaultClient;

  const { data: flavorData, error: flavorError } = await client
    .from("line_flavors")
    .insert({
      line_id: input.lineId,
      flavor_category: input.flavorCategory as Database["public"]["Enums"]["flavor_category"] | null | undefined,
      flavor_name: input.flavorName,
    })
    .select()
    .single();

  if (flavorError) {
    console.error("Error creating line flavor:", flavorError);
    throw new Error("Failed to create line flavor");
  }

  const { error: nutritionError } = await client.from("nutrition_info").insert({
    line_flavor_id: flavorData.id,
    serving_size: input.nutrition.servingSize,
    calories: input.nutrition.calories,
    protein: input.nutrition.protein,
    carbs: input.nutrition.carbs,
    sugar: input.nutrition.sugar,
    fat: input.nutrition.fat,
    saturated_fat: input.nutrition.saturatedFat,
    unsaturated_fat: input.nutrition.unsaturatedFat,
    trans_fat: input.nutrition.transFat,
    dietary_fiber: input.nutrition.dietaryFiber,
    sodium: input.nutrition.sodium,
    cholesterol: input.nutrition.cholesterol,
    calcium: input.nutrition.calcium,
    allergen_info: input.nutrition.allergenInfo,
  });

  if (nutritionError) {
    console.error("Error creating nutrition info:", {
      message: nutritionError.message,
      details: nutritionError.details,
      hint: nutritionError.hint,
      code: nutritionError.code,
    });
    throw new Error(`Failed to create nutrition info: ${nutritionError.message}`);
  }

  if (input.proteinTypes.length > 0) {
    const { error: proteinTypesError } = await client.from("line_flavor_protein_types").insert(
      input.proteinTypes.map((pt) => ({
        line_flavor_id: flavorData.id,
        protein_type_id: pt.proteinTypeId,
      })),
    );

    if (proteinTypesError) {
      console.error("Error creating protein types:", proteinTypesError);
      throw new Error("Failed to create protein types");
    }
  }
}

export async function deleteLineFlavor(
  id: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<void> {
  const client = supabaseClient || defaultClient;

  // 1. product_flavors에서 이 line_flavor를 참조하는 항목들 찾기
  const { data: productFlavors } = await client
    .from("product_flavors")
    .select("id")
    .eq("line_flavor_id", id);

  // 2. 각 product_flavor에 연결된 product_skus 삭제
  if (productFlavors && productFlavors.length > 0) {
    for (const pf of productFlavors) {
      const { error: skuDeleteError } = await client
        .from("product_skus")
        .delete()
        .eq("product_flavor_id", pf.id);

      if (skuDeleteError) {
        console.error("Error deleting product skus:", skuDeleteError);
        throw new Error("Failed to delete product skus");
      }
    }

    // 3. product_flavors 삭제
    const { error: productFlavorsError } = await client
      .from("product_flavors")
      .delete()
      .eq("line_flavor_id", id);

    if (productFlavorsError) {
      console.error("Error deleting product flavors:", productFlavorsError);
      throw new Error("Failed to delete product flavors");
    }
  }

  // 4. nutrition_info 삭제
  const { error: nutritionError } = await client
    .from("nutrition_info")
    .delete()
    .eq("line_flavor_id", id);

  if (nutritionError) {
    console.error("Error deleting nutrition info:", nutritionError);
    throw new Error("Failed to delete nutrition info");
  }

  // 5. line_flavor_protein_types 삭제
  const { error: proteinTypesError } = await client
    .from("line_flavor_protein_types")
    .delete()
    .eq("line_flavor_id", id);

  if (proteinTypesError) {
    console.error("Error deleting protein types:", proteinTypesError);
    throw new Error("Failed to delete protein types");
  }

  // 6. 마지막으로 line_flavor 삭제
  const { error } = await client.from("line_flavors").delete().eq("id", id);

  if (error) {
    console.error("Error deleting line flavor:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to delete line flavor: ${error.message}`);
  }
}

export async function getProteinTypes(
  supabaseClient?: SupabaseClient<Database>,
): Promise<Array<{ id: string; type: string; name: string; description?: string }>> {
  const client = supabaseClient || defaultClient;

  const { data, error } = await client.from("protein_types").select("*");

  if (error) {
    console.error("Error fetching protein types:", error);
    throw new Error("Failed to fetch protein types");
  }

  const proteinTypes = (data || []).map((pt) => ({
    id: pt.id,
    type: pt.type,
    name: pt.name,
    description: pt.description || undefined,
  }));

  // 원하는 순서로 정렬
  const order = [
    "isp",
    "wpc",
    "wpi",
    "wph",
    "wpih",
    "casein",
    "goat_milk",
    "colostrum",
    "spc",
    "pea",
    "rice",
    "oat",
    "mpc",
    "mpi",
    "egg",
    "mixed",
  ];

  return proteinTypes.sort((a, b) => {
    const indexA = order.indexOf(a.type);
    const indexB = order.indexOf(b.type);
    return indexA - indexB;
  });
}
