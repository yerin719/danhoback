"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import { useCreateProduct, useLineFlavorsByLineId } from "@/features/admin/products/hooks";
import { useProductLines } from "@/features/admin/product-lines/hooks";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SkuData {
  name: string;
  size: string;
  servingsPerContainer: string;
  barcode: string;
  slug: string;
  primaryImage: string;
  images: string;
  purchaseUrl: string;
  displayOrder: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { data: productLines } = useProductLines();
  const [selectedLineId, setSelectedLineId] = useState<string | undefined>();
  const { data: lineFlavors } = useLineFlavorsByLineId(selectedLineId);
  const createMutation = useCreateProduct();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lineId: "",
    packageType: "bulk" as "bulk" | "pouch" | "stick",
    selectedFlavorIds: [] as string[],
    skusByFlavor: {} as Record<string, SkuData[]>,
  });

  const handleLineChange = (lineId: string) => {
    setSelectedLineId(lineId);
    setFormData({ ...formData, lineId, selectedFlavorIds: [], skusByFlavor: {} });
  };

  const toggleFlavor = (flavorId: string) => {
    const newSelectedFlavors = formData.selectedFlavorIds.includes(flavorId)
      ? formData.selectedFlavorIds.filter((id) => id !== flavorId)
      : [...formData.selectedFlavorIds, flavorId];

    const newSkusByFlavor = { ...formData.skusByFlavor };
    if (!newSelectedFlavors.includes(flavorId)) {
      delete newSkusByFlavor[flavorId];
    } else if (!newSkusByFlavor[flavorId]) {
      newSkusByFlavor[flavorId] = [
        {
          name: "",
          size: "",
          servingsPerContainer: "",
          barcode: "",
          slug: "",
          primaryImage: "",
          images: "",
          purchaseUrl: "",
          displayOrder: "0",
        },
      ];
    }

    setFormData({
      ...formData,
      selectedFlavorIds: newSelectedFlavors,
      skusByFlavor: newSkusByFlavor,
    });
  };

  const addSku = (flavorId: string) => {
    setFormData({
      ...formData,
      skusByFlavor: {
        ...formData.skusByFlavor,
        [flavorId]: [
          ...(formData.skusByFlavor[flavorId] || []),
          {
            name: "",
            size: "",
            servingsPerContainer: "",
            barcode: "",
            slug: "",
            primaryImage: "",
            images: "",
            purchaseUrl: "",
            displayOrder: "0",
          },
        ],
      },
    });
  };

  const removeSku = (flavorId: string, index: number) => {
    setFormData({
      ...formData,
      skusByFlavor: {
        ...formData.skusByFlavor,
        [flavorId]: formData.skusByFlavor[flavorId].filter((_, i) => i !== index),
      },
    });
  };

  const updateSku = (flavorId: string, index: number, field: keyof SkuData, value: string) => {
    setFormData({
      ...formData,
      skusByFlavor: {
        ...formData.skusByFlavor,
        [flavorId]: formData.skusByFlavor[flavorId].map((sku, i) =>
          i === index ? { ...sku, [field]: value } : sku,
        ),
      },
    });
  };

  const canProceedToStep2 = formData.lineId && formData.packageType;
  const canProceedToStep3 = formData.selectedFlavorIds.length > 0;

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync({
        lineId: formData.lineId,
        packageType: formData.packageType,
        flavors: formData.selectedFlavorIds.map((flavorId) => ({
          lineFlavorId: flavorId,
          skus: (formData.skusByFlavor[flavorId] || []).map((sku) => ({
            name: sku.name,
            size: sku.size,
            servingsPerContainer: sku.servingsPerContainer ? Number(sku.servingsPerContainer) : undefined,
            barcode: sku.barcode || undefined,
            slug: sku.slug,
            primaryImage: sku.primaryImage || undefined,
            images: sku.images ? sku.images.split(",").map((s) => s.trim()) : undefined,
            purchaseUrl: sku.purchaseUrl || undefined,
            displayOrder: Number(sku.displayOrder) || 0,
          })),
        })),
      });

      alert("상품이 등록되었습니다!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("상품 등록에 실패했습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>
        <h1 className="text-3xl font-bold">상품 등록</h1>
        <p className="text-muted-foreground mt-2">
          제품 라인과 맛을 선택하여 상품을 등록합니다.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: 제품 라인 및 패키지 선택</CardTitle>
            <CardDescription>등록할 상품의 제품 라인과 패키지 타입을 선택합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="lineId">제품 라인</Label>
              <Select value={formData.lineId} onValueChange={handleLineChange}>
                <SelectTrigger>
                  <SelectValue placeholder="제품 라인 선택" />
                </SelectTrigger>
                <SelectContent>
                  {productLines?.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      {line.brand?.name} - {line.name} ({line.form === "powder" ? "파우더" : "드링크"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="packageType">패키지 타입</Label>
              <Select
                value={formData.packageType}
                onValueChange={(value: "bulk" | "pouch" | "stick") =>
                  setFormData({ ...formData, packageType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulk">벌크 (대용량)</SelectItem>
                  <SelectItem value="pouch">파우치</SelectItem>
                  <SelectItem value="stick">스틱</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setStep(2)} disabled={!canProceedToStep2}>
              다음 단계
            </Button>
          </CardContent>
        </Card>

        {step >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: 출시할 맛 선택</CardTitle>
              <CardDescription>
                이 패키지에서 출시할 맛을 선택합니다. (여러 개 선택 가능)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {lineFlavors?.map((flavor) => (
                  <div key={flavor.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`flavor-${flavor.id}`}
                      checked={formData.selectedFlavorIds.includes(flavor.id)}
                      onCheckedChange={() => toggleFlavor(flavor.id)}
                    />
                    <Label htmlFor={`flavor-${flavor.id}`} className="cursor-pointer flex-1">
                      {flavor.flavorName}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.selectedFlavorIds.length > 0 && (
                <Button onClick={() => setStep(3)} disabled={!canProceedToStep3}>
                  다음 단계
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {step >= 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: SKU 정보 입력</CardTitle>
              <CardDescription>
                선택한 각 맛별로 SKU (판매 단위) 정보를 입력합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.selectedFlavorIds.map((flavorId) => {
                const flavor = lineFlavors?.find((f) => f.id === flavorId);
                const skus = formData.skusByFlavor[flavorId] || [];

                return (
                  <div key={flavorId} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{flavor?.flavorName}</h3>
                      <Button size="sm" variant="outline" onClick={() => addSku(flavorId)}>
                        <Plus className="w-4 h-4 mr-2" />
                        SKU 추가
                      </Button>
                    </div>
                    <Separator />
                    {skus.map((sku, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">SKU #{index + 1}</span>
                          {skus.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeSku(flavorId, index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <Label>SKU 이름 *</Label>
                            <Input
                              value={sku.name}
                              onChange={(e) => updateSku(flavorId, index, "name", e.target.value)}
                              placeholder="예: 골드 스탠다드 웨이 초콜릿 5LB"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>용량/사이즈 *</Label>
                            <Input
                              value={sku.size}
                              onChange={(e) => updateSku(flavorId, index, "size", e.target.value)}
                              placeholder="예: 5LB, 2.27kg"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>회분 수</Label>
                            <Input
                              type="number"
                              value={sku.servingsPerContainer}
                              onChange={(e) =>
                                updateSku(flavorId, index, "servingsPerContainer", e.target.value)
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>바코드</Label>
                            <Input
                              value={sku.barcode}
                              onChange={(e) =>
                                updateSku(flavorId, index, "barcode", e.target.value)
                              }
                            />
                          </div>
                          <div className="grid gap-2 col-span-2">
                            <Label>Slug (URL용) *</Label>
                            <Input
                              value={sku.slug}
                              onChange={(e) => updateSku(flavorId, index, "slug", e.target.value)}
                              placeholder="예: gold-standard-whey-chocolate-5lb"
                            />
                          </div>
                          <div className="grid gap-2 col-span-2">
                            <Label>대표 이미지</Label>
                            <ImageUpload
                              value={sku.primaryImage}
                              onChange={(url) => updateSku(flavorId, index, "primaryImage", url || "")}
                              slug={sku.slug || "temp"}
                              imageType="primary"
                              disabled={!sku.slug}
                            />
                            {!sku.slug && (
                              <p className="text-xs text-muted-foreground">
                                Slug를 먼저 입력해주세요
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2 col-span-2">
                            <Label>추가 이미지</Label>
                            <MultiImageUpload
                              value={sku.images}
                              onChange={(urls) => updateSku(flavorId, index, "images", urls)}
                              slug={sku.slug || "temp"}
                              disabled={!sku.slug}
                            />
                            {!sku.slug && (
                              <p className="text-xs text-muted-foreground">
                                Slug를 먼저 입력해주세요
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label>구매 링크</Label>
                            <Input
                              value={sku.purchaseUrl}
                              onChange={(e) =>
                                updateSku(flavorId, index, "purchaseUrl", e.target.value)
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>노출 순서</Label>
                            <Input
                              type="number"
                              value={sku.displayOrder}
                              onChange={(e) =>
                                updateSku(flavorId, index, "displayOrder", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.back()}>
                  취소
                </Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "등록 중..." : "상품 등록"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}