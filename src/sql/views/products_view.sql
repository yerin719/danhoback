-- ============================================
-- PRODUCTS WITH DETAILS VIEW
-- ============================================
-- 이 View는 제품 정보와 관련 데이터를 조인하여
-- 클라이언트에서 쉽게 조회할 수 있도록 합니다.
-- enum 타입을 text로 캐스팅하여 타입 안전성을 확보합니다.

CREATE OR REPLACE VIEW products_with_details
with (security_invoker=on)
AS
SELECT
  -- Product 정보
  p.id as product_id,
  p.name as product_name,
  p.description as product_description,   -- SEO description 필드 추가
  p.brand_id,
  p.protein_type::text as protein_type,
  p.form::text as form,
  p.package_type::text as package_type,  -- Now from products table
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
  vn.dietary_fiber,
  vn.fat,
  vn.saturated_fat,
  vn.unsaturated_fat,
  vn.trans_fat,
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

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_products_with_details_protein_type 
ON products (protein_type);

CREATE INDEX IF NOT EXISTS idx_products_with_details_form 
ON products (form);

CREATE INDEX IF NOT EXISTS idx_product_variants_flavor_category 
ON product_variants (flavor_category);

CREATE INDEX IF NOT EXISTS idx_products_package_type
ON products (package_type);

CREATE INDEX IF NOT EXISTS idx_variant_nutrition_protein 
ON variant_nutrition (protein);

CREATE INDEX IF NOT EXISTS idx_variant_nutrition_calories 
ON variant_nutrition (calories);

-- ============================================
-- DISTINCT FILTER OPTIONS VIEW
-- ============================================
-- 필터 옵션을 위한 고유값들을 미리 계산합니다

CREATE OR REPLACE VIEW product_filter_options
with (security_invoker=on)
AS
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

-- ============================================
-- COMMENT 추가 (문서화)
-- ============================================

COMMENT ON VIEW products_with_details IS 
'제품, 브랜드, 변형, 영양정보를 조인한 종합 뷰. enum 타입을 text로 캐스팅하여 타입 안전성 확보';

COMMENT ON VIEW product_filter_options IS 
'필터 UI를 위한 고유 옵션값들을 제공하는 뷰';