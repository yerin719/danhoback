import { createClient } from "@supabase/supabase-js";
import type { MergeDeep, SetNonNullable } from "type-fest";
import type { Database as SupabaseDatabase, Tables } from "database.types";

type Database = MergeDeep<
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

const client = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default client;
