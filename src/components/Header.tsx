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
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-neon">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">SIGEA</h1>
              <p className="text-xs text-muted-foreground font-mono">
                {user?.role === 'admin' ? 'Painel Administrativo' : 'Portal do Estudante'}
              </p>
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