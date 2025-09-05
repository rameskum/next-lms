"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
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
