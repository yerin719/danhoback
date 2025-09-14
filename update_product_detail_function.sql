-- Update get_product_detail function to use package fields from products table
CREATE OR REPLACE FUNCTION get_product_detail(
  variant_slug_param varchar
)
RETURNS TABLE (
  selected_variant jsonb,
  product_info jsonb,
  brand_info jsonb,
  related_variants jsonb,
  is_favorited boolean
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  target_variant_id uuid;
  target_product_id uuid;
BEGIN
  -- slug로 variant_id와 product_id 찾기
  SELECT id, product_id INTO target_variant_id, target_product_id
  FROM product_variants
  WHERE slug = variant_slug_param AND is_available = true
  LIMIT 1;

  -- variant를 찾지 못한 경우 빈 결과 반환
  IF target_variant_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH selected_variant_data AS (
    -- 선택된 variant의 상세 정보 (package fields removed from variant)
    SELECT
      pv.id,
      pv.product_id,
      jsonb_build_object(
        'id', pv.id,
        'name', pv.name,
        'slug', pv.slug,
        'flavor_category', pv.flavor_category::text,
        'flavor_name', pv.flavor_name,
        'barcode', pv.barcode,
        'primary_image', pv.primary_image,
        'images', pv.images,
        'purchase_url', pv.purchase_url,
        'favorites_count', pv.favorites_count,
        'is_available', pv.is_available,
        'nutrition', CASE
          WHEN vn.id IS NOT NULL THEN
            jsonb_build_object(
              'calories', vn.calories,
              'protein', vn.protein,
              'carbs', vn.carbs,
              'sugar', vn.sugar,
              'fat', vn.fat,
              'saturated_fat', vn.saturated_fat,
              'sodium', vn.sodium,
              'cholesterol', vn.cholesterol,
              'calcium', vn.calcium,
              'bcaa', vn.bcaa,
              'additional_nutrients', vn.additional_nutrients,
              'allergen_info', vn.allergen_info
            )
          ELSE NULL
        END
      ) as variant_data
    FROM product_variants pv
    LEFT JOIN variant_nutrition vn ON pv.id = vn.variant_id
    WHERE pv.id = target_variant_id
  )
  SELECT
    svd.variant_data as selected_variant,
    -- 제품 정보 (package fields now from products table)
    jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'protein_type', p.protein_type::text,
      'form', p.form::text,
      'package_type', p.package_type::text,  -- Now from products table
      'size', p.size,                         -- Now from products table
      'total_amount', p.total_amount,         -- Now from products table
      'servings_per_container', p.servings_per_container,  -- Now from products table
      'serving_size', p.serving_size,         -- Now from products table
      'is_active', p.is_active
    ) as product_info,
    -- 브랜드 정보
    jsonb_build_object(
      'id', b.id,
      'name', b.name,
      'name_en', b.name_en,
      'logo_url', b.logo_url,
      'website', b.website,
      'is_active', b.is_active
    ) as brand_info,
    -- 같은 라인의 다른 variants (선택된 것 제외, package fields removed)
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', other_pv.id,
            'name', other_pv.name,
            'slug', other_pv.slug,
            'flavor_category', other_pv.flavor_category::text,
            'flavor_name', other_pv.flavor_name,
            'primary_image', other_pv.primary_image,
            'images', other_pv.images
          ) ORDER BY other_pv.display_order, other_pv.name
        )
        FROM product_variants other_pv
        WHERE other_pv.product_id = target_product_id
          AND other_pv.id != target_variant_id
          AND other_pv.is_available = true
      ),
      '[]'::jsonb
    ) as related_variants,
    -- 찜 여부 확인
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS (
          SELECT 1 FROM favorites f
          WHERE f.product_variant_id = target_variant_id
          AND f.user_id = auth.uid()
        )
      ELSE false
    END as is_favorited
  FROM selected_variant_data svd
  INNER JOIN products p ON svd.product_id = p.id
  INNER JOIN brands b ON p.brand_id = b.id
  WHERE p.is_active = true AND b.is_active = true;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_product_detail TO anon, authenticated;

-- Add comment
COMMENT ON FUNCTION get_product_detail IS
'제품 상세 정보 조회 함수. package 관련 필드는 products 테이블에서 가져옴';