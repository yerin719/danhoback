import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductLine,
  deleteProductLine,
  getProductLines,
  type CreateProductLineInput,
} from "./queries";

export function useProductLines() {
  return useQuery({
    queryKey: ["admin", "product-lines"],
    queryFn: () => getProductLines(),
  });
}

export function useCreateProductLine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductLineInput) => createProductLine(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "product-lines"] });
    },
  });
}

export function useDeleteProductLine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductLine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "product-lines"] });
    },
  });
}