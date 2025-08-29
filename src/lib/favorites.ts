import { Product, products } from "./products";

// 사용자가 찜한 제품 ID 목록 (Mock 데이터)
export const favoriteProductIds: string[] = [
  "1", // 프리미엄 웨이 초코맛 대용량
  "2", // 골드 스탠다드 딸기맛
  "6", // 아이솔레이트 밀크티맛
  "8", // 하이드로 웨이 커피맛
  "13", // 프리미엄 웨이 바닐라맛
  "16", // 골드 스탠다드 초코맛
];

// 찜한 제품 목록 가져오기 (업데이트 순)
export const getFavoriteProducts = (): Product[] => {
  return favoriteProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined)
    .reverse(); // 최근 추가한 것부터 표시
};

// 찜 여부 확인
export const isFavorite = (productId: string): boolean => {
  return favoriteProductIds.includes(productId);
};

// 찜 추가/제거 (실제로는 상태 관리 라이브러리나 API 호출로 처리)
export const toggleFavorite = (productId: string): boolean => {
  const index = favoriteProductIds.indexOf(productId);
  if (index > -1) {
    favoriteProductIds.splice(index, 1);
    return false; // 찜 해제됨
  } else {
    favoriteProductIds.unshift(productId); // 맨 앞에 추가
    return true; // 찜 추가됨
  }
};

// 찜한 제품 개수
export const getFavoriteCount = (): number => {
  return favoriteProductIds.length;
};
