import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import {Stripe} from "stripe";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check for an existing subscription in the database
        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId: userId,
            },
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            // Redirect existing user to Stripe billing portal
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return NextResponse.json({ url: stripeSession.url });

        }


        // If no subscription exists, create a new Stripe checkout session
        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
            throw new Error("User email is not available");
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Synth Pro",
                            description: "Unlimited AI Generations",
                        },
                        unit_amount: 2000, // $20 per month
                        recurring: { interval: "month" },
                    },
                    quantity: 1,
                },
            ],
            metadata: { userId },
        });

        // Redirect new user to Stripe checkout page
        return NextResponse.json({ url: stripeSession.url });
    } catch (error: unknown) {
        if (error instanceof Stripe.errors.StripeError) {
          // Specific handling for Stripe errors
          console.error("[STRIPE_GET_ERROR]", error.message);
        } else if (error instanceof Error) {
          // General error handling
          console.error("[GENERAL_ERROR]", error.message);
        } else {
          // Handle unknown error types
          console.error("[UNKNOWN_ERROR]", error);
        }
      
        return new NextResponse("Internal error", { status: 500 });
      }
}
