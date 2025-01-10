import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const DAY_IN_MS = 86_400_000;

export async function GET() {
    try {
        // Retrieve user ID from Clerk's authentication
        const { userId } =await auth();

        if (!userId) {
            return NextResponse.json({ isPro: false }, { status: 401 }); // Unauthenticated
        }

        // Query the database for the user's subscription
        const userSubscription = await prismadb.userSubscription.findUnique({
            where: { userId },
            select: {
                stripeSubscriptionId: true,
                stripePriceId: true,
                stripeCurrentPeriodEnd: true,
            },
        });

        if (!userSubscription) {
            return NextResponse.json({ isPro: false }, { status: 200 });
        }

        // Validate subscription
        const isValid =
            userSubscription.stripePriceId &&
            userSubscription.stripeCurrentPeriodEnd!.getTime() + DAY_IN_MS > Date.now();

        return NextResponse.json({ isPro: !!isValid }, { status: 200 });
    } catch (error) {
        console.error("Error checking subscription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
