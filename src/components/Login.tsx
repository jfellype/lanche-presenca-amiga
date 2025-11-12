import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import sigeaLogo from "@/assets/sigea-logo.png";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      <div className="w-full max-w-lg relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img 
                src={sigeaLogo} 
                alt="SIGEA" 
                className="w-24 h-24 object-contain relative z-10 drop-shadow-lg"
              />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              SIGEA
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Sistema Integrado de Gestão Educacional e Alimentar
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-strong">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Bem-vindo</h2>
              <p className="text-muted-foreground">Entre no sistema para começar</p>
            </div>

            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="w-full h-14 bg-gradient-primary hover:shadow-neon text-lg font-semibold group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Acessar Sistema
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Sistema Online</span>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </div>
                <span className="text-sm text-foreground">Operacional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Gestão completa para administração, professores, estudantes e cozinha</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
