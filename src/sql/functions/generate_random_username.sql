-- 랜덤 유저네임 생성 함수
-- 시퀀스 기반으로 중복 없는 유니크한 유저네임을 생성합니다
CREATE OR REPLACE FUNCTION public.generate_random_username()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    -- 동사 목록 (25개)
    verbs TEXT[] := ARRAY[
        '달리는', '노래하는', '춤추는', '날아가는', '말하는',
        '생각하는', '꿈꾸는', '웃는', '뒹구는', '쩝쩝거리는',
        '투덜거리는', '반짝이는', '휘파람부는', '코고는', '헤엄치는',
        '어슬렁거리는', '방황하는', '숨쉬는', '촐랑거리는', '꼬물거리는',
        '야식먹는', '멍때리는', '궁시렁거리는', '부스럭거리는', '꼼지락거리는'
    ];

    -- 형용사 목록 (25개)
    adjectives TEXT[] := ARRAY[
        '행복한', '슬픈', '조용한', '활기찬', '나른한',
        '피곤한', '배고픈', '졸린', '귀찮은', '심심한',
        '짭짤한', '매콤한', '달콤한', '씁쓸한', '푸른',
        '검은', '뾰족한', '오동통한', '끈적끈적한', '쭈글쭈글한',
        '눈치없는', '쫄깃한', '뜨거운', '후끈한', '엉뚱한'
    ];

    -- 명사 목록 (24개)
    nouns TEXT[] := ARRAY[
        '치킨', '라면', '피자', '커피', '맥주',
        '양말', '백수', '직장인', '대학생', '자취생',
        '댕댕이', '수달', '다람쥐', '햄스터', '펭귄',
        '코알라', '고래', '솜사탕', '빵', '러닝머신',
        '야구공', '축구공', '요가매트', '야구방망이'
    ];

    seq_num BIGINT;
    shuffled_num BIGINT;
    use_verb BOOLEAN;
    first_word_idx INT;
    noun_idx INT;
    generated_username TEXT;
    retry_count INT := 0;
    max_retries INT := 10;
BEGIN
    LOOP
        -- 시퀀스에서 고유 번호 가져오기 (public 스키마 명시)
        seq_num := nextval('public.username_sequence');

        -- Linear Congruential Generator로 순서 섞기 (예측 불가능하게)
        -- (a * X + c) mod m 형태, 여기서 a=1103515245, c=12345는 잘 알려진 LCG 파라미터
        shuffled_num := abs((seq_num * 1103515245 + 12345) % 100000);

        -- 동사 또는 형용사 선택 (번갈아가며)
        use_verb := (shuffled_num % 2 = 0);

        IF use_verb THEN
            -- 동사 + 명사 조합
            first_word_idx := (shuffled_num % array_length(verbs, 1)) + 1;
            noun_idx := ((shuffled_num / array_length(verbs, 1)) % array_length(nouns, 1)) + 1;
            generated_username := verbs[first_word_idx] || ' ' || nouns[noun_idx];
        ELSE
            -- 형용사 + 명사 조합
            first_word_idx := (shuffled_num % array_length(adjectives, 1)) + 1;
            noun_idx := ((shuffled_num / array_length(adjectives, 1)) % array_length(nouns, 1)) + 1;
            generated_username := adjectives[first_word_idx] || ' ' || nouns[noun_idx];
        END IF;

        -- 중복 체크 (안전장치)
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE username = generated_username
        ) THEN
            RETURN generated_username;
        END IF;

        -- 재시도 횟수 체크
        retry_count := retry_count + 1;
        IF retry_count >= max_retries THEN
            -- 최대 재시도 횟수 초과 시 시퀀스 번호를 포함한 유저네임 생성
            -- 이런 경우는 거의 발생하지 않지만 안전장치로 포함
            RETURN generated_username || '_' || seq_num::text;
        END IF;
    END LOOP;
END;
$$;

-- 함수 권한 설정
GRANT EXECUTE ON FUNCTION public.generate_random_username() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_random_username() TO authenticated;