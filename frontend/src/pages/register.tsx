import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap, ArrowRight, ArrowLeft,
  Eye, EyeOff, Loader2, User, Mail, Lock, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getDashboardRoute } from "@/lib/role-utils";

// ─── Schemas ─────────────────────────────────────────────────────────────────
// Base schema (no refine) so we can merge without ZodEffects issues
const baseSchema = z.object({
  name:            z.string().min(2, "Full name is required (min 2 chars)"),
  email:           z.string().email("Please enter a valid email address"),
  password:        z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role:            z.enum(["student", "lecturer", "admin"] as const),
});

const fullSchema = baseSchema.refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FullFormValues = z.infer<typeof fullSchema>;

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 6)            s++;
  if (pw.length >= 10)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: "Weak",   color: "bg-red-500" };
  if (s === 2) return { score: 2, label: "Fair",   color: "bg-orange-500" };
  if (s === 3) return { score: 3, label: "Good",   color: "bg-yellow-500" };
  return       { score: 4, label: "Strong", color: "bg-green-500" };
}

const ROLES = [
  { value: "student",  label: "Student" },
  { value: "lecturer", label: "Lecturer" },
  { value: "admin",    label: "Administrator" },
];

const BLOBS = [
  { cls: "w-80 h-80 bg-blue-300/25  top-[-10%] left-[-10%]",  anim: { x: [0,30,-20,0], y: [0,-15,25,0] }, dur: 12 },
  { cls: "w-96 h-96 bg-indigo-400/15 top-[40%]  right-[-15%]", anim: { x: [0,-25,15,0], y: [0,20,-20,0] }, dur: 15 },
];

export default function Register() {
  const { login }       = useAuth();
  const [, setLocation] = useLocation();
  const [step,        setStep]        = useState<1 | 2>(1);
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "student" },
    mode: "onChange",
  });

  const password  = form.watch("password");
  const firstName = form.watch("name")?.split(" ")[0] || "there";
  const strength  = getStrength(password);

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        const role  = (data.user.role ?? "").toLowerCase().trim();
        const route = getDashboardRoute(role);
        toast.success("Account created!", { description: "Welcome to MAAUN Portal." });
        setTimeout(() => {
          login(data.token);
          setLocation(route);
        }, 600);
      },
      onError: (error: any) => {
        toast.error("Registration failed", {
          description: error?.response?.data?.error || error?.message || "Please try again.",
        });
      },
    },
  });

  // Validate step 1 fields before advancing
  const goStep2 = async () => {
    const valid = await form.trigger(["name", "email"]);
    if (valid) setStep(2);
  };

  const onSubmit = (data: FullFormValues) => {
    registerMutation.mutate({
      data: { name: data.name, email: data.email, password: data.password, role: data.role },
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left branding panel ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] bg-primary flex-col justify-between p-12 relative overflow-hidden shrink-0">
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
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center border border-white/10">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none tracking-tight">MAAUN</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">University Portal</p>
            </div>
          </div>

          <h1 className="text-white text-[2.1rem] font-bold leading-[1.15] mb-3">
            Create your<br />MAAUN account<br />
            <span className="text-white/55 font-medium text-2xl">and get started</span>
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-[280px]">
            Join thousands of students, staff, and administrators managing their university life digitally.
          </p>
        </motion.div>

        {/* Step progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3"
        >
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">Registration steps</p>
          {[
            { n: 1, label: "Personal Information", desc: "Your name and email" },
            { n: 2, label: "Account Credentials",  desc: "Password and role" },
          ].map(s => (
            <div key={s.n} className="flex items-center gap-3">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-all",
                step > s.n  ? "bg-green-400 border-green-400 text-white" :
                step === s.n ? "bg-white border-white text-primary" :
                              "border-white/30 text-white/40",
              )}>
                {step > s.n ? "✓" : s.n}
              </div>
              <div>
                <p className={cn("text-sm font-medium", step >= s.n ? "text-white" : "text-white/40")}>{s.label}</p>
                <p className={cn("text-xs", step >= s.n ? "text-white/60" : "text-white/25")}>{s.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <p className="relative z-10 text-white/30 text-xs">
          © {new Date().getFullYear()} MAAUN · University Management System
        </p>
      </div>

      {/* ── Right form panel ───────────────────────────────────────────────── */}
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

          <div className="bg-card border border-border/60 rounded-2xl shadow-xl shadow-black/5 p-8">
            {/* Header + progress */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-[1.6rem] font-bold tracking-tight">
                  {step === 1 ? "Create account" : "Set credentials"}
                </h2>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-full">
                  Step {step} of 2
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {step === 1
                  ? "Enter your personal information"
                  : `Hi ${firstName}, set your password and role`}
              </p>
              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {/* ── Step 1 ─────────────────────────────────────────── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-5"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-sm">Full name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="e.g. Aisha Mohammed" className="h-11 pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-sm">Email address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  placeholder="name@maaun.edu.ng"
                                  className="h-11 pl-9"
                                  autoComplete="email"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          type="button"
                          className="w-full h-11 font-semibold gap-2 mt-2"
                          onClick={goStep2}
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* ── Step 2 ─────────────────────────────────────────── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-5"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-sm">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type={showPw ? "text" : "password"}
                                  placeholder="At least 6 characters"
                                  className="h-11 pl-9 pr-10"
                                  autoComplete="new-password"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  onClick={() => setShowPw(v => !v)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            {/* Strength bar */}
                            {password.length > 0 && (
                              <div className="space-y-1.5 mt-1">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4].map(n => (
                                    <div
                                      key={n}
                                      className={cn(
                                        "h-1 flex-1 rounded-full transition-all duration-300",
                                        n <= strength.score ? strength.color : "bg-muted",
                                      )}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Strength: <span className="font-semibold text-foreground">{strength.label}</span>
                                </p>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-sm">Confirm password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type={showConfirm ? "text" : "password"}
                                  placeholder="Re-enter password"
                                  className="h-11 pl-9 pr-10"
                                  autoComplete="new-password"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  onClick={() => setShowConfirm(v => !v)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-sm">Account role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ROLES.map(r => (
                                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 gap-1.5 font-medium"
                          onClick={() => setStep(1)}
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                        <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            type="submit"
                            className="w-full h-11 font-semibold gap-2"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <ArrowRight className="w-4 h-4" />
                            }
                            {registerMutation.isPending ? "Creating account…" : "Create account"}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>

            <p className="text-sm text-center text-muted-foreground mt-5">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">Sign in here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
