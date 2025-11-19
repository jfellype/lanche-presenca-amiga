import { useState } from "react";
import Header from "@/components/Header";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import AttendanceChart from "@/components/Dashboard/AttendanceChart";  
import LunchChart from "@/components/Dashboard/LunchChart";
import StudentList from "@/components/Attendance/StudentList";
import MenuManager from "@/components/Lunch/MenuManager";
import WeeklyReports from "@/components/WeeklyReports";
import KitchenReportsViewer from "@/components/Admin/KitchenReportsViewer";
import UserManagement from "@/components/Admin/UserManagement";
import SystemSettings from "@/components/Admin/SystemSettings";
import AuditLogs from "@/components/Admin/AuditLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserCheck, 
  UserX, 
  UtensilsCrossed,
  BarChart3,
  Calendar,
  Settings,
  TrendingUp,
  ChefHat,
  Shield,
  FileText
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Painel Administrativo</h2>
          <p className="text-muted-foreground">Gerencie o sistema educacional completo</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-card/80 glass shadow-sm border border-border/50 h-auto">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kitchen-reports" 
              className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Rel. Cozinha</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kitchen" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Cardápio</span>
            </TabsTrigger>
            <TabsTrigger
              value="attendance" 
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Frequência</span>
            </TabsTrigger>
            <TabsTrigger 
              value="lunch" 
              className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Alimentação</span>
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-muted data-[state=active]:text-muted-foreground"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <WeeklyReports />
          </TabsContent>

          <TabsContent value="kitchen-reports">
            <KitchenReportsViewer />
          </TabsContent>

          <TabsContent value="kitchen">
            <MenuManager />
          </TabsContent>

          <TabsContent value="attendance">
            <StudentList />
          </TabsContent>

          <TabsContent value="lunch">
            <MenuManager />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;