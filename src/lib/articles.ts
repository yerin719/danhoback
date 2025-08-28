export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string; // 마크다운 컨텐츠
  category: ArticleCategory;
  featuredImage: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags?: string[];
  readTime: number; // 예상 읽기 시간 (분)
  views: number;
}

export type ArticleCategory = "가이드" | "제품 브랜드" | "운동" | "식단" | "트렌드";

export const articleCategories: ArticleCategory[] = [
  "가이드",
  "제품 브랜드", 
  "운동",
  "식단",
  "트렌드"
];

export const categoryDescriptions = {
  "가이드": "성분 해설, 섭취량 가이드",
  "제품 브랜드": "비교, 리뷰, 신제품",
  "운동": "목적별 단백질 전략",
  "식단": "레시피, 다이어트/벌크업 사례",
  "트렌드": "문화, 체험기, 소식"
};

export const articles: Article[] = [
  {
    id: "1",
    title: "단백질 보충제 완벽 가이드: 초보자를 위한 단백질 종류별 특징",
    summary: "WPI, WPC, 카제인 등 단백질 보충제의 종류와 특징을 알아보고, 자신에게 맞는 제품을 선택하는 방법을 소개합니다.",
    content: `# 단백질 보충제 완벽 가이드

## 서론
단백질 보충제는 현대인의 건강한 생활에 필수적인 영양소 공급원입니다. 이 가이드에서는 각 단백질의 특성을 자세히 알아보겠습니다.

## 주요 단백질 종류

### 1. 분리유청단백 (WPI)
- **특징**: 90% 이상의 고순도 단백질
- **장점**: 빠른 흡수, 낮은 유당 함량
- **적합한 대상**: 유당불내증이 있는 분, 체중 감량 중인 분

### 2. 농축유청단백 (WPC)
- **특징**: 70-80%의 단백질 함량
- **장점**: 경제적, 자연스러운 영양소 보존
- **적합한 대상**: 일반적인 근육 증량 목적

### 3. 카제인 단백질
- **특징**: 느린 흡수 속도
- **장점**: 오랜 시간 아미노산 공급
- **적합한 대상**: 야간 단백질 보충, 다이어트

## 선택 기준
1. **목적**: 근육 증량 vs 체중 감량
2. **소화력**: 유당불내증 여부
3. **예산**: 가격대별 선택
4. **취향**: 맛과 용해도

## 결론
자신의 목적과 상황에 맞는 단백질을 선택하여 꾸준히 섭취하는 것이 가장 중요합니다.`,
    category: "가이드",
    featuredImage: "/api/placeholder/600/400",
    author: "영양사 김단백",
    publishedAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    tags: ["단백질", "보충제", "초보자", "가이드"],
    readTime: 8,
    views: 2847
  },
  {
    id: "2", 
    title: "머슬팜 vs 옵티멈 뉴트리션: 대표 제품 비교 분석",
    summary: "두 글로벌 브랜드의 대표 제품들을 성분, 가격, 맛 측면에서 객관적으로 비교분석해봅니다.",
    content: `# 머슬팜 vs 옵티멈 뉴트리션 비교

## 브랜드 소개

### 머슬팜 (MusclePharm)
- 설립: 2008년
- 특징: 혁신적인 제품 개발, 운동선수 지원
- 대표 제품: Combat 100% Whey

### 옵티멈 뉴트리션 (Optimum Nutrition)
- 설립: 1986년
- 특징: 오랜 전통, 검증된 품질
- 대표 제품: Gold Standard 100% Whey

## 상세 비교

### 1. 성분 비교
| 구분 | 머슬팜 Combat | 옵티멈 골드 스탠다드 |
|------|---------------|---------------------|
| 단백질 함량 | 25g | 24g |
| 칼로리 | 140kcal | 120kcal |
| 탄수화물 | 8g | 3g |
| 지방 | 2.5g | 1g |

### 2. 가격 비교
- **머슬팜**: 1회분당 약 1,200원
- **옵티멈**: 1회분당 약 1,500원

### 3. 맛과 용해도
- **머슬팜**: 진한 맛, 다소 거품 발생
- **옵티멈**: 깔끔한 맛, 우수한 용해도

## 결론
초보자에게는 옵티멈이, 고칼로리를 원하는 분에게는 머슬팜을 추천합니다.`,
    category: "제품 브랜드",
    featuredImage: "", 
    author: "리뷰어 박비교",
    publishedAt: "2025-01-12T14:30:00Z",
    updatedAt: "2025-01-12T14:30:00Z",
    tags: ["머슬팜", "옵티멈뉴트리션", "비교", "리뷰"],
    readTime: 12,
    views: 1923
  },
  {
    id: "3",
    title: "근력 운동별 최적의 단백질 섭취 전략",
    summary: "벤치프레스, 스쿼트, 데드리프트 등 주요 운동에 따른 단백질 섭취 타이밍과 양을 알아봅니다.",
    content: `# 운동별 단백질 섭취 전략

## 기본 원칙
운동 강도와 종류에 따라 단백질 섭취 전략이 달라져야 합니다.

## 운동별 전략

### 1. 벤치프레스 (가슴 운동)
- **운동 전**: 30분 전 BCAA 10g
- **운동 후**: 30분 내 단백질 25-30g
- **추천 제품**: 빠른 흡수 WPI

### 2. 스쿼트 (하체 운동)
- **운동 전**: 1시간 전 탄수화물 + 단백질
- **운동 후**: 45분 내 단백질 30-35g
- **추천 제품**: WPC + 크레아틴

### 3. 데드리프트 (전신 운동)
- **운동 전**: 충분한 수분과 전해질
- **운동 후**: 1시간 내 고단백 식사
- **추천 제품**: 카제인 + WPI 혼합

## 운동 강도별 섭취량
- **가벼운 운동**: 체중 1kg당 1.2g
- **중간 강도**: 체중 1kg당 1.6g  
- **고강도**: 체중 1kg당 2.0g

## 주의사항
개인의 체질과 소화능력을 고려하여 조절해야 합니다.`,
    category: "운동",
    featuredImage: "",
    author: "트레이너 최운동",
    publishedAt: "2025-01-10T11:15:00Z",
    updatedAt: "2025-01-10T11:15:00Z", 
    tags: ["운동", "단백질섭취", "벤치프레스", "스쿼트"],
    readTime: 10,
    views: 3156
  },
  {
    id: "4",
    title: "다이어트 성공을 위한 고단백 저칼로리 레시피 5선",
    summary: "맛있고 간편하게 만들 수 있는 고단백 저칼로리 요리 레시피를 소개합니다.",
    content: `# 고단백 저칼로리 레시피

## 레시피 소개
다이어트 중에도 맛있게 먹을 수 있는 고단백 요리들을 소개합니다.

## 1. 단백질 팬케이크
### 재료 (1인분)
- 달걀흰자 3개
- 바나나 1/2개
- 단백질파우더 1스쿱 (30g)
- 베이킹파우더 1/2티스푼

### 만드는 법
1. 모든 재료를 믹서기에 넣고 갈기
2. 팬에 기름 없이 앞뒤로 굽기
3. 블루베리나 견과류 토핑

**영양정보**: 단백질 35g, 칼로리 220kcal

## 2. 치킨 단백질 샐러드
### 재료 (1인분)
- 닭가슴살 150g
- 각종 채소 200g
- 그릭요거트 100g
- 단백질파우더 1/2스쿱

### 만드는 법
1. 닭가슴살 수비드 또는 삶기
2. 채소와 함께 플레이팅
3. 요거트+단백질파우더 드레싱

**영양정보**: 단백질 45g, 칼로리 280kcal

## 3. 단백질 스무디볼
간편하고 영양가 있는 아침식사 대용으로 완벽합니다.

## 4. 두부 스크램블
식물성 단백질을 원하는 분들에게 추천합니다.

## 5. 프로틴 에너지볼
운동 전후 간식으로 최적의 선택입니다.`,
    category: "식단",
    featuredImage: "",
    author: "영양사 이식단", 
    publishedAt: "2025-01-08T16:45:00Z",
    updatedAt: "2025-01-08T16:45:00Z",
    tags: ["다이어트", "레시피", "고단백", "저칼로리"],
    readTime: 15,
    views: 4231
  },
  {
    id: "5",
    title: "2025년 단백질 보충제 트렌드: 식물성 단백질의 급부상",
    summary: "올해 단백질 시장의 주요 트렌드와 소비자들의 선호도 변화를 분석해봅니다.",
    content: `# 2025년 단백질 보충제 트렌드

## 주요 트렌드 분석

### 1. 식물성 단백질 급부상
최근 3년간 식물성 단백질 판매량이 연평균 35% 증가했습니다.

#### 인기 식물성 단백질
- **완두단백**: 아미노산 프로파일 우수
- **현미단백**: 소화 용이성
- **콩단백**: 경제성과 접근성

### 2. 개인 맞춤형 제품
- DNA 검사 기반 맞춤 단백질
- 운동 스타일별 특화 제품
- 개인별 알레르기 고려 제품

### 3. 지속가능성 중시
- 친환경 포장재 사용
- 탄소발자국 줄이기 캠페인
- 윤리적 원료 조달

## 시장 데이터

### 판매량 증가율 (전년 대비)
- 식물성 단백질: +35%
- 일반 유청단백: +5%
- 카제인 단백질: +8%

### 소비자 선호도 변화
1. **맛의 다양성**: 기존 바닐라, 초코를 넘어선 새로운 맛
2. **편의성**: 개별 포장, 즉석 음료
3. **투명성**: 원료 출처와 제조 과정 공개

## 미래 전망
앞으로 2-3년간 식물성 단백질 시장은 지속적으로 성장할 것으로 예상됩니다.

### 주목해야 할 신제품
- 인공지능 기반 배합 제품
- 기능성 강화 단백질
- 완전 개인화 맞춤 제품

## 소비자 조언
트렌드에 휩쓸리기보다는 자신의 목적과 체질에 맞는 제품을 선택하는 것이 중요합니다.`,
    category: "트렌드",
    featuredImage: "/api/placeholder/600/400",
    author: "시장분석가 한트렌드",
    publishedAt: "2025-01-05T13:20:00Z", 
    updatedAt: "2025-01-05T13:20:00Z",
    tags: ["트렌드", "식물성단백질", "시장분석", "2025"],
    readTime: 7,
    views: 1654
  },
  {
    id: "6",
    title: "단백질 보충제 부작용과 안전한 섭취 방법",
    summary: "과다 섭취 시 나타날 수 있는 부작용과 이를 예방하는 올바른 섭취 방법을 알아봅니다.",
    content: `# 단백질 보충제의 안전한 섭취

## 일반적인 부작용

### 1. 소화계 문제
- 복부 팽만감
- 가스 생성 증가
- 설사 또는 변비

### 2. 신장 부담
- 과도한 단백질은 신장에 무리
- 충분한 수분 섭취 필요

### 3. 알레르기 반응
- 유당불내증
- 대두 알레르기
- 기타 원료별 알레르기

## 안전한 섭취 가이드

### 권장 섭취량
- 일반인: 체중 1kg당 0.8-1.2g
- 운동인: 체중 1kg당 1.6-2.2g
- 최대 한도: 체중 1kg당 2.5g

### 섭취 시점
- 운동 후 30분 내 골든타임 활용
- 식사와 2시간 간격 유지
- 잠들기 3시간 전까지

## 주의사항
기존 질환이 있는 경우 전문의와 상담 후 섭취하세요.`,
    category: "가이드", 
    featuredImage: "/api/placeholder/600/400",
    author: "약사 정안전",
    publishedAt: "2025-01-03T10:30:00Z",
    updatedAt: "2025-01-03T10:30:00Z",
    tags: ["안전성", "부작용", "가이드", "건강"],
    readTime: 6,
    views: 2134
  }
];

// 유틸리티 함수들
export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter(article => article.category === category);
}

export function getFeaturedArticle(): Article {
  return articles.reduce((latest, article) => 
    new Date(article.publishedAt) > new Date(latest.publishedAt) ? article : latest
  );
}

export function getRelatedArticles(currentId: string, category: ArticleCategory, limit: number = 3): Article[] {
  return articles
    .filter(article => article.id !== currentId && article.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function searchArticles(query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.summary.toLowerCase().includes(lowercaseQuery) ||
    article.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getLatestArticles(limit: number = 5): Article[] {
  return articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}