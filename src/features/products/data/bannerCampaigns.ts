/**
 * 제품 페이지 광고 배너 캠페인 데이터
 */
export const productPageBannerCampaigns = [
  {
    id: "spring-protein-sale",
    title: "여름맞이 단백질 특가!",
    subtitle: "프리미엄 보충제 할인",
    description: "최대 40% 할인 + 무료배송 혜택",
    imageUrl: "/images/banners/sale-30-off.png",
    ctaUrl: "/products?sale=spring",
    textColor: "#90760B",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
    isActive: true,
    priority: "high" as const,
  },
  {
    id: "text-only-promo",
    title: "💪 새로운 단백질 라인업",
    description: "혁신적인 아이솔레이트 프로틴 출시",
    ctaText: "신제품 보기",
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
    backgroundColor: "#F59E0B",
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
    (campaign) =>
      campaign.isActive &&
      campaign.startDate <= now &&
      campaign.endDate >= now
  );
}

/**
 * 우선순위별 배너 정렬
 */
export function getSortedBannerCampaigns() {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return getActiveBannerCampaigns().sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
  );
}