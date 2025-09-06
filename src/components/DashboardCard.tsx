import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard = ({ title, value, description, icon: Icon, trend }: DashboardCardProps) => {
  return (
    <Card className="group relative bg-gradient-card glass shadow-neon border-primary/20 hover:shadow-neon-secondary hover:border-primary/40 transition-all duration-500 animate-fade-in overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
        <div className="relative">
          <Icon className="h-5 w-5 text-accent group-hover:text-secondary transition-colors duration-300 group-hover:animate-pulse" />
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-foreground font-mono tracking-wider">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 group-hover:text-muted-foreground/80">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-3 pt-2 border-t border-border/50">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              trend.isPositive 
                ? "bg-secondary/20 text-secondary border border-secondary/30" 
                : "bg-destructive/20 text-destructive border border-destructive/30"
            }`}>
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-mono">
              vs mês anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;