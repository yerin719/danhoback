"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useBrands } from "@/features/admin/brands/hooks";
import {
  useCreateProductLine,
  useDeleteProductLine,
  useProductLines,
} from "@/features/admin/product-lines/hooks";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProductLinesPage() {
  const { data: productLines, isLoading } = useProductLines();
  const { data: brands } = useBrands();
  const createMutation = useCreateProductLine();
  const deleteMutation = useDeleteProductLine();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    brandId: "",
    name: "",
    description: "",
    form: "powder" as "powder" | "rtd",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandId || !formData.name) return;

    try {
      await createMutation.mutateAsync({
        brandId: formData.brandId,
        name: formData.name,
        description: formData.description || undefined,
        form: formData.form,
      });
      setFormData({ brandId: "", name: "", description: "", form: "powder" });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create product line:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete product line:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">제품 라인 관리</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              제품 라인 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>제품 라인 등록</DialogTitle>
              <DialogDescription>새로운 제품 라인을 등록합니다.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="brandId">브랜드</Label>
                  <Select
                    value={formData.brandId}
                    onValueChange={(value) => setFormData({ ...formData, brandId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="브랜드를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">제품 라인 이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 골드 스탠다드 웨이"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="form">제품 형태</Label>
                  <Select
                    value={formData.form}
                    onValueChange={(value: "powder" | "rtd") =>
                      setFormData({ ...formData, form: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="powder">파우더</SelectItem>
                      <SelectItem value="rtd">드링크 (RTD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">설명 (선택사항)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="제품 라인에 대한 설명을 입력하세요"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "등록 중..." : "등록"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>브랜드</TableHead>
              <TableHead>제품 라인</TableHead>
              <TableHead>형태</TableHead>
              <TableHead>설명</TableHead>
              <TableHead className="w-[100px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : productLines?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  등록된 제품 라인이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              productLines?.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.brand?.name}</TableCell>
                  <TableCell className="font-medium">{line.name}</TableCell>
                  <TableCell>{line.form === "powder" ? "파우더" : "드링크"}</TableCell>
                  <TableCell className="max-w-xs truncate">{line.description || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(line.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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