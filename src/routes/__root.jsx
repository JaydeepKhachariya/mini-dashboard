import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { auth } from "../auth";
import "../index.css";

export const Route = createRootRoute({
  context: () => ({
    auth,
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="h-dvh w-screen">
      <Outlet />
    </div>
  );
}
