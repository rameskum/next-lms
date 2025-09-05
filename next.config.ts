import { env } from "@/lib/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: `${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev`,
                protocol: "https",
            },
        ],
    },
};

export default nextConfig;
