import { useState } from "react";

import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import axios from "axios";


interface SubscriptionButtonProps {
    isPro: boolean
};

export const SubscriptionButton= ({
    isPro = false
}: SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false);

    const onClick = async() => {
        try{
            setLoading(true);
            const reposnse = await axios.get("/api/stripe");
            window.location.href = reposnse.data.url
        } catch (error: unknown) {
            if (error instanceof Error) {
              console.error("STRIPE_CLIENT_ERROR:", error.message);
            } else {
              console.error("STRIPE_CLIENT_ERROR: Unknown error occurred");
            }
          } finally {
            setLoading(false);
        }
    }
    return (
        <Button  disabled={loading} onClick={onClick} variant = {isPro ? "default" : "premium"}>
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    )
};
