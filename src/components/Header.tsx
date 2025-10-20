import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import sigeaLogo from "@/assets/sigea-logo.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass border-b border-border/50 backdrop-blur-md sticky top-0 z-50 smooth-transition">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative w-14 h-14 hover-lift">
              <img src={sigeaLogo} alt="SIGEA Logo" className="w-full h-full object-contain" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse border-2 border-background"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent tracking-tight">SIGEA</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Gestão Escolar & Culinária</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></div>
                <span className="text-xs text-accent font-medium">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 hover:bg-primary/10 hover-lift rounded-full"
            >
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {user?.full_name.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </Button>
            <ThemeToggle />
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover-lift"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;