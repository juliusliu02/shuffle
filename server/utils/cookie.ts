import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export const SESSION_COOKIE_NAME = "auth_session";

export const getSessionCookie = async (
  c: Context,
): Promise<string | undefined> => {
  return getCookie(c, SESSION_COOKIE_NAME);
};

export const setSessionCookie = (
  c: Context,
  token: string,
  expiresAt: Date,
): void => {
  setCookie(c, SESSION_COOKIE_NAME, token, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiresAt,
    sameSite: "lax",
  });
};

export const deleteSessionCookie = (c: Context): void => {
  deleteCookie(c, SESSION_COOKIE_NAME);
};
