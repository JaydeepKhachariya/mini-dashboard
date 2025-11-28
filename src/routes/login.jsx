import { createFileRoute, redirect } from "@tanstack/react-router";
import { auth } from "../auth";
import LoginForm from "@/components/forms/auth/login.form";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (auth.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <LoginForm />
    </div>
  );
}
