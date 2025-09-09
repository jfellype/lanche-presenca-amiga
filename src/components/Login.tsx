import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, GraduationCap, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-neon">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">SIGEA</h1>
          <p className="text-muted-foreground mt-2">Sistema Integrado de Gestão Educacional</p>
        </div>

        <Card className="glass border-primary/20 shadow-neon">
          <CardHeader className="text-center">
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>Selecione seu tipo de usuário para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => login('admin')} 
              className="w-full h-14 bg-gradient-primary hover:shadow-neon transition-all text-lg font-medium"
            >
              <UserCog className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div>Administrador</div>
                <div className="text-xs opacity-80">Painel completo de gestão</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => login('student')} 
              variant="outline"
              className="w-full h-14 border-secondary hover:bg-secondary/10 hover:border-secondary transition-all text-lg font-medium"
            >
              <GraduationCap className="w-6 h-6 mr-3 text-secondary" />
              <div className="text-left">
                <div>Estudante</div>
                <div className="text-xs opacity-80">Portal do aluno</div>
              </div>
            </Button>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                🚀 Sistema em modo demonstração - Clique em qualquer opção para acessar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;