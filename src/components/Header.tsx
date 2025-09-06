import { GraduationCap, Menu, User, Zap } from "lucide-react";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import NotificationSystem from "./Notifications/NotificationSystem";

const Header = () => {
  return (
    <header className="relative bg-gradient-hero shadow-neon border-b border-primary/20 tech-grid">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-4 -right-4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 group">
          <div className="relative">
            <GraduationCap className="h-8 w-8 text-primary-foreground transition-all duration-300 group-hover:animate-pulse-glow" />
            <Zap className="absolute -top-1 -right-1 h-3 w-3 text-secondary animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground font-mono tracking-wider">
              SIGEA
            </h1>
            <div className="text-xs text-primary-foreground/80 font-mono">
              v2.0 • Sistema Integrado
            </div>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:shadow-neon transition-all duration-300 font-medium">
            <span className="relative">
              Dashboard
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></div>
            </span>
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:shadow-neon transition-all duration-300 font-medium">
            <span className="relative">
              Frequência
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></div>
            </span>
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:shadow-neon transition-all duration-300 font-medium">
            <span className="relative">
              Lanches
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></div>
            </span>
          </Button>
        </nav>
        
        <div className="flex items-center space-x-3">
          <NotificationSystem />
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 hover:shadow-neon transition-all duration-300">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-white/20 hover:shadow-neon transition-all duration-300">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;