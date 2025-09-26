import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Tag } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const menuItems = [
    {
      title: "제품 라인 관리",
      description: "브랜드별 제품 라인을 등록하고 관리합니다",
      href: "/admin/product-lines",
      icon: Tag,
    },
    {
      title: "제품 라인 맛 관리",
      description: "제품 라인별 맛 정보와 영양성분을 등록합니다",
      href: "/admin/line-flavors",
      icon: Package,
    },
    {
      title: "상품 관리",
      description: "판매 상품(SKU)을 등록하고 관리합니다",
      href: "/admin/products",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">관리자</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-6 h-6" />
                  <CardTitle>{item.title}</CardTitle>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}