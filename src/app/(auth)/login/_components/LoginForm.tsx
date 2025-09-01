"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader2 } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";

export function LoginForm() {
    const [githubPending, startGithubTransition] = useTransition();

    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Successfully signed in!");
                    },
                    onError: (error) => {
                        toast.error("Internal Server Error.");
                    },
                },
            });
        });
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome Back</CardTitle>
                <CardDescription>Login with the below providers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button disabled={githubPending} onClick={signInWithGithub} className="w-full" variant="outline">
                    {githubPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" /> <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <GithubIcon className="size-4" />
                            Sign in with Github
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
