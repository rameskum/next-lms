import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/../public/logo.svg";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link className="flex items-center gap-2 self-center font-medium" href="/">
                    <Image src={Logo} alt="Logo" width={32} height={32} />
                    RDL UI
                </Link>
                {children}
            </div>
        </div>
    );
}
