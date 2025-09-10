import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut, User } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass border-b border-border/50 backdrop-blur-md bg-card/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon">
              <Shield className="w-6 h-6 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-background"></div>
            </div>
            <div className="ml-6">
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent tracking-tight">SIGEA</h1>
              <p className="text-sm text-muted-foreground font-mono mt-1">Sistema Integrado de Gestão Educacional Avançado</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-xs text-green-500 font-medium">Sistema Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
              <User className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <ThemeToggle />
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;