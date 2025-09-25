-- ============================================
-- GET USER FAVORITES FUNCTION
-- ============================================
-- 새로운 6계층 구조를 반영한 사용자 찜 목록 조회 함수
-- products_with_details 뷰를 활용하여 조회합니다

DROP FUNCTION IF EXISTS get_user_favorites CASCADE;
CREATE OR REPLACE FUNCTION get_user_favorites()
RETURNS TABLE (
  -- SKU 정보
  sku_id uuid,
  sku_name text,
  barcode text,
  size text,
  primary_image text,
  purchase_url text,
  favorites_count int,

  -- Product 정보 (ProductCard 인터페이스 호환)
  product_id uuid,
  product_name text,  -- line_name을 product_name으로 사용
  slug text,  -- sku_id를 slug로 사용

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

  -- Nutrition 정보 (기본)
  calories numeric,
  protein numeric,
  carbs numeric,
  sugar numeric,

  -- Protein Types
  protein_types json,

  -- 항상 true (찜 목록이므로)
  is_favorited boolean
)
LANGUAGE plpgsql
SET search_path = ''
STABLE
AS $$
BEGIN
  -- 로그인하지 않은 경우 빈 결과 반환
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    pwd.sku_id,
    pwd.sku_name::text,
    pwd.barcode::text,
    pwd.size::text,
    pwd.primary_image::text,
    pwd.purchase_url::text,
    pwd.favorites_count::int,

    pwd.product_id,
    pwd.line_name::text as product_name,  -- line_name을 product_name으로 사용
    pwd.slug::text,  -- slug 컬럼 사용

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

    true as is_favorited  -- 찜 목록이므로 항상 true
  FROM public.products_with_details pwd
  INNER JOIN public.favorites f ON f.product_sku_id = pwd.sku_id
  WHERE
    f.user_id = auth.uid()
    AND pwd.brand_is_active = true
    AND pwd.is_available = true
  ORDER BY f.created_at DESC;
END;
$$;

-- 권한 설정 (authenticated 사용자만 실행 가능)
GRANT EXECUTE ON FUNCTION get_user_favorites() TO authenticated;

-- COMMENT 추가 (문서화)
COMMENT ON FUNCTION get_user_favorites IS
'새로운 6계층 구조 기반 사용자 찜 목록 조회 - SKU 레벨에서 조회';