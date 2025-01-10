"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";



const font = Montserrat({
    weight: "600",
    subsets: ["latin"],
});

const LandingNavbar = () => {   
    const { isSignedIn } = useAuth();
    return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                <div className="px2  relative w-8 h-8 mr-4">
                    <Image src="/logo.png" alt="logo" fill />
                </div>
                <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                    SynthCore
                </h1>
            </Link>
            <div className="flex items-center gap-x-2">
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="hidden md:block text-sm bg-white text-black px-4 py-2 rounded-full">
                    Get Started
                </Link>
            </div>
        </nav>
    );
};

export default LandingNavbar;