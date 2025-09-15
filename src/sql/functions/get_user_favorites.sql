-- ============================================
-- GET USER FAVORITES FUNCTION
-- ============================================
-- 사용자의 찜 목록을 products_with_details 뷰를 활용하여 조회합니다
-- search_products와 동일한 반환 구조를 사용하여 일관성을 유지합니다

CREATE OR REPLACE FUNCTION get_user_favorites()
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
    true as is_favorited  -- 찜 목록이므로 항상 true
  FROM public.products_with_details pwd
  INNER JOIN public.favorites f ON f.product_variant_id = pwd.variant_id
  WHERE 
    f.user_id = auth.uid()
    AND pwd.is_active = true
    AND pwd.is_available = true
  ORDER BY f.created_at DESC;
END;
$$;

-- 권한 설정 (authenticated 사용자만 실행 가능)
GRANT EXECUTE ON FUNCTION get_user_favorites() TO authenticated;