import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "../auth";
import Sidebar from "@/components/layout/Sidebar";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
