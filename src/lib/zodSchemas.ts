import { description } from "@/components/sidebar/chart-area-interactive";
import z from "zod";

export const courseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const courseCategories = [
    "Development",
    "Business",
    "Finance",
    "IT & Software",
    "Office Productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "Lifestyle",
    "Photography",
    "Health & Fitness",
    "Music",
    "Teaching & Academics",
] as const;

export const courseSchema = z.object({
    title: z
        .string({
            error: "Course title is required.",
        })
        .min(3, { error: "Title must be at least 3 characters long." })
        .max(100, { error: "Title must be at most 100 characters long." }),
    description: z
        .string({
            error: "Description is required.",
        })
        .min(3, { error: "Description must be at least 3 characters long." }),
    smallDescription: z
        .string({
            error: "Short description is required.",
        })
        .min(3, { error: "Short description must be at least 3 characters long." })
        .max(200, { error: "Short description must be at most 200 characters long." }),
    slug: z
        .string({
            error: "Slug is required.",
        })
        .min(3, { error: "Slug must be at least 3 characters long." })
        .max(100, { error: "Slug must be at most 100 characters long." }),
    fileKey: z
        .string({
            error: "File key is required.",
        })
        .min(1, { error: "File key must not be empty." }),
    price: z.coerce
        .number({
            error: "Price is required.",
        })
        .min(1, { error: "Price must be at least 1." }),
    duration: z.coerce
        .number({
            error: "Duration is required.",
        })
        .min(1, { error: "Duration must be at least 1." })
        .max(500, { error: "Duration must be at most 500." }),
    level: z.enum(courseLevels).refine((val) => courseLevels.includes(val), {
        error: `Course level must be one of: ${courseLevels}.`,
    }),
    category: z.enum(courseCategories, {
        error: "Category is required.",
    }),
    status: z.enum(courseStatus).refine((val) => courseStatus.includes(val), {
        error: `Status must be one of: ${courseStatus}`,
    }),
});

export const chapterSchema = z.object({
    name: z.string().min(3),
    courseId: z.cuid2(),
});

export const lessonSchema = z.object({
    name: z.string().min(3),
    courseId: z.cuid2(),
    chapterId: z.cuid2(),
    description: z.string().min(3).optional(),
    thumbnailKey: z.string().min(3).optional(),
    videoKey: z.string().min(3).optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
