"use client";

import { Card, CardContent } from "./ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useFreeCounter } from "@/app/context/FreeCounterContext";
import { useProModal } from "@/hooks/use-pro-modal";


export const FreeCounter = ({
 
} ) => {
  const { freeCounter, refreshFreeCounter } = useFreeCounter();
  const proModal = useProModal();

  

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>Free Generations</p>
            <p>
              {freeCounter} / 5
            </p>
            <Progress value={(freeCounter || 0) / 5 * 100} />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-colors duration-300 " 
            onClick={proModal.onOpen}
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
