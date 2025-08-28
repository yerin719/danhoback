import { 
  BookOpen, 
  Package, 
  Dumbbell, 
  ChefHat, 
  TrendingUp,
  LucideIcon 
} from "lucide-react";
import type { ArticleCategory } from "./articles";

export interface CategoryIconConfig {
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

export const categoryIconConfig: Record<ArticleCategory, CategoryIconConfig> = {
  "가이드": {
    icon: BookOpen,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  "제품 브랜드": {
    icon: Package,
    bgColor: "bg-purple-100", 
    iconColor: "text-purple-600"
  },
  "운동": {
    icon: Dumbbell,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  "식단": {
    icon: ChefHat,
    bgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  "트렌드": {
    icon: TrendingUp,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600"
  }
};

export function getCategoryIcon(category: ArticleCategory): CategoryIconConfig {
  return categoryIconConfig[category];
}