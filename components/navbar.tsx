"use client";

import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  )
}
const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex w-full justify-end">
            <header>
             <UserButton>
               <UserButton.MenuItems>
          <UserButton.Link
            label="Create organization"
            labelIcon={<DotIcon />}
            href="/create-organization"
          />
               </UserButton.MenuItems>
              </UserButton>
             </header>
            </div>
        </div>
    );
};
export default Navbar;