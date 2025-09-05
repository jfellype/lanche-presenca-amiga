import { GraduationCap, Menu, User } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-primary shadow-soft border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
          <h1 className="text-2xl font-bold text-primary-foreground">
            EduManager
          </h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/20">
            Dashboard
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/20">
            Frequência
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/20">
            Lanches
          </Button>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-white/20">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;