import { useQuery } from "@tanstack/react-query";
import {
  getFlavorOptions,
  getProteinTypes,
  getProductForms,
  getPackageTypes,
  getBrands,
} from "@/features/products/queries";

export function useFlavorOptions() {
  return useQuery({
    queryKey: ["filters", "flavors"],
    queryFn: getFlavorOptions,
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
  });
}

export function useProteinTypes() {
  return useQuery({
    queryKey: ["filters", "proteinTypes"],
    queryFn: getProteinTypes,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useProductForms() {
  return useQuery({
    queryKey: ["filters", "forms"],
    queryFn: getProductForms,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function usePackageTypes() {
  return useQuery({
    queryKey: ["filters", "packageTypes"],
    queryFn: getPackageTypes,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["filters", "brands"],
    queryFn: getBrands,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

// 모든 필터 옵션을 한 번에 가져오는 훅
export function useAllFilterOptions() {
  const flavors = useFlavorOptions();
  const proteinTypes = useProteinTypes();
  const forms = useProductForms();
  const packageTypes = usePackageTypes();
  const brands = useBrands();

  return {
    flavors,
    proteinTypes,
    forms,
    packageTypes,
    brands,
    isLoading:
      flavors.isLoading ||
      proteinTypes.isLoading ||
      forms.isLoading ||
      packageTypes.isLoading ||
      brands.isLoading,
    isError:
      flavors.isError ||
      proteinTypes.isError ||
      forms.isError ||
      packageTypes.isError ||
      brands.isError,
  };
}