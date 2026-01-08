/**
 * 제품 페이지 광고 배너 캠페인 데이터
 */
export const productPageBannerCampaigns = [
  {
    id: "coupang-diet-management",
    imageUrl: "/cupang-flesh-banner.png",
    ctaUrl: "https://link.coupang.com/a/cTAjlC",
    isExternal: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6개월 후
    isActive: true,
    priority: "high" as const,
  },
  {
    id: "coupang-partnership",
    imageUrl: "/cupang0108.png",
    ctaUrl: "https://link.coupang.com/a/dk9eus",
    isExternal: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
    isActive: true,
    priority: "high" as const,
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
