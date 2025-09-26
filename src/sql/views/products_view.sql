-- ============================================
-- PRODUCTS WITH DETAILS VIEW
-- ============================================
-- 새로운 6계층 구조를 반영한 제품 상세 정보 뷰
-- product_skus → product_flavors → line_flavors → product_lines → brands

DROP VIEW IF EXISTS products_with_details CASCADE;
CREATE VIEW products_with_details
WITH (security_invoker=on)
AS
SELECT
  -- SKU 정보
  ps.id AS sku_id,
  ps.barcode,
  ps.slug,
  ps.name AS sku_name,
  ps.primary_image,
  ps.images,
  ps.purchase_url,
  ps.favorites_count,
  ps.is_available,
  ps.display_order,

  -- Product Flavor 정보
  pf.id AS product_flavor_id,

  -- Product 정보 (패키지 타입, size, servings)
  p.id AS product_id,
  p.package_type::text AS package_type,
  p.size,
  p.servings_per_container,

  -- Line Flavor 정보
  lf.id AS line_flavor_id,
  lf.flavor_category::text AS flavor_category,
  lf.flavor_name,

  -- Product Line 정보
  pl.id AS product_line_id,
  pl.name AS line_name,
  pl.description AS line_description,
  pl.form::text AS form,

  -- Brand 정보
  b.id AS brand_id,
  b.name AS brand_name,
  b.name_en AS brand_name_en,
  b.logo_url AS brand_logo_url,
  b.website AS brand_website,
  b.is_active AS brand_is_active,

  -- Nutrition 정보
  ni.serving_size,
  ni.calories,
  ni.protein,
  ni.carbs,
  ni.sugar,
  ni.fat,
  ni.saturated_fat,
  ni.unsaturated_fat,
  ni.trans_fat,
  ni.dietary_fiber,
  ni.sodium,
  ni.cholesterol,
  ni.calcium,
  ni.additional_nutrients,
  ni.allergen_info,

  -- Protein Types (JSON 배열로 집계)
  COALESCE(
    json_agg(
      jsonb_build_object(
        'id', pt.id,
        'type', pt.type::text,
        'name', pt.name,
        'description', pt.description
      ) ORDER BY pt.type
    ) FILTER (WHERE pt.id IS NOT NULL),
    '[]'::json
  ) AS protein_types,

  -- Timestamps
  ps.created_at,
  ps.updated_at
FROM
  product_skus ps
  INNER JOIN product_flavors pf ON pf.id = ps.product_flavor_id
  INNER JOIN line_flavors lf ON lf.id = pf.line_flavor_id
  INNER JOIN products p ON p.id = pf.product_id
  INNER JOIN product_lines pl ON pl.id = lf.line_id AND pl.id = p.line_id
  INNER JOIN brands b ON b.id = pl.brand_id
  LEFT JOIN nutrition_info ni ON ni.line_flavor_id = lf.id
  LEFT JOIN line_flavor_protein_types lfpt ON lfpt.line_flavor_id = lf.id
  LEFT JOIN protein_types pt ON pt.id = lfpt.protein_type_id
WHERE
  b.is_active = true
  AND ps.is_available = true
GROUP BY
  ps.id, ps.barcode, ps.slug, ps.name,
  ps.primary_image, ps.images, ps.purchase_url, ps.favorites_count,
  ps.is_available, ps.display_order, ps.created_at, ps.updated_at,
  pf.id,
  p.id, p.package_type, p.size, p.servings_per_container,
  lf.id, lf.flavor_category, lf.flavor_name,
  pl.id, pl.name, pl.description, pl.form,
  b.id, b.name, b.name_en, b.logo_url, b.website, b.is_active,
  ni.serving_size, ni.calories, ni.protein, ni.carbs, ni.sugar,
  ni.fat, ni.saturated_fat, ni.unsaturated_fat, ni.trans_fat,
  ni.dietary_fiber, ni.sodium, ni.cholesterol, ni.calcium,
  ni.additional_nutrients, ni.allergen_info;

-- ============================================
-- PRODUCT FILTER OPTIONS VIEW
-- ============================================
-- 필터 옵션을 위한 뷰 - enum과 테이블에서 직접 조회

DROP VIEW IF EXISTS product_filter_options CASCADE;
CREATE VIEW product_filter_options
WITH (security_invoker=on)
AS
WITH
  -- Brands (테이블에서 직접)
  brand_options AS (
    SELECT
      'brand' AS option_type,
      id::text AS value,
      name AS label,
      name_en AS label_en,
      logo_url,
      NULL::integer AS product_count
    FROM brands
    WHERE is_active = true
  ),

  -- Flavor Categories (enum에서 직접)
  flavor_options AS (
    SELECT
      'flavor' AS option_type,
      enumlabel AS value,
      enumlabel AS label,
      NULL AS label_en,
      NULL AS logo_url,
      NULL::integer AS product_count
    FROM pg_enum
    WHERE enumtypid = 'flavor_category'::regtype
  ),

  -- Protein Types (테이블에서 직접)
  protein_options AS (
    SELECT
      'protein_type' AS option_type,
      type::text AS value,
      name AS label,
      NULL AS label_en,
      NULL AS logo_url,
      NULL::integer AS product_count
    FROM protein_types
  ),

  -- Package Types (enum에서 직접)
  package_options AS (
    SELECT
      'package_type' AS option_type,
      enumlabel AS value,
      CASE enumlabel
        WHEN 'bulk' THEN '대용량'
        WHEN 'pouch' THEN '파우치'
        WHEN 'stick' THEN '스틱'
        ELSE enumlabel
      END AS label,
      NULL AS label_en,
      NULL AS logo_url,
      NULL::integer AS product_count
    FROM pg_enum
    WHERE enumtypid = 'package_type'::regtype
  ),

  -- Product Forms (enum에서 직접)
  form_options AS (
    SELECT
      'form' AS option_type,
      enumlabel AS value,
      CASE enumlabel
        WHEN 'powder' THEN '파우더'
        WHEN 'rtd' THEN '드링크 (RTD)'
        ELSE enumlabel
      END AS label,
      NULL AS label_en,
      NULL AS logo_url,
      NULL::integer AS product_count
    FROM pg_enum
    WHERE enumtypid = 'product_form'::regtype
  )

-- 모든 옵션 통합
SELECT * FROM brand_options
UNION ALL
SELECT * FROM flavor_options
UNION ALL
SELECT * FROM protein_options
UNION ALL
SELECT * FROM package_options
UNION ALL
SELECT * FROM form_options;

-- ============================================
-- COMMENT 추가 (문서화)
-- ============================================

COMMENT ON VIEW products_with_details IS
'새로운 6계층 구조 제품 정보 뷰: SKU → Product Flavors → Line Flavors → Product Lines → Brands';

COMMENT ON VIEW product_filter_options IS
'필터 UI를 위한 옵션값들 - brands/protein_types 테이블과 enum 타입에서 직접 조회';

-- 권한 설정
GRANT SELECT ON products_with_details TO anon, authenticated;
GRANT SELECT ON product_filter_options TO anon, authenticated;