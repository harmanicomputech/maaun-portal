import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBg?: string;
  href?: string;
  index?: number;
  sub?: string;
  trend?: { value: number; label: string };
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  href,
  index = 0,
  sub,
  trend,
}: StatCardProps) {
  const inner = (
    <Card
      className={cn(
        "transition-all duration-200 overflow-hidden border border-border/60",
        href && "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      )}
    >
      <CardContent className="p-5">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 shrink-0", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <p className="text-[1.65rem] font-bold tracking-tight leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1.5 font-medium">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
        {trend && (
          <div
            className={cn(
              "text-xs mt-2 flex items-center gap-1 font-semibold",
              trend.value >= 0 ? "text-emerald-600" : "text-red-500",
            )}
          >
            <span>{trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground font-normal">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const wrapped = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.065, ease: "easeOut" }}
      className="h-full"
    >
      {inner}
    </motion.div>
  );

  if (href) return <Link href={href}>{wrapped}</Link>;
  return wrapped;
}

/** Hero/welcome card — primary-colored banner at top of dashboards */
interface HeroCardProps {
  title: string;
  subtitle?: string;
  chips?: { label: string; value: string }[];
  icon?: LucideIcon;
  className?: string;
}

export function HeroCard({ title, subtitle, chips = [], icon: BgIcon, className }: HeroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "bg-primary text-primary-foreground border-0 overflow-hidden relative shadow-lg shadow-primary/20",
          className,
        )}
      >
        {/* Background decoration */}
        {BgIcon && (
          <div className="absolute right-0 top-0 opacity-[0.07] pointer-events-none select-none">
            <BgIcon className="w-72 h-72 -mt-16 -mr-16" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-700 opacity-60" />

        <CardContent className="relative p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{title}</h2>
          {subtitle && (
            <p className="text-primary-foreground/75 text-sm md:text-base">{subtitle}</p>
          )}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {chips.map((c) => (
                <div
                  key={c.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg text-sm"
                >
                  <span className="font-semibold text-white">{c.label}:</span>{" "}
                  <span className="text-primary-foreground/85">{c.value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
