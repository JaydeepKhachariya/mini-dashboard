import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { auth } from "../auth";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const router = useRouter();

  useEffect(() => {
    // Simulate a brief loading period to show the loader
    const timer = setTimeout(() => {
      if (auth.isAuthenticated) {
        router.navigate({ to: "/dashboard" });
      } else {
        router.navigate({ to: "/login" });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>

        {/* Loading Text */}
        <p className="text-lg font-medium text-slate-700">Loading...</p>
        <p className="text-sm text-slate-500 mt-2">Checking authentication</p>
      </div>
    </div>
  );
}
