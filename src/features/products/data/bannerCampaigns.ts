/**
 * 제품 페이지 광고 배너 캠페인 데이터
 */
export const productPageBannerCampaigns = [
  {
    id: "spring-protein-sale",
    title: "여름맞이 단백질 특가!",
    subtitle: "프리미엄 보충제 할인",
    description: "최대 40% 할인 + 무료배송 혜택",
    ctaUrl: "/products?sale=spring",
    gradientBackground: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
    textColor: "#fff",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
    isActive: true,
    priority: "high" as const,
  },
  {
    id: "text-only-promo",
    title: "💪 새로운 단백질 라인업",
    description: "혁신적인 아이솔레이트 프로틴 출시",
    ctaUrl: "/products/new",
    gradientBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#FFFFFF",
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14일 후
    isActive: true,
    priority: "medium" as const,
  },
  {
    id: "minimal-banner",
    title: "빠진 정보를 찾아라!",
    subtitle:
      "정보 등록/수정요청을 하신 회원님들께\n추첨을 통해 스타벅스 아이스아메리카노를 제공해드립니다!",
    textColor: "#FFFFFF",
    gradientBackground: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
    isActive: true,
    priority: "low" as const,
  },
] as const;

/**
 * 활성화된 배너만 필터링
 */
export function getActiveBannerCampaigns() {
  const now = new Date();
  return productPageBannerCampaigns.filter(
    (campaign) => campaign.isActive && campaign.startDate <= now && campaign.endDate >= now,
  );
}

/**
 * 우선순위별 배너 정렬
 */
export function getSortedBannerCampaigns() {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return getActiveBannerCampaigns().sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority],
  );
}
