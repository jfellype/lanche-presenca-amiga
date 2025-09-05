import { useState } from "react";
import Header from "@/components/Header";
import DashboardCard from "@/components/DashboardCard";
import AttendanceSection from "@/components/AttendanceSection";
import LunchSection from "@/components/LunchSection";
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo ao EduManager
          </h2>
          <p className="text-muted-foreground">
            Sistema de gestão escolar para frequência e alimentação
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card shadow-soft">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Frequência
            </TabsTrigger>
            <TabsTrigger value="lunch" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Lanches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Total de Alunos"
                value="248"
                description="Alunos matriculados"
                icon={Users}
                trend={{ value: 5.2, isPositive: true }}
              />
              <DashboardCard
                title="Presentes Hoje"
                value="232"
                description="93.5% de frequência"
                icon={UserCheck}
                trend={{ value: 2.1, isPositive: true }}
              />
              <DashboardCard
                title="Ausentes"
                value="16"
                description="6.5% dos alunos"
                icon={UserX}
                trend={{ value: -1.8, isPositive: false }}
              />
              <DashboardCard
                title="Lanches Servidos"
                value="198"
                description="80% dos presentes"
                icon={UtensilsCrossed}
                trend={{ value: 8.3, isPositive: true }}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-gradient-card backdrop-blur-sm rounded-lg p-6 shadow-soft border border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Resumo de Hoje
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Horário de entrada:</span>
                    <span className="font-medium">07:30 - 08:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Horário do lanche:</span>
                    <span className="font-medium">09:30 - 10:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Alunos no refeitório:</span>
                    <span className="font-medium text-secondary">198 alunos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Próxima refeição:</span>
                    <span className="font-medium">12:00 - Almoço</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-card backdrop-blur-sm rounded-lg p-6 shadow-soft border border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Destaques da Semana
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="font-medium text-secondary">Melhor Frequência</p>
                    <p className="text-sm text-muted-foreground">Turma 5ºA - 98.5%</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="font-medium text-primary">Maior Consumo</p>
                    <p className="text-sm text-muted-foreground">Suco Natural - 85%</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="font-medium text-accent">Meta Atingida</p>
                    <p className="text-sm text-muted-foreground">Desperdício reduzido em 15%</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceSection />
          </TabsContent>

          <TabsContent value="lunch">
            <LunchSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;