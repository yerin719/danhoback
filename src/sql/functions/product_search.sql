-- ============================================
-- PRODUCT SEARCH RPC FUNCTIONS
-- ============================================
-- 새로운 6계층 구조를 반영한 제품 검색 함수들

-- ============================================
-- 메인 제품 검색 함수
-- ============================================
DROP FUNCTION IF EXISTS search_products CASCADE;
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
  -- SKU 정보
  sku_id uuid,
  sku_name text,
  barcode text,
  size text,
  primary_image text,
  purchase_url text,
  favorites_count int,

  -- Product 정보 (ProductCard 호환)
  product_id uuid,
  product_name text,
  slug text,

  -- Product Line 정보
  line_id uuid,
  line_name text,
  line_description text,
  form text,

  -- Package 정보
  package_type text,

  -- Brand 정보
  brand_id uuid,
  brand_name text,
  brand_name_en text,
  brand_logo_url text,

  -- Flavor 정보
  flavor_category text,
  flavor_name text,

  -- Nutrition 정보
  calories numeric,
  protein numeric,
  carbs numeric,
  sugar numeric,

  -- Protein Types
  protein_types json,

  -- 사용자별 정보
  is_favorited boolean
)
LANGUAGE plpgsql
SET search_path = 'public'
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (pwd.sku_id)
    pwd.sku_id,
    pwd.sku_name::text,
    pwd.barcode::text,
    pwd.size::text,
    pwd.primary_image::text,
    pwd.purchase_url::text,
    pwd.favorites_count::int,

    pwd.product_id,
    pwd.line_name::text as product_name,
    pwd.slug::text,

    pwd.product_line_id,
    pwd.line_name::text,
    pwd.line_description::text,
    pwd.form::text,

    pwd.package_type::text,

    pwd.brand_id,
    pwd.brand_name::text,
    pwd.brand_name_en::text,
    pwd.brand_logo_url::text,

    pwd.flavor_category::text,
    pwd.flavor_name::text,

    pwd.calories::numeric,
    pwd.protein::numeric,
    pwd.carbs::numeric,
    pwd.sugar::numeric,

    pwd.protein_types::json,

    -- 찜 여부 확인 (로그인한 사용자만)
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS (
          SELECT 1 FROM public.favorites f
          WHERE f.product_sku_id = pwd.sku_id
          AND f.user_id = auth.uid()
        )
      ELSE false
    END as is_favorited
  FROM public.products_with_details pwd
  WHERE
    -- 활성 상태 체크
    pwd.brand_is_active = true
    AND pwd.is_available = true

    -- 텍스트 검색
    AND (search_query IS NULL OR (
      pwd.sku_name ILIKE '%' || search_query || '%' OR
      pwd.line_name ILIKE '%' || search_query || '%' OR
      pwd.brand_name ILIKE '%' || search_query || '%' OR
      pwd.flavor_name ILIKE '%' || search_query || '%'
    ))

    -- 필터: 맛
    AND (filter_flavors IS NULL OR pwd.flavor_category = ANY(filter_flavors))

    -- 필터: 단백질 종류 (JSON 배열에서 검색)
    AND (
      filter_protein_types IS NULL
      OR EXISTS (
        SELECT 1
        FROM json_array_elements(pwd.protein_types::json) AS pt
        WHERE pt->>'type' = ANY(filter_protein_types)
      )
    )

    -- 필터: 제품 형태
    AND (filter_forms IS NULL OR pwd.form = ANY(filter_forms))

    -- 필터: 포장 타입
    AND (filter_package_types IS NULL OR pwd.package_type = ANY(filter_package_types))

    -- 영양성분 범위 필터
    AND (pwd.protein IS NULL OR (pwd.protein >= min_protein AND pwd.protein <= max_protein))
    AND (pwd.calories IS NULL OR (pwd.calories >= min_calories AND pwd.calories <= max_calories))
    AND (pwd.carbs IS NULL OR (pwd.carbs >= min_carbs AND pwd.carbs <= max_carbs))
    AND (pwd.sugar IS NULL OR (pwd.sugar >= min_sugar AND pwd.sugar <= max_sugar))

  ORDER BY
    pwd.sku_id,
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
      WHEN sort_by = 'name' AND sort_order = 'desc' THEN pwd.sku_name
    END DESC,
    CASE
      WHEN sort_by = 'name' AND sort_order = 'asc' THEN pwd.sku_name
    END ASC,
    pwd.display_order,
    pwd.sku_name

  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- ============================================
-- 필터 옵션 조회 함수
-- ============================================
DROP FUNCTION IF EXISTS get_filter_options CASCADE;
CREATE OR REPLACE FUNCTION get_filter_options(
  filter_type text DEFAULT NULL
)
RETURNS TABLE (
  option_type text,
  option_value text,
  option_name text
)
LANGUAGE plpgsql
SET search_path = 'public'
STABLE
AS $$
BEGIN
  IF filter_type IS NULL OR filter_type = 'flavor' THEN
    RETURN QUERY
    SELECT
      'flavor'::text as option_type,
      unnest(enum_range(NULL::public.flavor_category))::text as option_value,
      NULL::text as option_name;
  END IF;

  IF filter_type IS NULL OR filter_type = 'protein_type' THEN
    RETURN QUERY
    SELECT DISTINCT
      'protein_type'::text as option_type,
      pt.type::text as option_value,
      pt.name::text as option_name
    FROM public.protein_types pt
    ORDER BY pt.type::text;
  END IF;

  IF filter_type IS NULL OR filter_type = 'form' THEN
    RETURN QUERY
    SELECT
      'form'::text as option_type,
      unnest(enum_range(NULL::public.product_form))::text as option_value,
      CASE unnest(enum_range(NULL::public.product_form))::text
        WHEN 'powder' THEN '파우더'
        WHEN 'rtd' THEN '드링크 (RTD)'
        ELSE NULL
      END as option_name;
  END IF;

  IF filter_type IS NULL OR filter_type = 'package_type' THEN
    RETURN QUERY
    SELECT
      'package_type'::text as option_type,
      unnest(enum_range(NULL::public.package_type))::text as option_value,
      CASE unnest(enum_range(NULL::public.package_type))::text
        WHEN 'bulk' THEN '대용량'
        WHEN 'pouch' THEN '파우치'
        WHEN 'stick' THEN '스틱'
        ELSE NULL
      END as option_name;
  END IF;

  IF filter_type IS NULL OR filter_type = 'brand' THEN
    RETURN QUERY
    SELECT
      'brand'::text as option_type,
      b.id::text as option_value,
      b.name::text as option_name
    FROM public.brands b
    WHERE b.is_active = true
    ORDER BY b.name;
  END IF;
END;
$$;

-- ============================================
-- 단일 제품 상세 조회 함수 (SKU ID 기준)
-- ============================================
DROP FUNCTION IF EXISTS get_product_detail CASCADE;
CREATE OR REPLACE FUNCTION get_product_detail(
  sku_id_param uuid
)
RETURNS TABLE (
  -- 선택된 SKU 상세 정보
  selected_sku json,
  -- 제품 라인 정보
  product_line_info json,
  -- 브랜드 정보
  brand_info json,
  -- 같은 제품의 다른 SKUs
  related_skus json,
  -- 찜 여부
  is_favorited boolean
)
LANGUAGE plpgsql
SET search_path = 'public'
STABLE
AS $$
DECLARE
  target_product_flavor_id uuid;
  target_product_id uuid;
  target_line_id uuid;
BEGIN
  -- SKU로 관련 IDs 찾기
  SELECT
    ps.product_flavor_id,
    pf.product_id,
    p.line_id
  INTO
    target_product_flavor_id,
    target_product_id,
    target_line_id
  FROM public.product_skus ps
  INNER JOIN public.product_flavors pf ON pf.id = ps.product_flavor_id
  INNER JOIN public.products p ON p.id = pf.product_id
  WHERE ps.id = sku_id_param AND ps.is_available = true
  LIMIT 1;

  -- SKU를 찾지 못한 경우 빈 결과 반환
  IF target_product_flavor_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH selected_sku_data AS (
    -- 선택된 SKU의 상세 정보
    SELECT
      ps.id,
      jsonb_build_object(
        'id', ps.id,
        'name', ps.name,
        'barcode', ps.barcode,
        'size', p.size,
        'servings_per_container', p.servings_per_container,
        'primary_image', ps.primary_image,
        'images', ps.images,
        'purchase_url', ps.purchase_url,
        'favorites_count', ps.favorites_count,
        'is_available', ps.is_available,
        'flavor', jsonb_build_object(
          'category', lf.flavor_category::text,
          'name', lf.flavor_name
        ),
        'package_type', p.package_type::text,
        'nutrition', CASE
          WHEN ni.id IS NOT NULL THEN
            jsonb_build_object(
              'serving_size', ni.serving_size,
              'calories', ni.calories,
              'protein', ni.protein,
              'carbs', ni.carbs,
              'sugar', ni.sugar,
              'fat', ni.fat,
              'saturated_fat', ni.saturated_fat,
              'unsaturated_fat', ni.unsaturated_fat,
              'trans_fat', ni.trans_fat,
              'dietary_fiber', ni.dietary_fiber,
              'sodium', ni.sodium,
              'cholesterol', ni.cholesterol,
              'calcium', ni.calcium,
              'additional_nutrients', ni.additional_nutrients,
              'allergen_info', ni.allergen_info
            )
          ELSE NULL
        END,
        'protein_types', COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', pt.id,
                'type', pt.type::text,
                'name', pt.name,
                'description', pt.description
              ) ORDER BY pt.type
            )
            FROM public.line_flavor_protein_types lfpt
            JOIN public.protein_types pt ON pt.id = lfpt.protein_type_id
            WHERE lfpt.line_flavor_id = lf.id
          ),
          '[]'::jsonb
        )
      ) as sku_data
    FROM public.product_skus ps
    INNER JOIN public.product_flavors pf ON pf.id = ps.product_flavor_id
    INNER JOIN public.line_flavors lf ON lf.id = pf.line_flavor_id
    INNER JOIN public.products p ON p.id = pf.product_id
    LEFT JOIN public.nutrition_info ni ON ni.line_flavor_id = lf.id
    WHERE ps.id = sku_id_param
  )
  SELECT
    ssd.sku_data::json as selected_sku,
    -- 제품 라인 정보
    jsonb_build_object(
      'id', pl.id,
      'name', pl.name,
      'description', pl.description,
      'form', pl.form::text
    )::json as product_line_info,
    -- 브랜드 정보
    jsonb_build_object(
      'id', b.id,
      'name', b.name,
      'name_en', b.name_en,
      'logo_url', b.logo_url,
      'website', b.website,
      'is_active', b.is_active
    )::json as brand_info,
    -- 같은 제품의 다른 SKUs
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', other_ps.id,
            'name', other_ps.name,
            'slug', other_ps.slug,
            'size', other_p.size,
            'primary_image', other_ps.primary_image,
            'images', other_ps.images,
            'flavor', jsonb_build_object(
              'category', other_lf.flavor_category::text,
              'name', other_lf.flavor_name
            ),
            'package_type', other_p.package_type::text
          ) ORDER BY other_ps.display_order, other_ps.name
        )
        FROM public.product_skus other_ps
        INNER JOIN public.product_flavors other_pf ON other_pf.id = other_ps.product_flavor_id
        INNER JOIN public.products other_p ON other_p.id = other_pf.product_id
        INNER JOIN public.line_flavors other_lf ON other_lf.id = other_pf.line_flavor_id
        WHERE other_pf.product_id = target_product_id
          AND other_ps.id != sku_id_param
          AND other_ps.is_available = true
      ),
      '[]'::jsonb
    )::json as related_skus,
    -- 찜 여부 확인
    CASE
      WHEN auth.uid() IS NOT NULL THEN
        EXISTS (
          SELECT 1 FROM public.favorites f
          WHERE f.product_sku_id = sku_id_param
          AND f.user_id = auth.uid()
        )
      ELSE false
    END as is_favorited
  FROM selected_sku_data ssd
  CROSS JOIN public.product_lines pl
  INNER JOIN public.brands b ON b.id = pl.brand_id
  WHERE pl.id = target_line_id
    AND b.is_active = true;
END;
$$;

-- ============================================
-- 단일 제품 상세 조회 함수 (SLUG 기준)
-- ============================================
DROP FUNCTION IF EXISTS get_product_detail_by_slug CASCADE;
CREATE OR REPLACE FUNCTION get_product_detail_by_slug(
  slug_param text
)
RETURNS TABLE (
  selected_sku json,
  product_line_info json,
  brand_info json,
  related_skus json,
  is_favorited boolean
)
LANGUAGE plpgsql
SET search_path = ''
STABLE
AS $$
DECLARE
  target_sku_id uuid;
  target_line_id uuid;
BEGIN
  -- slug로 SKU 찾기
  SELECT ps.id, pl.id
  INTO target_sku_id, target_line_id
  FROM public.product_skus ps
  INNER JOIN public.product_flavors pf ON pf.id = ps.product_flavor_id
  INNER JOIN public.line_flavors lf ON lf.id = pf.line_flavor_id
  INNER JOIN public.product_lines pl ON pl.id = lf.line_id
  WHERE ps.slug = slug_param
    AND ps.is_available = true
  LIMIT 1;

  -- SKU가 없으면 빈 결과 반환
  IF target_sku_id IS NULL THEN
    RETURN;
  END IF;

  -- get_product_detail 함수 호출
  RETURN QUERY
  SELECT * FROM public.get_product_detail(target_sku_id);
END;
$$;

-- ============================================
-- 권한 설정
-- ============================================
GRANT EXECUTE ON FUNCTION search_products TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_filter_options TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_product_detail TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_product_detail_by_slug TO anon, authenticated;

-- ============================================
-- COMMENT 추가 (문서화)
-- ============================================
COMMENT ON FUNCTION search_products IS
'새로운 6계층 구조 기반 제품 검색 - SKU 레벨에서 검색하여 필터링';

COMMENT ON FUNCTION get_filter_options IS
'필터 UI를 위한 옵션값과 한글명 반환 - enum과 테이블에서 직접 조회';

COMMENT ON FUNCTION get_product_detail IS
'SKU ID를 사용하여 단일 제품의 상세 정보를 JSON 형태로 반환';