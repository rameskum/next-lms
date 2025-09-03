import { requireAdmin } from "@/app/data/admin/require-admin";
import { env } from "@/lib/env";
import { s3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const session = await requireAdmin();
    try {
        const body = await request.json();
        const key = body.key;

        if (!key) {
            return NextResponse.json(
                {
                    error: "Missing or invalid object key",
                },
                {
                    status: 400,
                }
            );
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        });

        await s3.send(command);

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}
