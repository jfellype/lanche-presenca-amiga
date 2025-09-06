import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp } from "lucide-react";
import { mockAttendanceData } from "@/lib/data";
import { optimizedStyles } from "@/utils/performance";

const AttendanceChart = memo(() => {
  const data = mockAttendanceData.map(item => ({
    ...item,
    total: item.present + item.absent + item.late,
    percentage: Math.round((item.present / (item.present + item.absent + item.late)) * 100)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass bg-card/95 p-3 rounded-lg border border-primary/20 shadow-neon backdrop-blur-xl">
          <p className="font-mono text-sm text-primary mb-2">{`Data: ${label}`}</p>
          <div className="space-y-1">
            <p className="text-xs font-mono">
              <span className="text-secondary">Presentes:</span> {payload[0]?.value}
            </p>
            <p className="text-xs font-mono">
              <span className="text-yellow-500">Atrasados:</span> {payload[1]?.value}
            </p>
            <p className="text-xs font-mono">
              <span className="text-destructive">Ausentes:</span> {payload[2]?.value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass bg-gradient-card border-primary/20 shadow-neon hover:shadow-neon-secondary transition-all duration-500" style={optimizedStyles}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="relative">
            <Calendar className="h-5 w-5 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm"></div>
          </div>
          <span className="font-mono">Frequência Semanal</span>
          <div className="ml-auto flex items-center gap-2 text-xs font-mono">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <span className="text-secondary">+5.2%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
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
              <Area 
                type="monotone" 
                dataKey="present" 
                stackId="1"
                stroke="hsl(var(--secondary))" 
                fill="url(#colorPresent)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="late" 
                stackId="1"
                stroke="#eab308" 
                fill="url(#colorLate)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="absent" 
                stackId="1"
                stroke="hsl(var(--destructive))" 
                fill="url(#colorAbsent)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

AttendanceChart.displayName = 'AttendanceChart';

export default AttendanceChart;