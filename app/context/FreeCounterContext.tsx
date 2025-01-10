"use client";

import { createContext, useContext, useState, useCallback , useEffect} from "react";
import axios from "axios";

export interface FreeCounterContextType {
  freeCounter: number | null;
  refreshFreeCounter: () => void;
  isPro: boolean | null
}

const FreeCounterContext = createContext<FreeCounterContextType | undefined>(
  undefined
);

export const FreeCounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [freeCounter, setFreeCounter] = useState<number | null>(null);
  const [isPro, setIsPro] = useState<boolean | null>(null);

  // Define the refreshFreeCounter function
  const refreshFreeCounter = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/get-api-limit");
      setFreeCounter(data.count);
      const subscriptionResponse = await axios.get("/api/check-subscription");
      setIsPro(subscriptionResponse.data.isPro);
    } catch (error) {

      console.error("Error refreshing free counter:", error);
    }
  }, []);
  

  // Fetch initial value when the provider mounts
  useEffect(() => {
    refreshFreeCounter();
  }, [refreshFreeCounter]);

  return (
    <FreeCounterContext.Provider value={{ freeCounter, refreshFreeCounter , isPro}}>
      {children}
    </FreeCounterContext.Provider>
  );
};

export const useFreeCounter = () => {
  const context = useContext(FreeCounterContext);
  if (!context) {
    throw new Error("useFreeCounter must be used within a FreeCounterProvider");
  }
  return context;
};
