"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
    const router = useRouter();

    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch, //refetch the session
    } = authClient.useSession();

    async function signout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("Successfully signed out!");
                },
            },
        });
    }

    return (
        <div className="p-4 pt-2">
            <ModeToggle />
            {session ? (
                <div>
                    <p>{session.user.name}</p>
                    <Button onClick={signout}>Logout</Button>
                </div>
            ) : (
                <Button>Login</Button>
            )}
        </div>
    );
}
