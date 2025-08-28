/**
 * 커뮤니티 관련 유틸리티 함수들
 */

/**
 * 커뮤니티 관련 상수들
 */
export const COMMUNITY_CONSTANTS = {
  /** 홈 섹션에서 표시할 게시글 수 */
  HOME_SECTION_POST_LIMIT: 5,
  /** 조회수 k 단위 변환 임계값 */
  VIEW_COUNT_THRESHOLD: 1000,
} as const;

/**
 * 날짜를 상대적인 시간으로 포맷팅
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2시간 전", "3일 전")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days < 7) {
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

/**
 * 숫자를 k 단위로 포맷팅 (1000 이상일 때)
 * @param count - 포맷할 숫자
 * @returns 포맷된 숫자 문자열 (예: "1.2k", "500")
 */
export const formatCount = (count: number): string => {
  if (count >= COMMUNITY_CONSTANTS.VIEW_COUNT_THRESHOLD) {
    return `${(count / COMMUNITY_CONSTANTS.VIEW_COUNT_THRESHOLD).toFixed(1)}k`.replace('.0k', 'k');
  }
  return count.toString();
};