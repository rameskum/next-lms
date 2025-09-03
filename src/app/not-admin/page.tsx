import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon, ShieldXIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotAdmin() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 mx-auto w-fit rounded-full p-4">
                        <ShieldXIcon className="siz-16 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Access Restricted</CardTitle>
                    <CardDescription className="mx-auto max-w-sm">
                        Hey! You are not an admin, which means you&apos;t preform this action.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link
                        href="/"
                        className={buttonVariants({
                            className: "w-full",
                        })}
                    >
                        <ArrowLeftIcon className="mr-1 size-4" />
                        Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
