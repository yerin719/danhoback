-- ============================================
-- ARTICLE RPC FUNCTIONS
-- ============================================
-- Articles 관련 복잡한 쿼리와 원자적 업데이트를 위한 함수들

-- ============================================
-- 조회수 증가 함수 (원자적 업데이트 보장)
-- ============================================
CREATE OR REPLACE FUNCTION increment_article_view_count(article_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE articles 
  SET 
    view_count = COALESCE(view_count, 0) + 1,
    updated_at = NOW()
  WHERE 
    id = article_id_param 
    AND status = 'published';
    
  -- 업데이트된 행이 있는지 확인
  IF FOUND THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- 에러 발생시 false 반환
    RETURN false;
END;
$$;

-- ============================================
-- 통합 검색 함수 (제목, 요약, 내용, 태그에서 검색)
-- ============================================
CREATE OR REPLACE FUNCTION search_articles(
  search_query_param text DEFAULT NULL,
  category_param text DEFAULT NULL,
  limit_param int DEFAULT 100,
  offset_param int DEFAULT 0,
  sort_by_param text DEFAULT 'published_at',
  sort_order_param text DEFAULT 'desc'
)
RETURNS TABLE (
  id uuid,
  slug text,
  title text,
  summary text,
  content text,
  category text,
  featured_image text,
  author_id uuid,
  author_name text,
  status text,
  published_at timestamp,
  read_time int,
  view_count int,
  is_featured boolean,
  meta_description text,
  meta_keywords text,
  created_at timestamp,
  updated_at timestamp,
  relevance_score float
)
LANGUAGE plpgsql
AS $$
DECLARE
  search_term text;
  query_sql text;
  order_clause text;
BEGIN
  -- 검색어 전처리
  IF search_query_param IS NOT NULL AND trim(search_query_param) != '' THEN
    search_term := '%' || trim(search_query_param) || '%';
  END IF;

  -- 정렬 조건 설정
  CASE sort_by_param
    WHEN 'published_at' THEN 
      order_clause := 'published_at ' || CASE WHEN sort_order_param = 'asc' THEN 'ASC' ELSE 'DESC' END;
    WHEN 'view_count' THEN 
      order_clause := 'view_count ' || CASE WHEN sort_order_param = 'asc' THEN 'ASC' ELSE 'DESC' END;
    WHEN 'title' THEN 
      order_clause := 'title ' || CASE WHEN sort_order_param = 'asc' THEN 'ASC' ELSE 'DESC' END;
    ELSE 
      order_clause := 'created_at ' || CASE WHEN sort_order_param = 'asc' THEN 'ASC' ELSE 'DESC' END;
  END CASE;

  -- 기본 쿼리 구성
  query_sql := '
    SELECT 
      a.id,
      a.slug,
      a.title,
      a.summary,
      a.content,
      a.category::text,
      a.featured_image,
      a.author_id,
      a.author_name,
      a.status::text,
      a.published_at,
      a.read_time,
      a.view_count,
      a.is_featured,
      a.meta_description,
      a.meta_keywords,
      a.created_at,
      a.updated_at,
      CASE 
        WHEN $1 IS NULL THEN 1.0
        ELSE (
          -- 제목 매칭 점수 (가중치 3)
          CASE WHEN a.title ILIKE $1 THEN 3.0 ELSE 0.0 END +
          -- 요약 매칭 점수 (가중치 2)  
          CASE WHEN a.summary ILIKE $1 THEN 2.0 ELSE 0.0 END +
          -- 내용 매칭 점수 (가중치 1)
          CASE WHEN a.content ILIKE $1 THEN 1.0 ELSE 0.0 END +
          -- 태그 매칭 점수 (가중치 2.5)
          CASE WHEN EXISTS (
            SELECT 1 FROM article_tag_relations atr
            JOIN article_tags at ON atr.tag_id = at.id
            WHERE atr.article_id = a.id AND at.name ILIKE $1
          ) THEN 2.5 ELSE 0.0 END
        )
      END as relevance_score
    FROM articles a
    WHERE a.status = ''published''';

  -- 검색 조건 추가
  IF search_term IS NOT NULL THEN
    query_sql := query_sql || '
      AND (
        a.title ILIKE $1 OR 
        a.summary ILIKE $1 OR 
        a.content ILIKE $1 OR
        EXISTS (
          SELECT 1 FROM article_tag_relations atr
          JOIN article_tags at ON atr.tag_id = at.id
          WHERE atr.article_id = a.id AND at.name ILIKE $1
        )
      )';
  END IF;

  -- 카테고리 필터 추가
  IF category_param IS NOT NULL THEN
    query_sql := query_sql || ' AND a.category = $2';
  END IF;

  -- 검색어가 있으면 관련성 순으로, 없으면 지정된 정렬로
  IF search_term IS NOT NULL THEN
    query_sql := query_sql || ' ORDER BY relevance_score DESC, ' || order_clause;
  ELSE
    query_sql := query_sql || ' ORDER BY ' || order_clause;
  END IF;

  -- 페이지네이션 추가
  query_sql := query_sql || ' LIMIT $' || 
    CASE WHEN category_param IS NULL THEN '2' ELSE '3' END || 
    ' OFFSET $' || 
    CASE WHEN category_param IS NULL THEN '3' ELSE '4' END;

  -- 쿼리 실행
  IF category_param IS NULL THEN
    RETURN QUERY EXECUTE query_sql USING search_term, limit_param, offset_param;
  ELSE
    RETURN QUERY EXECUTE query_sql USING search_term, category_param, limit_param, offset_param;
  END IF;
END;
$$;

-- ============================================
-- 관련 글 추천 함수 (태그 기반 + 카테고리 가중치)
-- ============================================
CREATE OR REPLACE FUNCTION get_related_articles_advanced(
  article_id_param uuid,
  limit_param int DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  title text,
  summary text,
  category text,
  featured_image text,
  author_name text,
  published_at timestamp,
  view_count int,
  similarity_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.summary,
    a.category::text,
    a.featured_image,
    a.author_name,
    a.published_at,
    a.view_count,
    (
      -- 같은 카테고리 점수 (가중치 1.0)
      CASE WHEN a.category = (SELECT category FROM articles WHERE id = article_id_param) 
           THEN 1.0 ELSE 0.0 END +
      -- 공통 태그 수 (가중치 0.5 per tag)
      (SELECT COUNT(*) * 0.5 FROM article_tag_relations atr1
       WHERE atr1.article_id = a.id
       AND atr1.tag_id IN (
         SELECT tag_id FROM article_tag_relations atr2 
         WHERE atr2.article_id = article_id_param
       )) +
      -- 최신성 점수 (최근 30일 내 글에 보너스)
      CASE WHEN a.published_at > NOW() - INTERVAL '30 days' 
           THEN 0.3 ELSE 0.0 END
    ) as similarity_score
  FROM articles a
  WHERE 
    a.id != article_id_param 
    AND a.status = 'published'
  ORDER BY 
    similarity_score DESC, 
    a.published_at DESC
  LIMIT limit_param;
END;
$$;

-- ============================================
-- 카테고리별 통계 함수
-- ============================================
CREATE OR REPLACE FUNCTION get_article_category_stats()
RETURNS TABLE (
  category text,
  total_articles bigint,
  total_views bigint,
  avg_read_time float,
  latest_published timestamp
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.category::text,
    COUNT(*) as total_articles,
    SUM(a.view_count) as total_views,
    AVG(a.read_time) as avg_read_time,
    MAX(a.published_at) as latest_published
  FROM articles a
  WHERE a.status = 'published'
  GROUP BY a.category
  ORDER BY total_articles DESC;
END;
$$;

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

-- 기본 검색용 인덱스 (단순 텍스트 인덱스)
CREATE INDEX IF NOT EXISTS idx_articles_title 
ON articles (title);

CREATE INDEX IF NOT EXISTS idx_articles_summary 
ON articles (summary);

-- 태그 이름 인덱스
CREATE INDEX IF NOT EXISTS idx_article_tags_name 
ON article_tags (name);

-- 관련 글 검색용 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_articles_category_status_published 
ON articles (category, status, published_at DESC) 
WHERE status = 'published';

-- 조회수 업데이트용 인덱스
CREATE INDEX IF NOT EXISTS idx_articles_id_status 
ON articles (id, status) 
WHERE status = 'published';

-- ============================================
-- COMMENT 추가 (문서화)
-- ============================================

COMMENT ON FUNCTION increment_article_view_count IS 
'Article 조회수를 안전하게 증가시키는 함수. 동시성 문제 방지';

COMMENT ON FUNCTION search_articles IS 
'Article 통합 검색 함수. 제목, 내용, 태그에서 검색하고 관련성 점수 계산';

COMMENT ON FUNCTION get_related_articles_advanced IS 
'향상된 관련 글 추천 함수. 태그와 카테고리 기반 유사도 계산';

COMMENT ON FUNCTION get_article_category_stats IS 
'카테고리별 Article 통계 정보 제공 함수';