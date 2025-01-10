"use server";

import { and, count, eq } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";

import { isProduction } from "@/lib/constants";
import { db, first } from ".";
import * as schema from "../drizzle/schema";

/*
 * Find teacher by userId, returns teacher model
 */
export const findTeacher = async (userId: string) => {
  return first(
    await db
      .select()
      .from(schema.teachers)
      .where(
        and(
          eq(schema.teachers.id, userId),
          eq(schema.teachers.isApproved, true)
        )
      )
  );
};

/*
 * Find teacher by classId, returns user model
 */
export const findTeacherByClass = memoize(
  async (classId: string) => {
    const records = await db
      .select()
      .from(schema.users)
      .innerJoin(schema.teachers, eq(schema.users.id, schema.teachers.id))
      .where(
        and(
          eq(schema.teachers.classId, classId),
          eq(schema.teachers.isPrimary, true)
        )
      );

    return first(records)?.users;
  },
  {
    persist: true,
    duration: 5 * 60,
    revalidateTags: (classId) => ["find-teacher-by-class", classId],
    log: isProduction ? [] : ["dedupe", "datacache", "verbose"],
    logid: "Find teacher by class",
  }
);

/**
 * Get students by classId, alongside with their summary count
 */
export const getStudents = memoize(
  async (classId: string) => {
    return await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        pageSlug: schema.users.pageSlug,
        createdAt: schema.users.createdAt,
        summaryCount: count(),
      })
      .from(schema.users)
      .where(eq(schema.users.classId, classId))
      .leftJoin(schema.summaries, eq(schema.summaries.userId, schema.users.id))
      .groupBy(schema.users.id)
      .orderBy(schema.users.id);
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: (classId) => ["get-students", classId],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get students for class",
  }
);

/*
 * Count students by classId
 **/
export const countStudents = memoize(
  async (classId: string) => {
    return await db.$count(schema.users, eq(schema.users.classId, classId));
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: (classId) => ["count-student", classId],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Count student",
  }
);
