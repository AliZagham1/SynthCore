"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

// Define the shape of the context
export interface SubscriptionContextType {
  isPro: boolean | null; // Whether the user is on a pro plan
  refreshSubscription: () => void; // Function to refresh subscription status
}

// Create the context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Create the provider
export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  // Function to refresh subscription status by calling the API
  const refreshSubscription = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/check-subscription"); // Replace with your API endpoint
      setIsPro(data.isPro); // Set the subscription status in state
    } catch (error) {
      console.error("Error refreshing subscription status:", error);
      setIsPro(false); // Set default to false if an error occurs
    }
  }, []);

  // Fetch the subscription status when the provider mounts
  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <SubscriptionContext.Provider value={{ isPro, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use the context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
