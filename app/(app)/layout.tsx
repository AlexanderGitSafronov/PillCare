import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 lg:px-8 pt-6 pb-safe lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
