import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProductSku,
  getLineFlavorsByLineId,
  getProductSkus,
  toggleSkuAvailability,
  type CreateProductInput,
} from "./queries";

export function useLineFlavorsByLineId(lineId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "line-flavors-by-line", lineId],
    queryFn: () => (lineId ? getLineFlavorsByLineId(lineId) : Promise.resolve([])),
    enabled: !!lineId,
  });
}

export function useProductSkus() {
  return useQuery({
    queryKey: ["admin", "product-skus"],
    queryFn: () => getProductSkus(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "product-skus"] });
    },
  });
}

export function useToggleSkuAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      toggleSkuAvailability(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "product-skus"] });
    },
  });
}

export function useDeleteProductSku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductSku(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "product-skus"] });
    },
  });
}