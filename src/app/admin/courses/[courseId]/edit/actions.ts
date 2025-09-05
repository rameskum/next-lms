"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
    chapterSchema,
    ChapterSchemaType,
    courseSchema,
    CourseSchemaType,
    lessonSchema,
    LessonSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export async function editCourse(courseId: string, data: CourseSchemaType): Promise<ApiResponse> {
    const user = await requireAdmin();
    try {
        const result = courseSchema.safeParse(data);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id,
            },
            data: {
                ...result.data,
            },
        });

        return {
            status: "success",
            message: "Course updated successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to update course",
        };
    }
}

export async function reorderLessons(
    chapterId: string,
    lessons: {
        id: string;
        position: number;
    }[],
    courseId: string
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons to reorder",
            };
        }

        const updates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: { id: lesson.id, chapterId: chapterId },
                data: { position: lesson.position },
            })
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to reorder lessons",
        };
    }
}

export async function reorderChapters(
    courseId: string,
    chapters: {
        id: string;
        position: number;
    }[]
): Promise<ApiResponse> {
    await requireAdmin();
    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters to reorder",
            };
        }

        const updates = chapters.map((chapter) =>
            prisma.chapter.update({
                where: { id: chapter.id, courseId: courseId },
                data: { position: chapter.position },
            })
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapters reordered successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to reorder chapters",
        };
    }
}

export async function createChapter(values: ChapterSchemaType): Promise<ApiResponse> {
    try {
        await requireAdmin();
        const result = chapterSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data",
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPosition = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                },
            });

            await tx.chapter.create({
                data: {
                    title: result.data.name,
                    position: (maxPosition?.position ?? 0) + 1,
                    courseId: result.data.courseId,
                },
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Chapter created successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to create chapter",
        };
    }
}

export async function createLesson(values: LessonSchemaType): Promise<ApiResponse> {
    try {
        await requireAdmin();
        const result = lessonSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data",
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPosition = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                },
            });

            await tx.lesson.create({
                data: {
                    title: result.data.name,
                    description: result.data.description,
                    thumbnailKey: result.data.thumbnailKey,
                    videoKey: result.data.videoKey,
                    position: (maxPosition?.position ?? 0) + 1,
                    chapterId: result.data.chapterId,
                },
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Lesson created successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to create lesson",
        };
    }
}
