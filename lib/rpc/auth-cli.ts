import { hc } from "hono/client";
import { type AppType } from "@/app/api/auth/[[...route]]/route";

export const authClient = hc<AppType>(`/api/auth`);
