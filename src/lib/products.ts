export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  favorites: number;
  protein: number;
  calories: number;
  carbs: number;
  sugar: number;
  flavor: string;
  proteinType: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "프리미엄 웨이 초코맛 대용량",
    brand: "머슬팜",
    image: "/api/placeholder/300/300",
    favorites: 1248,
    protein: 25,
    calories: 120,
    carbs: 3,
    sugar: 1,
    flavor: "초코",
    proteinType: "분리유청단백(WPI)"
  },
  {
    id: "2",
    name: "골드 스탠다드 딸기맛",
    brand: "옵티멈 뉴트리션",
    image: "/api/placeholder/300/300",
    favorites: 892,
    protein: 24,
    calories: 110,
    carbs: 4,
    sugar: 2,
    flavor: "딸기",
    proteinType: "농축유청단백(WPC)"
  },
  {
    id: "3",
    name: "식물성 프로틴 바나나맛",
    brand: "가든 오브 라이프",
    image: "/api/placeholder/300/300",
    favorites: 567,
    protein: 20,
    calories: 100,
    carbs: 7,
    sugar: 3,
    flavor: "바나나",
    proteinType: "완두단백"
  },
  {
    id: "4",
    name: "카제인 프로틴 말차맛",
    brand: "다이마타이즈",
    image: "/api/placeholder/300/300",
    favorites: 423,
    protein: 25,
    calories: 130,
    carbs: 5,
    sugar: 2,
    flavor: "말차",
    proteinType: "카제인"
  },
  {
    id: "5",
    name: "현미 프로틴 곡물맛",
    brand: "선플라워",
    image: "/api/placeholder/300/300",
    favorites: 234,
    protein: 22,
    calories: 115,
    carbs: 8,
    sugar: 4,
    flavor: "곡물",
    proteinType: "현미단백"
  },
  {
    id: "6",
    name: "아이솔레이트 밀크티맛",
    brand: "BSN",
    image: "/api/placeholder/300/300",
    favorites: 678,
    protein: 26,
    calories: 125,
    carbs: 2,
    sugar: 1,
    flavor: "밀크티",
    proteinType: "분리유청단백(WPI)"
  },
  {
    id: "7",
    name: "오가닉 웨이 녹차맛",
    brand: "오가니카",
    image: "/api/placeholder/300/300",
    favorites: 345,
    protein: 21,
    calories: 105,
    carbs: 6,
    sugar: 3,
    flavor: "녹차",
    proteinType: "농축유청단백(WPC)"
  },
  {
    id: "8",
    name: "하이드로 웨이 커피맛",
    brand: "프로탄",
    image: "/api/placeholder/300/300",
    favorites: 789,
    protein: 27,
    calories: 135,
    carbs: 3,
    sugar: 1,
    flavor: "커피",
    proteinType: "가수분해유청단백(WPH)"
  },
  {
    id: "9",
    name: "초유 프로틴 플레인",
    brand: "콜로스트럼킹",
    image: "/api/placeholder/300/300",
    favorites: 156,
    protein: 23,
    calories: 120,
    carbs: 4,
    sugar: 2,
    flavor: "기타",
    proteinType: "초유"
  },
  {
    id: "10",
    name: "귀리 프로틴 시나몬맛",
    brand: "오트프로",
    image: "/api/placeholder/300/300",
    favorites: 445,
    protein: 19,
    calories: 140,
    carbs: 12,
    sugar: 6,
    flavor: "기타",
    proteinType: "귀리단백"
  },
  {
    id: "11",
    name: "난백 프로틴 바닐라맛",
    brand: "에그프로",
    image: "/api/placeholder/300/300",
    favorites: 267,
    protein: 24,
    calories: 110,
    carbs: 1,
    sugar: 0,
    flavor: "기타",
    proteinType: "난백"
  },
  {
    id: "12",
    name: "산양유 프로틴 초코맛",
    brand: "고트프로틴",
    image: "/api/placeholder/300/300",
    favorites: 123,
    protein: 22,
    calories: 115,
    carbs: 5,
    sugar: 3,
    flavor: "초코",
    proteinType: "산양유"
  }
];

// 필터 옵션들
export const flavorOptions = [
  "전체",
  "초코",
  "딸기",
  "바나나", 
  "말차",
  "곡물",
  "밀크티",
  "녹차",
  "커피",
  "기타"
];

export const proteinTypeOptions = [
  "전체",
  "산양유",
  "초유",
  "농축유청단백(WPC)",
  "분리유청단백(WPI)",
  "가수분해유청단백(WPH)",
  "가수분해분리유청단백(WPIH)",
  "분리대두단백(ISP)",
  "농축대두단백(SPC)",
  "완두단백",
  "현미단백",
  "귀리단백",
  "농축우유단백(MPC)",
  "분리우유단백(MPI)",
  "카제인",
  "난백"
];