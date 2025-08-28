export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: CommunityCategory;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  images?: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  createdAt: string;
  parentId?: string; // 답글을 위한 부모 댓글 ID
}

export type CommunityCategory = "자유" | "리뷰" | "운동" | "식단" | "다이어트";

export const communityCategories: CommunityCategory[] = [
  "자유",
  "리뷰",
  "운동",
  "식단",
  "다이어트",
];

// 카테고리 설명
export const categoryDescriptions: Record<CommunityCategory, string> = {
  자유: "일상, 운동 인증, 소소한 이야기들",
  리뷰: "단백질 제품 후기 및 경험담",
  운동: "운동 기록 및 루틴 공유",
  식단: "단백질 레시피 및 식단 관리",
  다이어트: "체중 관리 및 다이어트 후기",
};

// Mock 데이터 생성을 위한 샘플 포스트들
export const communityPosts: CommunityPost[] = [
  {
    id: "1",
    title: "오늘 등 운동 완료! 💪",
    content:
      "데드리프트 100kg로 5세트 완료했어요. 단백질 쉐이크도 챙겨 마시고 왔습니다. 등이 펌핑되는 느낌이 너무 좋네요!",
    category: "자유",
    author: {
      id: "user1",
      name: "근육맨김철수",
      avatar: "/api/placeholder/40/40",
    },
    images: ["/api/placeholder/600/400"],
    likes: 24,
    comments: 8,
    views: 0,
    createdAt: "2025-01-20T18:30:00Z",
    updatedAt: "2025-01-20T18:30:00Z",
  },
  {
    id: "2",
    title: "옵티멈 골드 스탠다드 초코맛 리뷰",
    content:
      "드디어 옵티멈 골드 스탠다드 초코맛을 먹어봤어요! 물에도 잘 녹고 맛도 진짜 진한 초코맛이에요. 단백질 함량도 24g으로 충분하고 가격도 합리적인 것 같습니다. 다만 단맛이 좀 강한 편이라 물 양을 늘려서 드시는 걸 추천해요.",
    category: "리뷰",
    author: {
      id: "user2",
      name: "단백질헌터",
      avatar: "/api/placeholder/40/41",
    },
    images: ["/api/placeholder/600/401", "/api/placeholder/600/402"],
    likes: 45,
    comments: 12,
    views: 234,
    createdAt: "2025-01-20T16:15:00Z",
    updatedAt: "2025-01-20T16:15:00Z",
  },
  {
    id: "3",
    title: "오늘 아침 고단백 팬케이크 만들어먹음!",
    content:
      "달걀흰자 3개 + 바나나 반개 + 단백질파우더 1스쿱으로 만든 팬케이크! 블루베리 올려서 먹으니까 정말 맛있어요. 단백질 35g에 칼로리는 220kcal 정도 나오는 것 같아요.",
    category: "식단",
    author: {
      id: "user3",
      name: "건강요리사",
      avatar: "/api/placeholder/40/42",
    },
    images: ["/api/placeholder/600/403"],
    likes: 67,
    comments: 15,
    views: 389,
    createdAt: "2025-01-20T09:45:00Z",
    updatedAt: "2025-01-20T09:45:00Z",
  },
  {
    id: "4",
    title: "다이어트 시작한지 1개월, 인바디 결과!",
    content:
      "작년 12월부터 다이어트 시작해서 지금까지 체중 3kg 감량했어요! 인바디 찍어보니 근육량은 유지하면서 체지방만 빠진 것 같아서 너무 만족해요. 매일 단백질 100g 이상 섭취하고 주 4회 운동한 결과입니다.",
    category: "다이어트",
    author: {
      id: "user4",
      name: "다이어터민지",
      avatar: "/api/placeholder/40/43",
    },
    images: ["/api/placeholder/600/404"],
    likes: 89,
    comments: 23,
    views: 1512,
    createdAt: "2025-01-19T20:00:00Z",
    updatedAt: "2025-01-19T20:00:00Z",
  },
  {
    id: "5",
    title: "집에서 하는 전신 홈트레이닝 루틴 공유",
    content:
      "헬스장 못 갈 때 집에서 하는 루틴이에요! 버피 20개 → 푸시업 15개 → 스쿼트 25개 → 플랭크 1분을 3세트 반복해요. 운동 후에는 꼭 단백질 쉐이크 마시고 있습니다!",
    category: "운동",
    author: {
      id: "user5",
      name: "홈트마스터",
      avatar: "/api/placeholder/40/44",
    },
    likes: 32,
    comments: 9,
    views: 145,
    createdAt: "2025-01-19T14:20:00Z",
    updatedAt: "2025-01-19T14:20:00Z",
  },
  {
    id: "6",
    title: "해외직구로 산 머슬팜 Combat 후기",
    content:
      "아이허브에서 주문한 머슬팜 Combat 쿠키앤크림맛 드디어 도착! 배송비 포함해서 국내가보다 30% 정도 저렴했어요. 맛은... 좀 달달한 편인데 나쁘지 않네요. 용해도는 생각보다 괜찮고 거품도 별로 안 생겨요.",
    category: "리뷰",
    author: {
      id: "user6",
      name: "직구왕",
      avatar: "/api/placeholder/40/45",
    },
    images: ["/api/placeholder/600/405"],
    likes: 28,
    comments: 11,
    views: 187,
    createdAt: "2025-01-19T11:30:00Z",
    updatedAt: "2025-01-19T11:30:00Z",
  },
  {
    id: "7",
    title: "러닝 10km 완주! 🏃‍♂️",
    content:
      "오늘 한강에서 10km 뛰고 왔어요! 1시간 5분 걸렸네요. 러닝 전에 BCAA 먹고, 끝나고 나서 단백질 쉐이크 바로 마셨습니다. 유산소 후 단백질 섭취 타이밍이 중요하다고 하더라고요.",
    category: "운동",

    author: {
      id: "user7",
      name: "러닝러버",
      avatar: "/api/placeholder/40/46",
    },
    images: ["/api/placeholder/600/406"],
    likes: 41,
    comments: 7,
    views: 203,
    createdAt: "2025-01-18T19:45:00Z",
    updatedAt: "2025-01-18T19:45:00Z",
  },
  {
    id: "8",
    title: "닭가슴살 맛있게 먹는 법!",
    content:
      "닭가슴살 매일 먹기 지겨우신 분들을 위해! 올리브오일에 마늘 볶고 → 닭가슴살 넣고 → 간장+올리고당+후추로 간하면 정말 맛있어요. 여기에 브로콜리까지 넣으면 완벽한 고단백 식단!",
    category: "식단",
    author: {
      id: "user8",
      name: "치킨마스터",
      avatar: "/api/placeholder/40/47",
    },
    images: ["/api/placeholder/600/407"],
    likes: 55,
    comments: 18,
    views: 2324,
    createdAt: "2025-01-18T13:10:00Z",
    updatedAt: "2025-01-18T13:10:00Z",
  },
];

// 유틸리티 함수들
export function getPostsByCategory(category: CommunityCategory): CommunityPost[] {
  return communityPosts.filter((post) => post.category === category);
}

export function searchPosts(query: string): CommunityPost[] {
  const lowercaseQuery = query.toLowerCase();
  return communityPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery),
  );
}

export function getLatestPosts(limit: number = 8): CommunityPost[] {
  return communityPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// Mock 댓글 데이터
export const comments: Comment[] = [
  {
    id: "c1",
    postId: "1",
    content: "와 데드리프트 100kg 대단하네요! 저도 목표로 하고 있는 무게인데 어떤 점을 주의해야 할까요?",
    author: {
      id: "user9",
      name: "초보리프터",
      avatar: "/api/placeholder/40/48",
    },
    likes: 3,
    createdAt: "2025-01-20T19:00:00Z",
  },
  {
    id: "c2",
    postId: "1",
    content: "폼이 정말 중요해요! 처음엔 무게보다는 정확한 자세를 익히는 게 좋습니다.",
    author: {
      id: "user1",
      name: "근육맨김철수",
      avatar: "/api/placeholder/40/40",
    },
    likes: 5,
    createdAt: "2025-01-20T19:30:00Z",
    parentId: "c1",
  },
  {
    id: "c3",
    postId: "2",
    content: "저도 이 제품 쓰고 있는데 정말 맛있어요! 바닐라맛도 추천드려요.",
    author: {
      id: "user10",
      name: "프로틴러버",
      avatar: "/api/placeholder/40/49",
    },
    likes: 7,
    createdAt: "2025-01-20T17:00:00Z",
  },
  {
    id: "c4",
    postId: "2",
    content: "가격이 좀 부담되긴 하지만 품질은 확실히 좋은 것 같아요.",
    author: {
      id: "user11",
      name: "알뜰구매자",
      avatar: "/api/placeholder/40/50",
    },
    likes: 2,
    createdAt: "2025-01-20T18:00:00Z",
  },
  {
    id: "c5",
    postId: "3",
    content: "레시피 정말 간단하네요! 내일 아침에 따라해봐야겠어요 👍",
    author: {
      id: "user12",
      name: "요리초보",
      avatar: "/api/placeholder/40/51",
    },
    likes: 4,
    createdAt: "2025-01-20T10:30:00Z",
  },
];

// 댓글 관련 유틸리티 함수들
export function getCommentsByPostId(postId: string): Comment[] {
  return comments.filter(comment => comment.postId === postId);
}

export function getPostById(id: string): CommunityPost | undefined {
  return communityPosts.find(post => post.id === id);
}

export function getRelatedPosts(currentPostId: string, category: CommunityCategory, limit: number = 4): CommunityPost[] {
  return communityPosts
    .filter(post => post.id !== currentPostId && post.category === category)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
