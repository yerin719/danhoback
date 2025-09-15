-- ============================================
-- FAVORITES COUNT TRIGGER
-- ============================================
-- favorites 테이블에 추가/삭제 시 product_variants.favorites_count 자동 업데이트

-- favorites_count 증가 함수
CREATE OR REPLACE FUNCTION update_favorites_count_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.product_variants
    SET favorites_count = COALESCE(favorites_count, 0) + 1
    WHERE id = NEW.product_variant_id;
    RETURN NEW;
END;
$$;

-- favorites_count 감소 함수
CREATE OR REPLACE FUNCTION update_favorites_count_on_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.product_variants
    SET favorites_count = GREATEST(COALESCE(favorites_count, 0) - 1, 0)
    WHERE id = OLD.product_variant_id;
    RETURN OLD;
END;
$$;

-- INSERT 트리거
DROP TRIGGER IF EXISTS favorites_insert_trigger ON public.favorites;
CREATE TRIGGER favorites_insert_trigger
AFTER INSERT ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION update_favorites_count_on_insert();

-- DELETE 트리거
DROP TRIGGER IF EXISTS favorites_delete_trigger ON public.favorites;
CREATE TRIGGER favorites_delete_trigger
AFTER DELETE ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION update_favorites_count_on_delete();