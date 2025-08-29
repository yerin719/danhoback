export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserPost {
  id: string;
  title: string;
  content: string;
  category: '자유' | '리뷰' | '운동' | '식단' | '다이어트';
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'favorite';
  description: string;
  targetTitle?: string;
  targetUrl?: string;
  createdAt: string;
}

// Mock 데이터 - 현재 로그인된 사용자
export const currentUser: User = {
  id: 'current-user',
  name: '홍길동',
  email: 'hong@example.com',
  avatar: '/api/placeholder/100/100',
};

// Mock 데이터 - 사용자 게시물
export const userPosts: UserPost[] = [
  {
    id: '1',
    title: '프로틴 선택 고민 중입니다',
    content: '처음 프로틴을 구매하려고 하는데, 어떤 브랜드가 좋을까요? 맛과 효과 모두 중요합니다.',
    category: '자유',
    createdAt: '2024-01-10T14:30:00Z',
    likes: 12,
    comments: 8,
    isLiked: false,
  },
  {
    id: '2',
    title: '골드 스탠다드 초코맛 리뷰',
    content: '한 달간 섭취 후기입니다. 맛도 좋고 소화도 잘 되네요. 추천합니다!',
    category: '리뷰',
    createdAt: '2024-01-08T10:15:00Z',
    likes: 23,
    comments: 15,
    isLiked: true,
  },
  {
    id: '3',
    title: '다이어트 중 프로틴 섭취 방법',
    content: '다이어트 중에도 근손실 없이 프로틴을 효과적으로 섭취하는 방법을 공유합니다.',
    category: '다이어트',
    createdAt: '2024-01-05T16:45:00Z',
    likes: 45,
    comments: 32,
    isLiked: false,
  },
];

// Mock 데이터 - 최근 활동
export const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'post',
    description: '새 글을 작성했습니다',
    targetTitle: '프로틴 선택 고민 중입니다',
    targetUrl: '/community/1',
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '2',
    type: 'favorite',
    description: '제품을 찜했습니다',
    targetTitle: '프리미엄 웨이 초코맛 대용량',
    targetUrl: '/products/1',
    createdAt: '2024-01-10T11:20:00Z',
  },
  {
    id: '3',
    type: 'comment',
    description: '댓글을 작성했습니다',
    targetTitle: '베스트 프로틴 추천',
    targetUrl: '/community/5',
    createdAt: '2024-01-09T15:45:00Z',
  },
];

// 유틸 함수들
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return '오늘';
  if (diffInDays === 1) return '어제';
  if (diffInDays < 7) return `${diffInDays}일 전`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
  return `${Math.floor(diffInDays / 30)}개월 전`;
};

// 현재 사용자인지 확인 (하드코딩)
export const isCurrentUser = (userId?: string): boolean => {
  return !userId || userId === 'current-user';
};