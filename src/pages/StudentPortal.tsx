import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { mockMenuItems, mockAttendanceData } from "@/lib/data";
import { 
  Calendar,
  Clock,
  UtensilsCrossed,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  User
} from "lucide-react";

const StudentPortal = () => {
  const { user } = useAuth();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const todayAttendance = mockAttendanceData[mockAttendanceData.length - 1];
  const weeklyAttendance = Math.round((todayAttendance.present / (todayAttendance.present + todayAttendance.absent + todayAttendance.late)) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Olá, {user?.name}!</h2>
              <p className="text-muted-foreground">Turma: {user?.class}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Status da Frequência */}
          <Card className="glass bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Hoje</CardTitle>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">Presente</div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Chegada: 08:15</p>
              </div>
            </CardContent>
          </Card>

          {/* Frequência Semanal */}
          <Card className="glass bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequência Semanal</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{weeklyAttendance}%</div>
              <p className="text-xs text-muted-foreground">Excelente desempenho!</p>
            </CardContent>
          </Card>

          {/* Próxima Refeição */}
          <Card className="glass bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Refeição</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">11:30</div>
              <p className="text-xs text-muted-foreground">Intervalo do almoço</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu do Dia */}
        <Card className="mt-6 glass bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-accent" />
              Menu de Hoje
            </CardTitle>
            <CardDescription>Escolha suas opções para o almoço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockMenuItems.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedMeal === item.id 
                    ? 'border-accent bg-accent/10' 
                    : 'border-border hover:border-accent/50'
                }`}
                onClick={() => setSelectedMeal(item.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <Badge 
                        variant={item.category === 'principal' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.nutritionalInfo.calories} kcal</span>
                      <span>{item.nutritionalInfo.protein}g proteína</span>
                      <span>{item.nutritionalInfo.carbs}g carboidrato</span>
                    </div>
                    {item.allergens.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          Contém: {item.allergens.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1 ml-4">
                    {item.available ? (
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {item.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {selectedMeal && (
              <Button className="w-full mt-4 bg-gradient-accent">
                Confirmar Seleção
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Histórico Rápido */}
        <Card className="mt-6 glass bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Histórico da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-xs font-medium text-muted-foreground mb-1">{day}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    index < 5 ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index < 5 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentPortal;