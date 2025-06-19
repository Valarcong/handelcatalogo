
import React from "react";
import VentasSidebar from "./VentasSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface VentasLayoutProps {
  children: React.ReactNode;
}

const VentasLayout: React.FC<VentasLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {!isMobile && <VentasSidebar />}
        <main className="flex-1 min-w-0 px-4 py-8">
          {isMobile && (
            <div className="mb-4 flex items-center justify-between">
              <SidebarTrigger />
              <span className="text-xs text-muted-foreground">Menú</span>
            </div>
          )}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default VentasLayout;
