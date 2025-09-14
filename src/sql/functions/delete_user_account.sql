-- ============================================
-- RPC Function: delete_user_account
-- Description: 사용자 계정 삭제 (트랜잭션으로 안전하게 처리)
-- ============================================

CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- 현재 인증된 사용자 ID 가져오기
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 트랜잭션으로 처리 (모두 성공하거나 모두 실패)

  -- 1. Articles 테이블의 author_id를 NULL로 업데이트 (익명화)
  UPDATE articles
  SET
    author_id = NULL,
    author_name = '탈퇴한 사용자',
    updated_at = NOW()
  WHERE author_id = current_user_id;

  -- 2. Profiles 삭제 (favorites는 CASCADE로 자동 삭제됨)
  DELETE FROM profiles
  WHERE id = current_user_id;

  -- profiles 삭제 확인
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile deletion failed';
  END IF;

  -- 3. Auth 사용자 삭제
  -- 주의: auth.users 직접 삭제는 보안상 제한될 수 있음
  -- Supabase Admin API를 통해 처리하는 것이 권장됨
  DELETE FROM auth.users
  WHERE id = current_user_id;

EXCEPTION
  WHEN OTHERS THEN
    -- 에러 발생 시 롤백
    RAISE EXCEPTION 'Account deletion failed: %', SQLERRM;
END;
$$;

-- RPC 함수에 대한 실행 권한 부여
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;

-- 함수 설명 추가
COMMENT ON FUNCTION delete_user_account() IS '사용자 계정과 관련 데이터를 안전하게 삭제합니다. Articles는 익명화되고, Profiles와 Favorites는 삭제됩니다.';