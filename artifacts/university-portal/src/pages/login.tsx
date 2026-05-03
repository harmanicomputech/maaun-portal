import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Loader2, GraduationCap, BookOpen, Users, Award,
  Eye, EyeOff, Check, ArrowRight, Mail, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getDashboardRoute } from "@/lib/role-utils";

// ─── Schema ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Demo roles ───────────────────────────────────────────────────────────────
const DEMO_ROLES = [
  { role: "Super Admin", email: "admin@maaun.edu.ng",                              badge: "bg-red-100 text-red-700 border-red-200" },
  { role: "Admin",       email: "halima.ibrahim@maaun.edu.ng",                     badge: "bg-orange-100 text-orange-700 border-orange-200" },
  { role: "Student",     email: "aisha.mohammed@student.maaun.edu.ng",             badge: "bg-blue-100 text-blue-700 border-blue-200" },
  { role: "Lecturer",    email: "ibrahim.musa@maaun.edu.ng",                       badge: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { role: "Bursar",      email: "fatima.bello@maaun.edu.ng",                       badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { role: "Registrar",   email: "samuel.okafor@maaun.edu.ng",                      badge: "bg-violet-100 text-violet-700 border-violet-200" },
  { role: "HoD",         email: "ahmad.usman@maaun.edu.ng",                        badge: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { role: "Dean",        email: "abubakar.shehu@maaun.edu.ng",                     badge: "bg-pink-100 text-pink-700 border-pink-200" },
  { role: "Counsellor",  email: "amina.danladi@maaun.edu.ng",                      badge: "bg-teal-100 text-teal-700 border-teal-200" },
];

// ─── Rotating highlights ──────────────────────────────────────────────────────
const HIGHLIGHTS = [
  "Academic Results & CGPA",
  "Fee Payments & Finance",
  "Hostel & Accommodation",
  "Welfare & Counselling",
  "Transcripts & Graduation",
  "Course Enrollment & Timetable",
];

// ─── Blob config ──────────────────────────────────────────────────────────────
const BLOBS = [
  { cls: "w-80 h-80 bg-blue-300/25  top-[-10%] left-[-10%]",  anim: { x: [0,30,-20,0], y: [0,-15,25,0] }, dur: 12 },
  { cls: "w-96 h-96 bg-indigo-400/15 top-[40%]  right-[-15%]", anim: { x: [0,-25,15,0], y: [0,20,-20,0] }, dur: 15 },
  { cls: "w-64 h-64 bg-blue-200/20  bottom-[-5%] left-[25%]",  anim: { x: [0,15,-10,0], y: [0,-20,10,0] }, dur: 10 },
];

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [showPassword, setShowPassword]   = useState(false);
  const [lastFilled,   setLastFilled]     = useState<string | null>(null);
  const [hlIdx,        setHlIdx]          = useState(0);
  const [showForgot,   setShowForgot]     = useState(false);
  const [forgotEmail,  setForgotEmail]    = useState("");
  const [forgotSent,   setForgotSent]     = useState(false);

  // Rotate highlights
  useEffect(() => {
    const t = setInterval(() => setHlIdx(i => (i + 1) % HIGHLIGHTS.length), 2800);
    return () => clearInterval(t);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        const role  = (data.user.role ?? "").toLowerCase().trim();
        const route = getDashboardRoute(role);
        console.log("[MAAUN] ROLE:", role, "| REDIRECTING TO:", route);
        toast.success("Welcome back!", { description: "Redirecting to your dashboard…" });
        setTimeout(() => {
          login(data.token);
          setLocation(route);
        }, 600);
      },
      onError: (error: any) => {
        toast.error("Incorrect email or password", {
          description: error?.response?.data?.error || "Please check your credentials and try again.",
        });
      },
    },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate({ data });

  const fillDemo = (email: string, role: string) => {
    form.setValue("email", email);
    form.setValue("password", "maaun2024");
    setLastFilled(role);
    setTimeout(() => setLastFilled(null), 2000);
    toast.info(`Filled ${role} credentials`, { duration: 1800 });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Animated left branding panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] bg-primary flex-col justify-between p-12 relative overflow-hidden shrink-0">
        {/* Floating blobs */}
        {BLOBS.map((b, i) => (
          <motion.div
            key={i}
            className={cn("absolute rounded-full blur-3xl pointer-events-none", b.cls)}
            animate={b.anim}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />
        ))}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none tracking-tight">MAAUN</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">University Portal</p>
            </div>
          </div>

          <h1 className="text-white text-[2.1rem] font-bold leading-[1.15] mb-3">
            Maryam Abacha<br />American University<br />
            <span className="text-white/55 font-medium text-2xl">of Nigeria</span>
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-[280px] mb-6">
            Your unified academic management platform.
          </p>

          {/* Rotating feature highlight */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            <AnimatePresence mode="wait">
              <motion.span
                key={hlIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-white/85 text-xs font-medium"
              >
                {HIGHLIGHTS[hlIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Feature list */}
        <div className="relative z-10 space-y-3.5">
          {[
            { icon: GraduationCap, text: "Student academic management" },
            { icon: BookOpen,      text: "Course enrollment & results" },
            { icon: Users,         text: "Multi-role access control" },
            { icon: Award,         text: "Graduation & transcript system" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                <Icon className="w-4 h-4 text-white/80" />
              </div>
              <p className="text-white/75 text-sm">{text}</p>
            </motion.div>
          ))}
        </div>

        <p className="relative z-10 text-white/30 text-xs">
          © {new Date().getFullYear()} MAAUN · University Management System
        </p>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-lg text-primary tracking-tight">MAAUN Portal</p>
          </div>

          {/* Glassmorphism card */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-xl shadow-black/5 p-8">
            <div className="mb-7">
              <h2 className="text-[1.75rem] font-bold tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground mt-1.5 text-sm">Sign in to your university account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">Email address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@maaun.edu.ng"
                          className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-medium text-sm">Password</FormLabel>
                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                            autoComplete="current-password"
                            {...field}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-semibold gap-2"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <ArrowRight className="w-4 h-4" />
                    }
                    {loginMutation.isPending ? "Signing in…" : "Sign in to portal"}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <p className="text-sm text-center text-muted-foreground mt-5">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">Register here</Link>
            </p>
          </div>

          {/* Demo roles panel */}
          <div className="mt-5 rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/40">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="text-xs font-semibold">Demo accounts · password: <span className="font-mono">maaun2024</span></p>
            </div>
            <div className="p-3 grid grid-cols-3 gap-1.5">
              {DEMO_ROLES.map((d) => {
                const filled = lastFilled === d.role;
                return (
                  <motion.button
                    key={d.role}
                    type="button"
                    onClick={() => fillDemo(d.email, d.role)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative flex items-center justify-center gap-1 px-2 py-2 rounded-xl border text-xs font-medium transition-all duration-150",
                      d.badge,
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {filled ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Filled
                        </motion.span>
                      ) : (
                        <motion.span key="label" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {d.role}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Forgot Password Modal ─────────────────────────────────────────── */}
      <Dialog open={showForgot} onOpenChange={v => { setShowForgot(v); if (!v) { setForgotSent(false); setForgotEmail(""); } }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Reset your password</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Enter your email and we'll send instructions to reset your password.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {forgotSent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-foreground">Check your inbox</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  If an account exists for <span className="font-medium text-foreground">{forgotEmail}</span>, reset instructions have been sent.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                >
                  Back to login
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleForgotSubmit}
                className="space-y-4 pt-1"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="name@maaun.edu.ng"
                      className="h-11 pl-9"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 font-semibold">
                  Send reset instructions
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
