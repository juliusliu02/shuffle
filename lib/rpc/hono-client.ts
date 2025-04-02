import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = hc<AppType>('');
export type Client = typeof client

// Reference: https://hono.dev/docs/guides/rpc#compile-your-code-before-using-it-recommended
export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args)
export const honoClient = hcWithType(baseUrl);
