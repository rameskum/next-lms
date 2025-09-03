"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

export async function createCourse(values: CourseSchemaType): Promise<ApiResponse> {
    const session = await requireAdmin();

    try {
        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data",
            };
        }

        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            },
        });

        return {
            status: "success",
            message: "Course created successfully",
        };
    } catch {
        return {
            status: "error",
            message: "Failed to create course",
        };
    }
}
