import { hc } from "hono/client";
import { AppType } from "@/app/api/auth/[[...route]]/route";

export const authClient = hc<AppType>(`/api/auth`);
