import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLineFlavor,
  deleteLineFlavor,
  getLineFlavors,
  getProteinTypes,
  type CreateLineFlavorInput,
} from "./queries";

export function useLineFlavors() {
  return useQuery({
    queryKey: ["admin", "line-flavors"],
    queryFn: () => getLineFlavors(),
  });
}

export function useProteinTypes() {
  return useQuery({
    queryKey: ["admin", "protein-types"],
    queryFn: () => getProteinTypes(),
  });
}

export function useCreateLineFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLineFlavorInput) => createLineFlavor(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "line-flavors"] });
    },
  });
}

export function useDeleteLineFlavor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLineFlavor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "line-flavors"] });
    },
  });
}