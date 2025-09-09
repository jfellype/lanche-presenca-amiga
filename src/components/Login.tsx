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
            <CardTitle>Escolha seu perfil</CardTitle>
            <CardDescription>Selecione como deseja acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => login('admin')} 
              className="w-full h-12 bg-gradient-primary hover:shadow-neon transition-all"
            >
              <UserCog className="w-5 h-5 mr-2" />
              Acesso Administrativo
            </Button>
            <Button 
              onClick={() => login('student')} 
              variant="outline"
              className="w-full h-12 border-accent hover:bg-accent/10 hover:border-accent/50 transition-all"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Portal do Estudante
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;