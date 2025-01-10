

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
 import { FreeCounterProvider } from "@/app/context/FreeCounterContext";




const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    

  // Fetch the API limit on mount
 

  return (
    <FreeCounterProvider>
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0  bg-gray-900">
        {/* Pass `apiLimitCount` to Sidebar */}
        <Sidebar/>
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
    </FreeCounterProvider>
  );
};

export default DashboardLayout;
