import { count, and, eq, gt, desc, InferInsertModel } from "drizzle-orm";
import { db } from "@/db/index";
import { generations } from "@/db/schema";

// This file contains utility functions for generating timestamps and other time-related values.
// These functions are used in the generations table to track when generations were created and to perform time-based queries.
// The functions in this file are designed to work with UTC time to ensure consistency across different time zones.
// The functions in this file are used in the generations table to track when generations were created and to perform time-based queries.

export function utcMonthStart() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0),
  );
}

export async function countGenerationsSince(clerkUserId: string, since: Date) {
  const [row] = await db
    .select({ c: count() })
    .from(generations)
    .where(
      and(
        eq(generations.clerkUserId, clerkUserId),
        gt(generations.createdAt, since),
      ),
    );
  return row.c;
}

export async function listUserGenerationSummaries(clerkUserId: string) {
  return await db
    .select()
    .from(generations)
    .where(eq(generations.clerkUserId, clerkUserId))
    .orderBy(desc(generations.createdAt));
}

type InsertGenerationInput = Omit<
  InferInsertModel<typeof generations>,
  "id" | "createdAt"
>;

export async function createGeneration(input: InsertGenerationInput) {
  const [row] = await db.insert(generations).values(input).returning();
  return row;
}
