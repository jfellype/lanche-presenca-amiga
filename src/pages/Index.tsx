import { useState } from "react";
import Header from "@/components/Header";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import AttendanceChart from "@/components/Dashboard/AttendanceChart";  
import LunchChart from "@/components/Dashboard/LunchChart";
import StudentList from "@/components/Attendance/StudentList";
import MenuManager from "@/components/Lunch/MenuManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserCheck, 
  UserX, 
  UtensilsCrossed,
  Calendar,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-mono mb-4 shadow-neon animate-fade-in">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            Sistema Online
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-hero bg-clip-text text-transparent animate-slide-up">
            Bem-vindo ao SIGEA
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
            Sistema Integrado de Gestão Educacional e Alimentar • Interface inteligente para controle de frequência e alimentação escolar
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/80 glass shadow-neon border border-primary/20 p-1 backdrop-blur-xl">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-neon transition-all duration-300 rounded-lg font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-neon-secondary transition-all duration-300 rounded-lg font-medium"
            >
              <Calendar className="h-4 w-4" />
              Frequência
            </TabsTrigger>
            <TabsTrigger 
              value="lunch" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-neon-accent transition-all duration-300 rounded-lg font-medium"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Lanches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricsCard
                title="Total de Alunos"
                value="248"
                description="Alunos matriculados"
                icon={Users}
                color="primary"
                trend={{ value: 5.2, isPositive: true }}
              />
              <MetricsCard
                title="Presentes Hoje"
                value="232"
                description="93.5% de frequência"
                icon={UserCheck}
                color="secondary"
                trend={{ value: 2.1, isPositive: true }}
              />
              <MetricsCard
                title="Ausentes"
                value="16"
                description="6.5% dos alunos"
                icon={UserX}
                color="destructive"
                trend={{ value: -1.8, isPositive: false }}
              />
              <MetricsCard
                title="Lanches Servidos"
                value="198"
                description="80% dos presentes"
                icon={UtensilsCrossed}
                color="accent"
                trend={{ value: 8.3, isPositive: true }}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <AttendanceChart />
              <LunchChart />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass bg-gradient-card border-primary/20 shadow-neon rounded-lg p-6 hover:shadow-neon-secondary transition-all duration-500">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 font-mono">
                  <Clock className="h-5 w-5 text-primary animate-pulse" />
                  Status do Sistema
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                    <span className="text-muted-foreground font-mono">Banco de Dados:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                      <span className="font-medium text-secondary font-mono">Online</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                    <span className="text-muted-foreground font-mono">API Status:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                      <span className="font-medium text-secondary font-mono">Ativo</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-muted-foreground font-mono">Última atualização:</span>
                    <span className="font-medium font-mono">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <span className="text-muted-foreground font-mono">Próxima sincronização:</span>
                    <span className="font-medium text-accent font-mono">Em 15 min</span>
                  </div>
                </div>
              </div>

              <div className="glass bg-gradient-card border-accent/20 shadow-neon-accent rounded-lg p-6 hover:shadow-neon transition-all duration-500">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 font-mono">
                  <Award className="h-5 w-5 text-accent animate-float" />
                  Conquistas da Semana
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30 shadow-neon-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center shadow-neon-secondary">
                        <Award className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary font-mono">Melhor Frequência</p>
                        <p className="text-sm text-muted-foreground">Turma 5ºA - 98.5%</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 shadow-neon">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-neon">
                        <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-primary font-mono">Maior Aceitação</p>
                        <p className="text-sm text-muted-foreground">Suco Natural - 95%</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/30 shadow-neon-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center shadow-neon-accent">
                        <TrendingUp className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-accent font-mono">Meta Sustentável</p>
                        <p className="text-sm text-muted-foreground">Desperdício reduzido em 20%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <StudentList />
          </TabsContent>

          <TabsContent value="lunch">
            <MenuManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;