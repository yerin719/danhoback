"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteProductSku,
  useProductSkus,
  useToggleSkuAvailability,
} from "@/features/admin/products/hooks";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const packageTypeLabels: Record<string, string> = {
  bulk: "벌크",
  pouch: "파우치",
  stick: "스틱",
};

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProductSkus();
  const toggleMutation = useToggleSkuAvailability();
  const deleteMutation = useDeleteProductSku();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleMutation.mutateAsync({ id, isAvailable: !currentStatus });
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">상품 목록</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            상품 등록
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>브랜드</TableHead>
              <TableHead>제품 라인</TableHead>
              <TableHead>맛</TableHead>
              <TableHead>패키지</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-[150px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  등록된 상품이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.brandName}</TableCell>
                  <TableCell>{product.lineName}</TableCell>
                  <TableCell className="font-medium">{product.flavorName}</TableCell>
                  <TableCell>{packageTypeLabels[product.packageType] || product.packageType}</TableCell>
                  <TableCell>
                    <Badge variant={product.isAvailable ? "default" : "secondary"}>
                      {product.isAvailable ? "활성" : "비활성"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(product.id, product.isAvailable)}
                        disabled={toggleMutation.isPending}
                      >
                        {product.isAvailable ? "비활성화" : "활성화"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}