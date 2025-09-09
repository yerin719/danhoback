/**
 * 인증이 필요한 페이지 경로들
 */
const AUTH_REQUIRED_ROUTES = [
  '/profile',      // 프로필 페이지
  '/favorites',    // 찜 목록
  '/admin',        // 관리자 페이지
  '/articles/new', // 아티클 작성
  '/community/write', // 커뮤니티 글 작성
];

/**
 * 인증이 필요한 경로 패턴들 (정규식으로 매칭)
 */
const AUTH_REQUIRED_PATTERNS = [
  /^\/admin(\/.*)?$/,        // /admin으로 시작하는 모든 경로
  /^\/profile(\/.*)?$/,      // /profile로 시작하는 모든 경로
  /^\/users\/me(\/.*)?$/,    // 내 사용자 정보 관련 경로
];

/**
 * 주어진 경로가 인증이 필요한 페이지인지 확인합니다.
 * @param pathname - 확인할 경로 (예: '/profile', '/articles/new')
 * @returns 인증이 필요하면 true, 공개 페이지면 false
 */
export function isAuthRequiredPage(pathname: string): boolean {
  // 정확한 경로 매칭
  if (AUTH_REQUIRED_ROUTES.includes(pathname)) {
    return true;
  }

  // 패턴 매칭
  return AUTH_REQUIRED_PATTERNS.some(pattern => pattern.test(pathname));
}

/**
 * 공개적으로 접근 가능한 페이지들 (명시적으로 정의)
 */
const PUBLIC_ROUTES = [
  '/',               // 홈페이지
  '/products',       // 제품 목록
  '/articles',       // 아티클 목록
  '/community',      // 커뮤니티 목록
  '/auth/login',     // 로그인
  '/auth/signup',    // 회원가입
  '/privacy-policy', // 개인정보처리방침
];

/**
 * 공개 경로 패턴들
 */
const PUBLIC_PATTERNS = [
  /^\/products\/[\w-]+$/,     // 제품 상세 페이지
  /^\/articles\/[\w-]+$/,     // 아티클 상세 페이지  
  /^\/community\/[\w-]+$/,    // 커뮤니티 게시글 상세 (읽기만)
  /^\/auth\/(.*)?$/,          // 인증 관련 모든 페이지
];

/**
 * 주어진 경로가 공개 페이지인지 확인합니다.
 * @param pathname - 확인할 경로
 * @returns 공개 페이지면 true
 */
export function isPublicPage(pathname: string): boolean {
  // 정확한 경로 매칭
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // 패턴 매칭
  return PUBLIC_PATTERNS.some(pattern => pattern.test(pathname));
}