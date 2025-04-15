import type { Session, User } from "@/lib/types";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { sessionsTable, usersTable } from "@/server/db/schema/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import * as argon2 from "@node-rs/argon2";

/* Password authentication */
export async function createUser(
  username: string,
  fullName: string,
  password: string,
): Promise<User> {
  const hashedPassword = await argon2.hash(password);
  const result = await db
    .insert(usersTable)
    .values({
      username,
      fullName,
      hashedPassword,
    })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      fullName: usersTable.fullName,
    });
  return result[0];
}

export async function validateUser(
  username: string,
  password: string,
): Promise<User | null> {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if (result.length === 0) return null;

  const { hashedPassword, ...user } = result[0];
  if (!(await argon2.verify(hashedPassword, password))) {
    return null;
  }
  return user;
}

/* Session */

export function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(
  token: string,
  userId: number,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 3600 * 60 * 60 * 1000),
  };
  await db.insert(sessionsTable).values(session);
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({
      user: {
        id: usersTable.id,
        username: usersTable.username,
        fullName: usersTable.fullName,
      },
      session: sessionsTable,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.id, sessionId));
  // invalid session id
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  // session expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
    return { session: null, user: null };
  }
  // extends session
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionsTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionsTable.id, sessionId));
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export async function invalidateAllSessions(userId: number): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
