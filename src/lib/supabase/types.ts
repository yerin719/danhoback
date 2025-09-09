import type { Database as SupabaseDatabase, Tables } from "database.types";
import type { MergeDeep, SetNonNullable } from "type-fest";

// 커스텀 타입 정의 (공통)
export type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        products_with_details: {
          Row: SetNonNullable<Tables<"products_with_details">>;
        };
        product_filter_options: {
          Row: SetNonNullable<Tables<"product_filter_options">>;
        };
      };
    };
  }
>;