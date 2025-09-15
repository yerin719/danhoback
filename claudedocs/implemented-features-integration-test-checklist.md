# 실제 구현된 기능 기반 통합테스트 체크리스트

## 프로젝트 현황
**프로젝트**: Danhobak (단호박)
**현재 구현 상태**: MVP 단계
**주요 구현 기능**: 제품 검색/필터링, 커뮤니티, 아티클, 사용자 인증, 즐겨찾기

---

## 1. 사용자 인증 시스템 테스트 ✅ 구현됨

### 인증 컨텍스트 (`AuthContext.tsx`)
- [ ] 이메일 로그인 (`signInWithEmail`)
- [ ] 이메일 회원가입 (`signUpWithEmail`)
- [ ] Google OAuth 로그인 (`signInWithGoogle`)
- [ ] Kakao OAuth 로그인 (`signInWithKakao`)
- [ ] 로그아웃 기능 (`signOut`)
- [ ] 세션 상태 유지 확인
- [ ] 인증 상태 변경 시 자동 리다이렉션

### 프로필 관리
- [ ] 프로필 정보 로드 (`getProfile`)
- [ ] 프로필 새로고침 (`refreshProfile`)
- [ ] 표시 이름 계산 (`getDisplayName`)
- [ ] 아바타 이니셜 생성 (`getAvatarInitial`)
- [ ] 프로필 수정 모달 (`ProfileEditModal.tsx`)

### 계정 관리
- [ ] 계정 삭제 기능 (`deleteAccount`)
- [ ] 계정 삭제 시 관련 데이터 정리
- [ ] 삭제 후 홈페이지 리다이렉션

### 보안 테스트
- [ ] 인증되지 않은 사용자 접근 제한
- [ ] 토큰 만료 처리
- [ ] 잘못된 자격증명 에러 처리

---

## 2. 제품 관리 시스템 테스트 ✅ 구현됨

### 제품 목록 페이지 (`/products`)
- [ ] 서버 사이드 렌더링 초기 데이터 로드
- [ ] 무한 스크롤 구현 확인
- [ ] URL 파라미터 검증 및 정리
- [ ] 잘못된 파라미터 시 리다이렉션

### 제품 검색 및 필터링
- [ ] 제품 검색 기능 (`searchProducts`)
- [ ] 다중 필터 적용 (브랜드, 카테고리, 가격 등)
- [ ] 정렬 기능 (가격순, 인기순 등)
- [ ] 필터 옵션 로드 (`getAllFilterOptions`)
- [ ] URL 동기화 (`parseSearchParams`)

### 제품 상세 페이지 (`/products/[slug]`)
- [ ] 제품 상세 정보 표시
- [ ] 제품 이미지 표시 (`ProductImage.tsx`)
- [ ] 영양성분 정보 표시
- [ ] 관련 제품 추천

### React Query 캐싱
- [ ] 5분 staleTime 동작 확인
- [ ] 10분 gcTime(cacheTime) 동작 확인
- [ ] prefetchInfiniteQuery 동작
- [ ] 캐시 무효화 처리

---

## 3. 커뮤니티 기능 테스트 ✅ 구현됨

### 커뮤니티 메인 페이지 (`/community`)
- [ ] 홈 화면 최신글/인기글 섹션 표시
- [ ] 게시글 목록 표시 (`CommunityPostItem.tsx`)
- [ ] 리스트 뷰 표시 (`CommunityPostListItem.tsx`)

### 게시글 검색 및 필터링
- [ ] 제목/내용/해시태그 검색 (`searchPosts`)
- [ ] 카테고리 필터링 (`CommunityFilters.tsx`)
- [ ] 검색 결과 없음 처리
- [ ] 필터 초기화 기능

### 게시글 작성 (`/community/write`)
- [ ] Tiptap 에디터 초기화
- [ ] 리치 텍스트 편집 기능
- [ ] 이미지 업로드 (`image-upload-node`)
- [ ] 게시글 저장

### 게시글 상세 페이지 (`/community/[id]`)
- [ ] 게시글 내용 표시
- [ ] 댓글 섹션 (`CommentSection.tsx`)
- [ ] 댓글 작성/수정/삭제 (`CommentItem.tsx`)
- [ ] 좋아요/반응 기능

### 모바일 대응
- [ ] 모바일 필터 시트 동작
- [ ] 반응형 레이아웃 전환
- [ ] 터치 인터랙션

---

## 4. 즐겨찾기 시스템 테스트 ✅ 구현됨

### 즐겨찾기 기능 (`favorites.ts`)
- [ ] 제품 즐겨찾기 추가
- [ ] 즐겨찾기 제거
- [ ] 사용자별 즐겨찾기 목록 조회

### 즐겨찾기 페이지 (`/favorites`)
- [ ] 즐겨찾기 목록 표시
- [ ] 빈 즐겨찾기 상태 (`EmptyFavorites.tsx`)
- [ ] 즐겨찾기 개수 표시

### 즐겨찾기 트리거
- [ ] `favorites-count-trigger.sql` 동작 확인
- [ ] 즐겨찾기 추가 시 카운트 증가
- [ ] 즐겨찾기 제거 시 카운트 감소

---

## 5. 아티클 시스템 테스트 ✅ 구현됨

### 아티클 목록 (`/articles`)
- [ ] 아티클 목록 표시
- [ ] 카테고리별 필터링
- [ ] 추천 아티클 표시

### 아티클 상세 (`/articles/[slug]`)
- [ ] 아티클 내용 표시 (`ArticleContent.tsx`)
- [ ] 배너 이미지 표시 (`ArticleBanner.tsx`)
- [ ] 아티클 이미지 표시 (`ArticleImage.tsx`)
- [ ] 카테고리 배지 (`CategoryBadge.tsx`)
- [ ] 읽기 시간 표시
- [ ] 조회수 증가

### 아티클 작성 (`/articles/new`)
- [ ] 관리자 권한 확인
- [ ] 아티클 에디터
- [ ] 메타데이터 입력
- [ ] 미리보기 기능

---

## 6. 네비게이션 시스템 테스트 ✅ 구현됨

### 데스크톱 네비게이션 (`Navigation.tsx`)
- [ ] 메인 메뉴 표시
- [ ] 로그인 상태별 메뉴 변경
- [ ] 프로필 드롭다운 메뉴

### 모바일 하단 네비게이션 (`MobileBottomNav.tsx`)
- [ ] 하단 탭 네비게이션
- [ ] 활성 탭 표시
- [ ] 페이지 전환

---

## 7. UI 컴포넌트 테스트 ✅ 구현됨

### Tiptap 에디터 컴포넌트
- [ ] 텍스트 포맷팅 (bold, italic, underline)
- [ ] 헤딩 레벨 변경
- [ ] 리스트 (bullet, numbered, todo)
- [ ] 이미지 업로드 및 표시
- [ ] 링크 추가/편집
- [ ] 코드 블록
- [ ] 텍스트 정렬
- [ ] 실행 취소/재실행

### shadcn/ui 컴포넌트
- [ ] Sheet (모바일 필터)
- [ ] Dialog (모달)
- [ ] Button 상태 변화
- [ ] Input 유효성 검사
- [ ] Toast 알림 (`sonner`)

---

## 8. 데이터베이스 함수 테스트 ✅ 구현됨

### SQL 함수 (`src/sql/functions/`)
- [ ] `article_functions.sql` - 아티클 관련 함수
- [ ] `delete_user_account.sql` - 계정 삭제 함수
- [ ] `get_user_favorites.sql` - 즐겨찾기 조회
- [ ] `product_search.sql` - 제품 검색 함수

### 뷰 (`src/sql/views/`)
- [ ] `products_view.sql` - 제품 정보 통합 뷰

---

## 9. 라우팅 및 리다이렉션 테스트

### 페이지 라우팅
- [ ] 홈페이지 → 제품 페이지 자동 리다이렉션
- [ ] 인증 필요 페이지 접근 시 로그인 리다이렉션
- [ ] 404 페이지 처리

### URL 상태 관리
- [ ] 검색 파라미터 유지
- [ ] 필터 상태 URL 동기화
- [ ] 뒤로가기/앞으로가기 동작

---

## 10. 성능 및 최적화 테스트

### Next.js 15 최적화
- [ ] Turbopack 빌드 성능
- [ ] App Router SSR/SSG 동작
- [ ] 이미지 최적화
- [ ] 폰트 최적화 (Geist)

### React Query 최적화
- [ ] prefetch 동작 확인
- [ ] 무한 스크롤 성능
- [ ] 캐시 히트율
- [ ] 네트워크 요청 최소화

---

## 11. 에러 처리 테스트

### 사용자 피드백
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] Toast 알림 동작
- [ ] 폼 유효성 검사 메시지

### 복구 메커니즘
- [ ] 네트워크 재시도
- [ ] 세션 만료 처리
- [ ] 데이터 일관성 유지

---

## 12. 보안 테스트

### 인증/인가
- [ ] 보호된 라우트 접근 제한
- [ ] OAuth 리다이렉션 보안
- [ ] 세션 하이재킹 방지

### 데이터 보호
- [ ] XSS 방어 (React 기본)
- [ ] SQL 인젝션 방어 (Supabase RLS)
- [ ] 파일 업로드 검증

---

## 테스트 우선순위

### 🔴 Critical (즉시 테스트 필요)
1. 사용자 인증 플로우
2. 제품 검색 및 필터링
3. 커뮤니티 게시글 CRUD
4. 데이터베이스 함수 동작

### 🟡 Important (주요 기능)
1. 즐겨찾기 시스템
2. Tiptap 에디터 기능
3. 모바일 반응형 동작
4. React Query 캐싱

### 🟢 Nice to Have (추가 검증)
1. 성능 최적화 확인
2. 브라우저 호환성
3. 접근성 검사
4. SEO 최적화

---

## 테스트 환경 구성 제안

### 필수 도구 설치
```bash
# 테스트 프레임워크
yarn add -D jest @testing-library/react @testing-library/jest-dom
yarn add -D @testing-library/user-event

# E2E 테스트
yarn add -D playwright @playwright/test

# API 모킹
yarn add -D msw

# 테스트 유틸리티
yarn add -D @supabase/supabase-js-test-helpers
```

### 테스트 스크립트 추가
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 체크리스트 사용 가이드

1. **구현 확인**: 실제 구현된 기능만 테스트
2. **단계적 접근**: Critical → Important → Nice to Have 순서
3. **병렬 테스트**: 독립적인 기능은 동시 테스트
4. **회귀 방지**: 버그 수정 후 관련 기능 재테스트
5. **문서화**: 테스트 결과 및 발견된 이슈 기록

**목표**: 현재 구현된 MVP 기능의 안정성 확보 및 사용자 경험 품질 보장