"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trees } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/schemas";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  async function handleSubmit(values: LoginValues) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to login");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative hidden overflow-hidden bg-forest-900 px-14 py-16 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,183,106,0.38),transparent_22rem),radial-gradient(circle_at_bottom_right,rgba(74,158,74,0.24),transparent_26rem)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-khaki text-forest-900">
              <Trees className="h-7 w-7" />
            </div>
            <div>
              <p className="font-serif text-4xl">Forest eOffice</p>
              <p className="text-sm uppercase tracking-[0.24em] text-white/60">Productivity Monitoring System</p>
            </div>
          </div>

          <div className="max-w-xl">
            <h1 className="font-serif text-6xl leading-none text-white">Government-grade visibility into file movement, delays, and officer performance.</h1>
            <p className="mt-6 text-lg leading-8 text-white/72">
              Track file disposal, surface overdue risk, compare section performance, and generate concise management summaries from a single self-contained dashboard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["CSV-native", "No database dependency"],
              ["Role-aware", "Separate admin and employee views"],
              ["AI-enabled", "Summaries and natural language analytics"]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-white/62">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-10 md:px-8">
        <Card className="w-full max-w-xl bg-white/90 p-7 md:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-forest-700/70">Secure access</p>
            <h2 className="mt-2 text-4xl">Sign in to the monitoring desk</h2>
            <p className="mt-3 text-sm leading-6 text-forest-900/65">
              Use your departmental credentials. For the bootstrap dataset, sample users can log in with password <span className="font-mono">forest@123</span>.
            </p>
          </div>

          <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium">Username</label>
              <Input
                placeholder="admin or ramesh"
                autoComplete="username"
                aria-invalid={form.formState.errors.username ? "true" : "false"}
                {...form.register("username")}
              />
              {form.formState.errors.username ? (
                <p className="mt-2 text-sm text-red-600">{form.formState.errors.username.message}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={form.formState.errors.password ? "true" : "false"}
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="mt-2 text-sm text-red-600">{form.formState.errors.password.message}</p>
              ) : null}
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
