import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UtensilsCrossed, Star } from "lucide-react";
import { mockLunchData } from "@/lib/data";
import { optimizedStyles } from "@/utils/performance";

const LunchChart = memo(() => {
  const data = mockLunchData.map(item => ({
    ...item,
    efficiency: Math.round(((item.served - item.waste) / item.served) * 100)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass bg-card/95 p-3 rounded-lg border border-accent/20 shadow-neon-accent backdrop-blur-xl">
          <p className="font-mono text-sm text-accent mb-2">{`Data: ${label}`}</p>
          <div className="space-y-1">
            <p className="text-xs font-mono">
              <span className="text-primary">Servidos:</span> {payload[0]?.value}
            </p>
            <p className="text-xs font-mono">
              <span className="text-destructive">Desperdício:</span> {payload[1]?.value}
            </p>
            <p className="text-xs font-mono">
              <span className="text-yellow-500">Satisfação:</span> {payload[0]?.payload?.satisfaction}★
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const avgSatisfaction = (data.reduce((acc, item) => acc + item.satisfaction, 0) / data.length).toFixed(1);

  return (
    <Card className="glass bg-gradient-card border-accent/20 shadow-neon-accent hover:shadow-neon transition-all duration-500" style={optimizedStyles}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="relative">
            <UtensilsCrossed className="h-5 w-5 text-accent animate-pulse" />
            <div className="absolute inset-0 bg-accent/30 rounded-full blur-sm"></div>
          </div>
          <span className="font-mono">Alimentação Semanal</span>
          <div className="ml-auto flex items-center gap-2 text-xs font-mono">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-yellow-500">{avgSatisfaction}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorServed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={1}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontFamily: 'monospace' }}
                tickFormatter={(value) => new Date(value).getDate().toString()}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="served" 
                fill="url(#colorServed)" 
                radius={[4, 4, 0, 0]}
                name="Servidos"
              />
              <Bar 
                dataKey="waste" 
                fill="url(#colorWaste)" 
                radius={[4, 4, 0, 0]}
                name="Desperdício"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs font-mono text-muted-foreground">Eficiência Média</p>
            <p className="text-lg font-bold text-primary font-mono">
              {Math.round(data.reduce((acc, item) => acc + item.efficiency, 0) / data.length)}%
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-xs font-mono text-muted-foreground">Total Servido</p>
            <p className="text-lg font-bold text-accent font-mono">
              {data.reduce((acc, item) => acc + item.served, 0)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
            <p className="text-xs font-mono text-muted-foreground">Desperdício</p>
            <p className="text-lg font-bold text-secondary font-mono">
              -{data.reduce((acc, item) => acc + item.waste, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

LunchChart.displayName = 'LunchChart';

export default LunchChart;