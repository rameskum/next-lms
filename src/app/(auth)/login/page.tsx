import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon } from "lucide-react";
import React from "react";

export default function LoginPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome Back</CardTitle>
                <CardDescription>Login with the below providers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" variant="outline">
                    <GithubIcon className="size-4" />
                    Sign in with Github
                </Button>
            </CardContent>
        </Card>
    );
}
