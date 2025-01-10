
"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowRight, Code, ImageIcon, MessageSquare, MusicIcon, VideoIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { set } from "zod";

export const ProModal = () => {
  const ProModal = useProModal();
  const [loading, setLoading] = useState(false);

  const   onSubscribe = async () => {
    try{
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error){
      toast.error("Oops! Something went wrong");

    } finally {
      setLoading(false);
    }
  }
    
    const tools = [
        {
          label: "Conversation",
          icon: MessageSquare,
          bgColor: "bg-purple-500/10",
          color: "purple",
          href: "/conversation",
      },
      {
        label: "Music Generation",
        icon: MusicIcon,
        bgColor: "bg-emerald-500/10",
        color: "emerald-500",
       
      },
      {
        label: "Image Generation",
        icon: ImageIcon,
        bgColor: "bg-pink-700/10",
        color: "pink-700",
      
      },
      {
        label: "Video Generation",
        icon: VideoIcon,
        bgColor: "bg-orange-700/10",
        color: "orange-700",
        
      },
      {
        label: "Code Generation",
        icon: Code,
        bgColor: "bg-orange-green-700/10",
        color: "green-700",
      
      }]
      
      
      
    return (
        <Dialog open={ProModal.isOpen} onOpenChange={ProModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold text-lg py-1">
                        Upgrade for Unlimited Usage
                         <Badge variant = "premium" className=" uppercase  text-sm py-1" >
                            Pro

                         </Badge>
                        </div>
                        </DialogTitle>
                        <div className="text-center pt-2 space-y-2 text-zinc-900 font-medium ">
                            {tools.map((tool) => (
                                <Card
                                key = {tool.label}
                                className="p-3 border-black/5 flex justify-between items-center  hover:shadow-md transition cursor-pointer"
                                >
                                 <div className="flex items-center gap-x-4">
                                   <div className = {cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                     <tool.icon className={cn("w-6 h-6", tool.color)} />
   
                                   </div>
                                   <div className="font-semibold text-sm">
                                   {tool.label}
                                 </div>
                                 </div>
                                  <Check className = "w-5 h-5" />
                                </Card>
                              ))}

                        </div>

                </DialogHeader>
                <DialogFooter>
                    <Button  disabled={loading} onClick={onSubscribe} className="w-full  " variant="premium" size="lg">
                        Upgrade

                        <Zap className = "w-4 h-4 ml-2 fill-white"/>
                    </Button>
                    

                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}