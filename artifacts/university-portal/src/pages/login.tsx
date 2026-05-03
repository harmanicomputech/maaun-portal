import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, GraduationCap, BookOpen, Users, Award, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const FEATURES = [
  { icon: GraduationCap, text: "Student academic management" },
  { icon: BookOpen,      text: "Course enrollment & results" },
  { icon: Users,         text: "Multi-role access control" },
  { icon: Award,         text: "Graduation & transcript system" },
];

const DEMO_USERS = [
  { role: "Super Admin", email: "admin@maaun.edu.ng" },
  { role: "Student",     email: "aisha.mohammed@student.maaun.edu.ng" },
  { role: "Lecturer",    email: "ibrahim.musa@maaun.edu.ng" },
  { role: "Bursar",      email: "fatima.bello@maaun.edu.ng" },
  { role: "Registrar",   email: "samuel.okafor@maaun.edu.ng" },
];

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.token);
        setLocation(`/${data.user.role}/dashboard`);
      },
      onError: (error: any) => {
        setErrorMsg(
          error?.response?.data?.error ||
          error?.message ||
          "Invalid email or password. Please try again.",
        );
      },
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg(null);
    loginMutation.mutate({ data });
  };

  const fillDemo = (email: string) => {
    form.setValue("email", email);
    form.setValue("password", "maaun2024");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left branding panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] bg-primary flex-col justify-between p-12 relative overflow-hidden shrink-0">
        {/* Decorative shapes */}
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/3 -right-28 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-1/4 -left-16 w-48 h-48 rounded-full bg-white/[0.04] pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center border border-white/10">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none tracking-tight">MAAUN</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">University Portal</p>
            </div>
          </div>

          <h1 className="text-white text-[2.2rem] font-bold leading-[1.15] mb-3">
            Maryam Abacha<br />American University<br />
            <span className="text-white/60 font-medium text-2xl">of Nigeria</span>
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-xs">
            Your unified academic management platform for students, staff, and administrators.
          </p>
        </motion.div>

        {/* Feature list */}
        <div className="space-y-3.5">
          {FEATURES.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                <Icon className="w-4 h-4 text-white/80" />
              </div>
              <p className="text-white/75 text-sm">{text}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} MAAUN · University Management System
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-lg text-primary tracking-tight">MAAUN Portal</p>
          </div>

          <div className="mb-7">
            <h2 className="text-[1.8rem] font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-1.5">Sign in to your university account</p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5"
            >
              <Alert variant="destructive">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@maaun.edu.ng"
                        className="h-11"
                        autoComplete="email"
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
                    <FormLabel className="font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold mt-1"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sign in to portal
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>

          {/* Demo credentials panel */}
          <div className="mt-7 rounded-xl border bg-muted/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/80">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="text-xs font-semibold text-foreground">Demo accounts · password: maaun2024</p>
            </div>
            <div className="p-3 grid gap-1">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fillDemo(u.email)}
                  className="text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-background transition-colors group"
                >
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                    {u.role}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/70 group-hover:text-primary transition-colors truncate ml-2 max-w-[200px]">
                    {u.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
