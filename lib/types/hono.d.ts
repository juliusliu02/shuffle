import { User } from "@/lib/types/index";
declare module "hono" {
  interface ContextVariableMap {
    user: User | null;
  }
}
