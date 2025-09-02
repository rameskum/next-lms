"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
    const router = useRouter();

    const handleSignout = async function signout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("Successfully signed out!");
                },
                onError: () => {
                    toast.error("Failed to sign out.");
                },
            },
        });
    };

    return handleSignout;
}
