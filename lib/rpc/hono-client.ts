import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const honoClient = hc<AppType>(`${baseUrl}/api`);
