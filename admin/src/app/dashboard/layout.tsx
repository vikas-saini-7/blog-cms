import { AppSidebar } from "@/components/common/AppSidebar";
import DashboardHeader from "@/components/common/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import GlobalProvider from "@/providers/GlobalProviders";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <DashboardHeader />
          {children}
        </main>
      </SidebarProvider>
    </GlobalProvider>
  );
}
