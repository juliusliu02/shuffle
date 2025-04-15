import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

export const appClient = hc<AppType>(`/api`);
