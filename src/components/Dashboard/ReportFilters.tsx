import { Button } from "@/components/ui/button";
import { Calendar, BarChart3 } from "lucide-react";

interface ReportFiltersProps {
  period: 'day' | 'week' | 'month';
  onPeriodChange: (period: 'day' | 'week' | 'month') => void;
}

const ReportFilters = ({ period, onPeriodChange }: ReportFiltersProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Período:</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant={period === 'day' ? 'premium' : 'outline'}
          size="sm"
          onClick={() => onPeriodChange('day')}
          className="hover-lift"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Dia
        </Button>
        <Button
          variant={period === 'week' ? 'premium' : 'outline'}
          size="sm"
          onClick={() => onPeriodChange('week')}
          className="hover-lift"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Semana
        </Button>
        <Button
          variant={period === 'month' ? 'premium' : 'outline'}
          size="sm"
          onClick={() => onPeriodChange('month')}
          className="hover-lift"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Mês
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;
