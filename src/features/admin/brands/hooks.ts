import { useQuery } from "@tanstack/react-query";
import { getBrands } from "./queries";

export function useBrands() {
  return useQuery({
    queryKey: ["admin", "brands"],
    queryFn: () => getBrands(),
  });
}