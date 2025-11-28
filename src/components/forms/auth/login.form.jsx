import { z } from "zod";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Info } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import { toast } from "sonner";

const loginFormSchema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(6).max(100),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values) {
    console.log(values);

    // Validate credentials
    if (values.username === "admin" && values.password === "password") {
      toast("Logged in successfully");
      // Set authentication in localStorage
      auth.login();

      // Navigate to dashboard
      router.navigate({ to: "/dashboard" });
    } else {
      // Show error message
      toast("Invalid credentials");
    }

    // Prevent form submission
    return Promise.resolve();
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border rounded-lg shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Login</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-11 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute bg-transparent right-3 top-1/2 -translate-y-1/2 "
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11 text-base font-medium">
              Sign in
            </Button>
          </form>
        </Form>

        <div className="mt-6 bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Demo Credentials
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium min-w-[80px]">
                    Username:
                  </span>
                  <code className="bg-background px-2 py-1 rounded text-foreground font-mono text-xs">
                    admin
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium min-w-[80px]">
                    Password:
                  </span>
                  <code className="bg-background px-2 py-1 rounded text-foreground font-mono text-xs">
                    password
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
