"use client";
import { Menu} from "lucide-react";


import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";

import Sidebar from "@/components/sidebar";

const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
           </Button>
           </SheetTrigger>
           <SheetContent side = "left" className=" bg-gray-800 text-white p-0 ">
           <SheetTitle></SheetTitle>
            <Sidebar />
           </SheetContent>
        </Sheet>

    );
};
export default MobileSidebar;