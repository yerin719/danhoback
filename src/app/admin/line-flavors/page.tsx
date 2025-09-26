"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  useCreateLineFlavor,
  useDeleteLineFlavor,
  useLineFlavors,
  useProteinTypes,
} from "@/features/admin/line-flavors/hooks";
import { useProductLines } from "@/features/admin/product-lines/hooks";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const flavorCategories = [
  { value: "grain", label: "곡물" },
  { value: "chocolate", label: "초콜릿" },
  { value: "strawberry", label: "딸기" },
  { value: "banana", label: "바나나" },
  { value: "milk", label: "우유" },
  { value: "coffee", label: "커피" },
  { value: "original", label: "오리지날" },
  { value: "black_sesame", label: "흑임자" },
  { value: "milktea", label: "밀크티" },
  { value: "greentea", label: "녹차" },
  { value: "vanilla", label: "바닐라" },
  { value: "corn", label: "옥수수" },
  { value: "other", label: "기타" },
];

export default function LineFlavorsPage() {
  const { data: lineFlavors, isLoading } = useLineFlavors();
  const { data: productLines } = useProductLines();
  const { data: proteinTypes } = useProteinTypes();
  const createMutation = useCreateLineFlavor();
  const deleteMutation = useDeleteLineFlavor();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    lineId: "",
    flavorCategory: "",
    flavorName: "",
    nutrition: {
      servingSize: "",
      calories: "",
      protein: "",
      carbs: "",
      sugar: "",
      fat: "",
      saturatedFat: "",
      unsaturatedFat: "",
      transFat: "",
      dietaryFiber: "",
      sodium: "",
      cholesterol: "",
      calcium: "",
      allergenInfo: "",
    },
    selectedProteinTypes: [] as string[],
  });

  const toggleProteinType = (id: string) => {
    const exists = formData.selectedProteinTypes.includes(id);
    if (exists) {
      setFormData({
        ...formData,
        selectedProteinTypes: formData.selectedProteinTypes.filter((ptId) => ptId !== id),
      });
    } else {
      setFormData({
        ...formData,
        selectedProteinTypes: [...formData.selectedProteinTypes, id],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lineId || !formData.flavorName || !formData.nutrition.protein) return;

    try {
      await createMutation.mutateAsync({
        lineId: formData.lineId,
        flavorCategory: formData.flavorCategory || undefined,
        flavorName: formData.flavorName,
        nutrition: {
          servingSize: formData.nutrition.servingSize ? Number(formData.nutrition.servingSize) : undefined,
          calories: formData.nutrition.calories ? Number(formData.nutrition.calories) : undefined,
          protein: Number(formData.nutrition.protein),
          carbs: formData.nutrition.carbs ? Number(formData.nutrition.carbs) : undefined,
          sugar: formData.nutrition.sugar ? Number(formData.nutrition.sugar) : undefined,
          fat: formData.nutrition.fat ? Number(formData.nutrition.fat) : undefined,
          saturatedFat: formData.nutrition.saturatedFat ? Number(formData.nutrition.saturatedFat) : undefined,
          unsaturatedFat: formData.nutrition.unsaturatedFat ? Number(formData.nutrition.unsaturatedFat) : undefined,
          transFat: formData.nutrition.transFat ? Number(formData.nutrition.transFat) : undefined,
          dietaryFiber: formData.nutrition.dietaryFiber ? Number(formData.nutrition.dietaryFiber) : undefined,
          sodium: formData.nutrition.sodium ? Number(formData.nutrition.sodium) : undefined,
          cholesterol: formData.nutrition.cholesterol ? Number(formData.nutrition.cholesterol) : undefined,
          calcium: formData.nutrition.calcium ? Number(formData.nutrition.calcium) : undefined,
          allergenInfo: formData.nutrition.allergenInfo || undefined,
        },
        proteinTypes: formData.selectedProteinTypes.map((id) => ({
          proteinTypeId: id,
        })),
      });

      setFormData({
        lineId: "",
        flavorCategory: "",
        flavorName: "",
        nutrition: {
          servingSize: "",
          calories: "",
          protein: "",
          carbs: "",
          sugar: "",
          fat: "",
          saturatedFat: "",
          unsaturatedFat: "",
          transFat: "",
          dietaryFiber: "",
          sodium: "",
          cholesterol: "",
          calcium: "",
          allergenInfo: "",
        },
        selectedProteinTypes: [],
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create line flavor:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete line flavor:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">제품 라인 맛 관리</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              맛 정보 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>맛 정보 등록</DialogTitle>
              <DialogDescription>제품 라인에 새로운 맛을 등록합니다.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lineId">제품 라인</Label>
                    <Select
                      value={formData.lineId}
                      onValueChange={(value) => setFormData({ ...formData, lineId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="제품 라인 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {productLines?.map((line) => (
                          <SelectItem key={line.id} value={line.id}>
                            {line.brand?.name} - {line.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="flavorCategory">맛 카테고리</Label>
                    <Select
                      value={formData.flavorCategory}
                      onValueChange={(value) => setFormData({ ...formData, flavorCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {flavorCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="flavorName">맛 이름</Label>
                  <Input
                    id="flavorName"
                    value={formData.flavorName}
                    onChange={(e) => setFormData({ ...formData, flavorName: e.target.value })}
                    placeholder="예: 더블 리치 초콜릿"
                  />
                </div>

                <div className="space-y-3">
                  <Label>단백질 종류</Label>
                  <div className="grid grid-cols-2 gap-3 border rounded-lg p-4">
                    {proteinTypes?.map((pt) => (
                      <div key={pt.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`pt-${pt.id}`}
                          checked={formData.selectedProteinTypes.includes(pt.id)}
                          onCheckedChange={() => toggleProteinType(pt.id)}
                        />
                        <Label htmlFor={`pt-${pt.id}`} className="cursor-pointer">
                          {pt.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>영양 정보</Label>
                  <div className="grid grid-cols-3 gap-3 border rounded-lg p-4">
                    <div className="grid gap-2">
                      <Label htmlFor="servingSize">1회 제공량 (g)</Label>
                      <Input
                        id="servingSize"
                        type="number"
                        value={formData.nutrition.servingSize}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, servingSize: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="calories">칼로리 (kcal)</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={formData.nutrition.calories}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, calories: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sodium">나트륨 (mg)</Label>
                      <Input
                        id="sodium"
                        type="number"
                        value={formData.nutrition.sodium}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, sodium: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="carbs">탄수화물 (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        value={formData.nutrition.carbs}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, carbs: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sugar">당류 (g)</Label>
                      <Input
                        id="sugar"
                        type="number"
                        value={formData.nutrition.sugar}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, sugar: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dietaryFiber">식이섬유 (g)</Label>
                      <Input
                        id="dietaryFiber"
                        type="number"
                        value={formData.nutrition.dietaryFiber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, dietaryFiber: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fat">지방 (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        value={formData.nutrition.fat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, fat: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="transFat">트랜스지방 (g)</Label>
                      <Input
                        id="transFat"
                        type="number"
                        value={formData.nutrition.transFat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, transFat: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="saturatedFat">포화지방 (g)</Label>
                      <Input
                        id="saturatedFat"
                        type="number"
                        value={formData.nutrition.saturatedFat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, saturatedFat: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cholesterol">콜레스테롤 (mg)</Label>
                      <Input
                        id="cholesterol"
                        type="number"
                        value={formData.nutrition.cholesterol}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, cholesterol: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="protein">단백질 (g) *</Label>
                      <Input
                        id="protein"
                        type="number"
                        required
                        value={formData.nutrition.protein}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, protein: e.target.value },
                          })
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="allergenInfo">알레르기 정보</Label>
                  <Textarea
                    id="allergenInfo"
                    value={formData.nutrition.allergenInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrition: { ...formData.nutrition, allergenInfo: e.target.value },
                      })
                    }
                    placeholder="알레르기 유발 성분을 입력하세요"
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
              <TableHead>제품 라인</TableHead>
              <TableHead>맛</TableHead>
              <TableHead>단백질</TableHead>
              <TableHead>칼로리</TableHead>
              <TableHead>단백질 종류</TableHead>
              <TableHead className="w-[100px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : lineFlavors?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  등록된 맛 정보가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              lineFlavors?.map((flavor) => (
                <TableRow key={flavor.id}>
                  <TableCell>
                    {flavor.productLine?.brandName} - {flavor.productLine?.name}
                  </TableCell>
                  <TableCell className="font-medium">{flavor.flavorName}</TableCell>
                  <TableCell>{flavor.nutrition?.protein}g</TableCell>
                  <TableCell>{flavor.nutrition?.calories || "-"}kcal</TableCell>
                  <TableCell className="max-w-xs">
                    {flavor.proteinTypes?.map((pt) => pt.name).join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(flavor.id)}
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