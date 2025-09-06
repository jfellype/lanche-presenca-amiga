import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideIcon } from "lucide-react";
import { optimizedStyles } from "@/utils/performance";

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'primary' | 'secondary' | 'accent' | 'destructive';
}

const MetricsCard = memo(({ title, value, description, icon: Icon, trend, color }: MetricsCardProps) => {
  const colorClasses = {
    primary: {
      icon: "text-primary group-hover:text-primary-glow",
      gradient: "from-primary/10 via-primary/5 to-transparent",
      glow: "group-hover:shadow-neon",
      trend: trend?.isPositive ? "bg-primary/20 text-primary border-primary/30" : "bg-destructive/20 text-destructive border-destructive/30"
    },
    secondary: {
      icon: "text-secondary group-hover:text-secondary-glow", 
      gradient: "from-secondary/10 via-secondary/5 to-transparent",
      glow: "group-hover:shadow-neon-secondary",
      trend: trend?.isPositive ? "bg-secondary/20 text-secondary border-secondary/30" : "bg-destructive/20 text-destructive border-destructive/30"
    },
    accent: {
      icon: "text-accent group-hover:text-accent-glow",
      gradient: "from-accent/10 via-accent/5 to-transparent", 
      glow: "group-hover:shadow-neon-accent",
      trend: trend?.isPositive ? "bg-accent/20 text-accent border-accent/30" : "bg-destructive/20 text-destructive border-destructive/30"
    },
    destructive: {
      icon: "text-destructive group-hover:text-destructive",
      gradient: "from-destructive/10 via-destructive/5 to-transparent",
      glow: "group-hover:shadow-strong", 
      trend: "bg-destructive/20 text-destructive border-destructive/30"
    }
  };

  const colorClass = colorClasses[color];

  return (
    <Card 
      className={`group relative bg-gradient-card glass border-primary/20 ${colorClass.glow} transition-all duration-500 overflow-hidden animate-fade-in`}
      style={optimizedStyles}
    >
      {/* Optimized animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-mono">
          {title}
        </CardTitle>
        <div className="relative">
          <Icon className={`h-5 w-5 ${colorClass.icon} transition-all duration-300`} />
          <div className={`absolute inset-0 bg-current rounded-full blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-foreground font-mono tracking-wider mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-3 pt-2 border-t border-border/50">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${colorClass.trend} transition-all duration-300`}>
              <span className="font-mono">{trend.isPositive ? "↗" : "↘"}</span>
              <span className="font-mono">{trend.isPositive ? "+" : ""}{trend.value}%</span>
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-mono opacity-70">
              vs período anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MetricsCard.displayName = 'MetricsCard';

export default MetricsCard;