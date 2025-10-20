import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, BookOpen, Utensils } from "lucide-react";

const WeeklyReports = () => {
  const attendanceData = [
    { day: "Seg", present: 85, late: 5, absent: 10 },
    { day: "Ter", present: 88, late: 3, absent: 9 },
    { day: "Qua", present: 82, late: 8, absent: 10 },
    { day: "Qui", present: 90, late: 4, absent: 6 },
    { day: "Sex", present: 87, late: 6, absent: 7 }
  ];

  const lunchData = [
    { day: "Seg", served: 150, waste: 15, satisfaction: 8.5 },
    { day: "Ter", served: 145, waste: 12, satisfaction: 8.8 },
    { day: "Qua", served: 155, waste: 18, satisfaction: 8.2 },
    { day: "Qui", served: 160, waste: 10, satisfaction: 9.0 },
    { day: "Sex", served: 148, waste: 14, satisfaction: 8.6 }
  ];

  const libraryData = [
    { day: "Seg", loans: 25, returns: 18 },
    { day: "Ter", loans: 30, returns: 22 },
    { day: "Qua", loans: 28, returns: 20 },
    { day: "Qui", loans: 32, returns: 25 },
    { day: "Sex", loans: 27, returns: 23 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Relatórios Semanais
        </h2>
        <p className="text-muted-foreground mt-2">Acompanhe as estatísticas da semana</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2%</span> vs. semana anterior
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refeições Servidas</CardTitle>
            <Utensils className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">758</div>
            <p className="text-xs text-muted-foreground">
              Média de 151.6 por dia
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empréstimos</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> vs. semana anterior
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.6</div>
            <p className="text-xs text-muted-foreground">
              De 10 pontos possíveis
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Frequência Semanal</CardTitle>
            <CardDescription>Presença, atrasos e ausências por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--primary) / 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="present" fill="hsl(var(--primary))" name="Presentes" />
                <Bar dataKey="late" fill="hsl(var(--warning))" name="Atrasados" />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Ausentes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Alimentação Escolar</CardTitle>
            <CardDescription>Refeições servidas e desperdício</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lunchData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--primary) / 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="served" stroke="hsl(var(--primary))" strokeWidth={2} name="Servidas" />
                <Line type="monotone" dataKey="waste" stroke="hsl(var(--destructive))" strokeWidth={2} name="Desperdício" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Biblioteca</CardTitle>
            <CardDescription>Empréstimos e devoluções da semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={libraryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--primary) / 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="loans" fill="hsl(var(--primary))" name="Empréstimos" />
                <Bar dataKey="returns" fill="hsl(var(--secondary))" name="Devoluções" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Satisfação das Refeições</CardTitle>
            <CardDescription>Avaliação média por dia (0-10)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lunchData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--primary) / 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  name="Satisfação"
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyReports;