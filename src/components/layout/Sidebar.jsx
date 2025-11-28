import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Users, FolderKanban, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/dashboard/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/dashboard/projects",
    label: "Projects",
    icon: FolderKanban,
  },
];

function NavLink({ to, label, icon: Icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      activeProps={{
        className:
          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
      }}
      activeOptions={{ exact: to === "/dashboard" }}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    auth.logout();
    router.navigate({ to: "/login" });
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">Dashboard</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
