"use client";

import { ArrowRight, Code, ImageIcon, MessageSquare, MusicIcon, VideoIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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
  href: "/music",
},
{
  label: "Image Generation",
  icon: ImageIcon,
  bgColor: "bg-pink-700/10",
  color: "pink-700",
  href: "/image",
},
{
  label: "Video Generation",
  icon: VideoIcon,
  bgColor: "bg-orange-700/10",
  color: "orange-700",
  href: "/video",
},
{
  label: "Code Generation",
  icon: Code,
  bgColor: "bg-orange-green/10",
  color: "green-700",
  href: "/code",
}]



const  DashboardPage = () => {
  const router = useRouter();
    return (
     
    <div>
       <div className="mb-8 space-y-4">
        <h2 className = "text-2xl md:text-4xl font-bold text-center">Explore the Power of AI</h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg  text-center">Communicate with AI like never before</p>
       </div>
       <div className="px-4 md:px-20 lg:px-32">
         {tools.map((tool) => (
           <Card
           onClick={() => router.push(tool.href)}
           key = {tool.label}
           className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
           >
            <div className="flex items-center gap-x-4">
              <div className = {cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />

              </div>
              <div className="font-semibold">
              {tool.label}
            </div>
            </div>
            <ArrowRight className="w-5 h-5" />
           </Card>
         ))}
       </div>
       
    </div>

    );
    }

    export default DashboardPage;