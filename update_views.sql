-- Drop existing views
DROP VIEW IF EXISTS products_with_details CASCADE;
DROP VIEW IF EXISTS product_filter_options CASCADE;

-- Recreate products_with_details view with package fields from products table
CREATE VIEW products_with_details AS
SELECT
  -- Product 정보
  p.id as product_id,
  p.name as product_name,
  p.brand_id,
  p.protein_type::text as protein_type,
  p.form::text as form,
  p.package_type::text as package_type,  -- Now from products table
  p.size,                                 -- Now from products table
  p.total_amount,                         -- Now from products table
  p.servings_per_container,               -- Now from products table
  p.serving_size,                         -- Now from products table
  p.is_active,

  -- Brand 정보
  b.name as brand_name,
  b.name_en as brand_name_en,
  b.logo_url as brand_logo_url,
  b.website as brand_website,

  -- Variant 정보
  pv.id as variant_id,
  pv.slug as slug,
  pv.name as variant_name,
  pv.flavor_category::text as flavor_category,
  pv.flavor_name,
  pv.barcode,
  pv.primary_image,
  pv.images,
  pv.purchase_url,
  pv.favorites_count,
  pv.is_available,
  pv.display_order,

  -- Nutrition 정보
  vn.calories,
  vn.protein,
  vn.carbs,
  vn.sugar,
  vn.fat,
  vn.saturated_fat,
  vn.sodium,
  vn.cholesterol,
  vn.calcium,
  vn.additional_nutrients,
  vn.allergen_info,

  -- 타임스탬프
  p.created_at,
  p.updated_at
FROM products p
INNER JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN variant_nutrition vn ON pv.id = vn.variant_id
WHERE
  p.is_active = true
  AND b.is_active = true
  AND (pv.is_available = true OR pv.id IS NULL);

-- Recreate product_filter_options view
CREATE VIEW product_filter_options AS
SELECT DISTINCT
  unnest(ARRAY[
    -- Flavor categories
    jsonb_build_object('type', 'flavor', 'value', pv.flavor_category::text),
    -- Protein types
    jsonb_build_object('type', 'protein_type', 'value', p.protein_type::text),
    -- Forms
    jsonb_build_object('type', 'form', 'value', p.form::text),
    -- Package types (now from products table)
    jsonb_build_object('type', 'package_type', 'value', p.package_type::text)
  ]) as filter_option
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE
  p.is_active = true
  AND (pv.is_available = true OR pv.id IS NULL)
  AND pv.flavor_category IS NOT NULL
  AND p.package_type IS NOT NULL;

-- Add comments
COMMENT ON VIEW products_with_details IS
'제품, 브랜드, 변형, 영양정보를 조인한 종합 뷰. package 관련 필드는 products 테이블에서 가져옴';

COMMENT ON VIEW product_filter_options IS
'필터 UI를 위한 고유 옵션값들을 제공하는 뷰';