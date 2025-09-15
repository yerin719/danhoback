-- 기존 시퀀스 삭제 (있다면)
  DROP SEQUENCE IF EXISTS username_sequence CASCADE;

-- 시퀀스 초기화
 ALTER SEQUENCE public.username_sequence RESTART WITH 1;
 
-- 유저네임 생성을 위한 시퀀스
-- 각 유저에게 고유한 번호를 할당하여 중복 없는 유저네임 생성을 보장
CREATE SEQUENCE IF NOT EXISTS username_sequence
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;
