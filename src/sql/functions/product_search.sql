-- ============================================
-- PRODUCT SEARCH RPC FUNCTIONS
-- ============================================
-- 서버사이드에서 복잡한 필터링 로직을 처리합니다

-- ============================================
-- 메인 제품 검색 함수
-- ============================================
CREATE OR REPLACE FUNCTION search_products(
  filter_flavors text[] DEFAULT NULL,
  filter_protein_types text[] DEFAULT NULL,
  filter_forms text[] DEFAULT NULL,
  filter_package_types text[] DEFAULT NULL,
  min_protein numeric DEFAULT 0,
  max_protein numeric DEFAULT 100,
  min_calories numeric DEFAULT 0,
  max_calories numeric DEFAULT 1000,
  min_carbs numeric DEFAULT 0,
  max_carbs numeric DEFAULT 100,
  min_sugar numeric DEFAULT 0,
  max_sugar numeric DEFAULT 100,
  search_query text DEFAULT NULL,
  sort_by text DEFAULT 'favorites_count',
  sort_order text DEFAULT 'desc',
  limit_count int DEFAULT 100,
  offset_count int DEFAULT 0
)
RETURNS TABLE (
  product_id uuid,
  product_name text,
  protein_type text,
  form text,
  brand_id uuid,
  brand_name text,
  brand_name_en text,
  brand_logo_url text,
  variant_id uuid,
  variant_name text,
  slug text,
  flavor_category text,
  flavor_name text,
  package_type text,
  primary_image text,
  purchase_url text,
  favorites_count int,
  calories numeric,
  protein numeric,
  carbs numeric,
  sugar numeric,
  is_favorited boolean
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pwd.product_id,
    pwd.product_name::text,
    pwd.protein_type::text,
    pwd.form::text,
    pwd.brand_id,
    pwd.brand_name::text,
    pwd.brand_name_en::text,
    pwd.brand_logo_url::text,
    pwd.variant_id,
    pwd.variant_name::text,
    pwd.slug::text,
    pwd.flavor_category::text,
    pwd.flavor_name::text,
    pwd.package_type::text,
    pwd.primary_image::text,
    pwd.purchase_url::text,
    pwd.favorites_count::int,
    pwd.calories::numeric,
    pwd.protein::numeric,
    pwd.carbs::numeric,
    pwd.sugar::numeric,
    -- 찜 여부 확인 (로그인한 사용자만)
    CASE 
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS (
          SELECT 1 FROM favorites f 
          WHERE f.product_variant_id = pwd.variant_id 
          AND f.user_id = auth.uid()
        )
      ELSE false
    END as is_favorited
  FROM products_with_details pwd
  WHERE
    -- 활성 상태 체크
    pwd.is_active = true
    AND pwd.is_available = true
    
    -- 텍스트 검색
    AND (search_query IS NULL OR (
      pwd.product_name ILIKE '%' || search_query || '%' OR
      pwd.brand_name ILIKE '%' || search_query || '%' OR
      pwd.variant_name ILIKE '%' || search_query || '%'
    ))
    
    -- 필터: 맛
    AND (filter_flavors IS NULL OR pwd.flavor_category = ANY(filter_flavors))
    
    -- 필터: 단백질 종류
    AND (filter_protein_types IS NULL OR pwd.protein_type = ANY(filter_protein_types))
    
    -- 필터: 제품 형태
    AND (filter_forms IS NULL OR pwd.form = ANY(filter_forms))
    
    -- 필터: 포장 타입 (파우더 제품에만 적용)
    AND (
      filter_package_types IS NULL 
      OR pwd.form != 'powder'
      OR pwd.package_type = ANY(filter_package_types)
    )
    
    -- 영양성분 범위 필터
    AND pwd.protein >= min_protein AND pwd.protein <= max_protein
    AND (pwd.calories IS NULL OR (pwd.calories >= min_calories AND pwd.calories <= max_calories))
    AND (pwd.carbs IS NULL OR (pwd.carbs >= min_carbs AND pwd.carbs <= max_carbs))
    AND (pwd.sugar IS NULL OR (pwd.sugar >= min_sugar AND pwd.sugar <= max_sugar))
  
  ORDER BY
    CASE 
      WHEN sort_by = 'favorites_count' AND sort_order = 'desc' THEN pwd.favorites_count
    END DESC NULLS LAST,
    CASE 
      WHEN sort_by = 'favorites_count' AND sort_order = 'asc' THEN pwd.favorites_count
    END ASC NULLS LAST,
    CASE 
      WHEN sort_by = 'protein' AND sort_order = 'desc' THEN pwd.protein
    END DESC NULLS LAST,
    CASE 
      WHEN sort_by = 'protein' AND sort_order = 'asc' THEN pwd.protein
    END ASC NULLS LAST,
    CASE 
      WHEN sort_by = 'calories' AND sort_order = 'desc' THEN pwd.calories
    END DESC NULLS LAST,
    CASE 
      WHEN sort_by = 'calories' AND sort_order = 'asc' THEN pwd.calories
    END ASC NULLS LAST,
    CASE 
      WHEN sort_by = 'name' AND sort_order = 'desc' THEN pwd.product_name
    END DESC,
    CASE 
      WHEN sort_by = 'name' AND sort_order = 'asc' THEN pwd.product_name
    END ASC,
    pwd.display_order,
    pwd.product_name
  
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- ============================================
-- 필터 옵션 조회 함수
-- ============================================
-- DROP FUNCTION IF EXISTS get_filter_options(text);  -- 주의: 이 줄은 함수를 삭제합니다. 필요시에만 사용하세요.

CREATE OR REPLACE FUNCTION get_filter_options(
  filter_type text DEFAULT NULL
)
RETURNS TABLE (
  option_type text,
  option_value text
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  IF filter_type IS NULL OR filter_type = 'flavor' THEN
    RETURN QUERY
    SELECT 
      'flavor'::text as option_type,
      unnest(enum_range(NULL::flavor_category))::text as option_value;
  END IF;
  
  IF filter_type IS NULL OR filter_type = 'protein_type' THEN
    RETURN QUERY
    SELECT 
      'protein_type'::text as option_type,
      unnest(enum_range(NULL::protein_type))::text as option_value;
  END IF;
  
  IF filter_type IS NULL OR filter_type = 'form' THEN
    RETURN QUERY
    SELECT 
      'form'::text as option_type,
      unnest(enum_range(NULL::product_form))::text as option_value;
  END IF;
  
  IF filter_type IS NULL OR filter_type = 'package_type' THEN
    RETURN QUERY
    SELECT 
      'package_type'::text as option_type,
      unnest(enum_range(NULL::package_type))::text as option_value;
  END IF;
  
  IF filter_type IS NULL OR filter_type = 'brand' THEN
    RETURN QUERY
    SELECT 
      'brand'::text as option_type,
      b.name::text as option_value
    FROM brands b
    INNER JOIN products p ON p.brand_id = b.id
    WHERE b.is_active = true AND p.is_active = true
    GROUP BY b.name;
  END IF;
END;
$$;

-- ============================================
-- 단일 제품 상세 조회 함수 (slug 기준)
-- ============================================
CREATE OR REPLACE FUNCTION get_product_detail(
  variant_slug_param varchar
)
RETURNS TABLE (
  -- 선택된 variant 상세 정보
  selected_variant jsonb,
  -- 제품 기본 정보
  product_info jsonb,
  -- 브랜드 정보
  brand_info jsonb,
  -- 같은 라인의 다른 variants (간소한 정보)
  related_variants jsonb,
  -- 찜 여부
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

-- ============================================
-- 권한 설정
-- ============================================
GRANT EXECUTE ON FUNCTION search_products TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_filter_options TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_product_detail TO anon, authenticated;

-- ============================================
-- COMMENT 추가 (문서화)
-- ============================================
COMMENT ON FUNCTION search_products IS 
'제품 검색 및 필터링을 서버사이드에서 처리하는 RPC 함수. 타입 안전성과 성능 최적화';

COMMENT ON FUNCTION get_filter_options IS 
'필터 UI를 위한 옵션값과 개수를 반환하는 함수';

COMMENT ON FUNCTION get_product_detail IS 
'slug를 사용하여 단일 제품의 상세 정보를 JSON 형태로 반환하는 함수';