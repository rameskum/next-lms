import { requireAdmin } from "@/app/data/admin/require-admin";
import { env } from "@/lib/env";
import { s3 } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createId } from "@paralleldrive/cuid2";
import { NextResponse } from "next/server";
import { z } from "zod";

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, { error: "File name is required" }),
    contentType: z.string().min(1, { error: "Content type is required" }),
    size: z.number().min(1, { error: "Size is required." }),
    isImage: z.boolean(),
});

export async function POST(request: Request) {
    await requireAdmin();
    try {
        const body = await request.json();
        const validation = fileUploadSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Invalid Request Body",
                },
                { status: 400 }
            );
        }
        const { fileName, contentType, size } = validation.data;
        const uniqueFileName = `${createId()}_${fileName}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueFileName,
        });

        const presignedUrl = await getSignedUrl(s3, command, {
            expiresIn: 360, // url expires in 6 mins
        });

        const response = {
            presignedUrl,
            key: uniqueFileName,
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to generate presigned url",
            },
            {
                status: 500,
            }
        );
    }
}
