"use client";

import { Heading } from "@/components/heading";
import { Settings } from "lucide-react";
import { useSubscription } from "@/app/context/SubscriptionContext"; // Import the hook
import {SubscriptionButton } from "@/components/subscription-button";

const SettingsPage = () => {
  const { isPro } = useSubscription(); // Access subscription context

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro === null
            ? "Loading your subscription status..."
            : isPro
            ? "You are currently on a pro plan."
            : "You are currently on a free plan."}
        </div>
       <SubscriptionButton isPro ={isPro ?? false} />
      </div>
    </div>
  );
};

export default SettingsPage;
