import { useLocation } from "wouter";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopHeader() {
  const [location] = useLocation();
  const { user } = useAuth();

  // Simple title generation based on path
  const getPageTitle = () => {
    const segments = location.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const lastSegment = segments[segments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace("-", " ");
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <div>
          <h2 className="text-lg font-semibold text-foreground">{getPageTitle()}</h2>
          <div className="text-xs text-muted-foreground hidden sm:block">
            {location}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
            </div>
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=0B3CFE`} />
              <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
}
