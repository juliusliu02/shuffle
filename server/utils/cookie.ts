import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export const getSessionCookie = async (
  c: Context,
): Promise<string | undefined> => {
  return getCookie(c, "auth_session");
};

export const setSessionCookie = (
  c: Context,
  token: string,
  expiresAt: Date,
): void => {
  setCookie(c, "auth_session", token, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiresAt,
    sameSite: "lax",
  });
};

export const deleteSessionCookie = (c: Context): void => {
  deleteCookie(c, "auth_session");
};
