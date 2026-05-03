import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Search, Loader2, Users, BookOpen, Megaphone,
  Heart, ShieldAlert, GraduationCap, X,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useGlobalSearch, type SearchResultType } from "@/hooks/use-global-search";
import { cn } from "@/lib/utils";

// ─── Type metadata ────────────────────────────────────────────────────────────

const TYPE_META: Record<
  SearchResultType,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  student:      { label: "Students",         icon: Users,        color: "text-blue-600",   bg: "bg-blue-50"   },
  course:       { label: "Courses",          icon: BookOpen,     color: "text-purple-600", bg: "bg-purple-50" },
  announcement: { label: "Announcements",    icon: Megaphone,    color: "text-amber-600",  bg: "bg-amber-50"  },
  welfare:      { label: "Welfare Cases",    icon: Heart,        color: "text-rose-600",   bg: "bg-rose-50"   },
  disciplinary: { label: "Disciplinary",     icon: ShieldAlert,  color: "text-red-600",    bg: "bg-red-50"    },
  lecturer:     { label: "Lecturers",        icon: GraduationCap,color: "text-emerald-600",bg: "bg-emerald-50"},
};

// Render order for groups
const GROUP_ORDER: SearchResultType[] = [
  "student", "lecturer", "course", "announcement", "welfare", "disciplinary",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { query, setQuery, grouped, isLoading, clear } = useGlobalSearch();

  // Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (route: string) => {
    setOpen(false);
    clear();
    navigate(route);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) clear();
  };

  const hasResults = Object.keys(grouped).length > 0;
  const activeGroups = GROUP_ORDER.filter(t => grouped[t] && grouped[t]!.length > 0);

  return (
    <>
      {/* Trigger button — shown in header */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "relative h-9 justify-start gap-2 text-muted-foreground font-normal",
          "hidden sm:flex",          // only on sm+ screens
          "w-9 sm:w-52 lg:w-64",    // icon-only below sm, expands on sm+
          "border-border/60 bg-background/60 hover:bg-background hover:text-foreground",
        )}
        aria-label="Open search (Ctrl+K)"
      >
        <Search className="h-4 w-4 shrink-0 sm:opacity-50" />
        <span className="hidden sm:inline truncate text-sm">Search portal…</span>
        <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-70">
          ⌘K
        </kbd>
      </Button>

      {/* Mobile search icon (xs only) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="sm:hidden h-9 w-9"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Command dialog */}
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Search students, courses, announcements…"
            value={query}
            onValueChange={setQuery}
            className="flex-1"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0 opacity-50 ml-2" />}
          {query && !isLoading && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 ml-1"
              onClick={() => { setQuery(""); }}
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <CommandList className="max-h-[60vh]">
          {/* Empty/idle states */}
          {query.trim().length < 2 && (
            <div className="py-10 text-center text-sm text-muted-foreground select-none">
              <Search className="mx-auto mb-3 h-8 w-8 opacity-20" />
              Type at least 2 characters to search…
            </div>
          )}

          {query.trim().length >= 2 && !isLoading && !hasResults && (
            <CommandEmpty>
              No results found for "{query}"
            </CommandEmpty>
          )}

          {/* Grouped results */}
          {activeGroups.map((type, idx) => {
            const items = grouped[type]!;
            const meta = TYPE_META[type];
            const Icon = meta.icon;

            return (
              <div key={type}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={meta.label}>
                  {items.map(item => (
                    <CommandItem
                      key={`${item.type}-${item.id}`}
                      value={`${item.type}-${item.id}-${item.title}`}
                      onSelect={() => handleSelect(item.route)}
                      className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                    >
                      {/* Type icon */}
                      <div className={cn("mt-0.5 rounded-md p-1.5 shrink-0", meta.bg)}>
                        <Icon className={cn("h-3.5 w-3.5", meta.color)} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Type pill */}
                      <span className={cn(
                        "shrink-0 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full mt-0.5",
                        meta.bg, meta.color,
                      )}>
                        {type}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            );
          })}

          {/* Footer hint */}
          {hasResults && (
            <div className="border-t px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/30">
              <span>{results_count(grouped)} result{results_count(grouped) !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-2">
                <kbd className="rounded border bg-background px-1 font-mono text-[10px]">↑↓</kbd> navigate
                <kbd className="rounded border bg-background px-1 font-mono text-[10px]">↵</kbd> open
                <kbd className="rounded border bg-background px-1 font-mono text-[10px]">Esc</kbd> close
              </span>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

function results_count(grouped: Partial<Record<SearchResultType, unknown[]>>): number {
  return Object.values(grouped).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);
}
