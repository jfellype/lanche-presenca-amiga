import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Send, Loader2, Calendar } from "lucide-react";

interface Report {
  id: string;
  report_date: string;
  total_meals_served: number;
  meals_by_type: any;
  observations: string;
  created_at: string;
}

const ReportsManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [observations, setObservations] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchen_reports')
        .select('*')
        .order('report_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar relatórios",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      // Get today's orders
      const today = new Date().toISOString().split('T')[0];
      const { data: orders, error: ordersError } = await supabase
        .from('menu_orders')
        .select('*')
        .eq('order_date', today);

      if (ordersError) throw ordersError;

      // Calculate statistics
      const totalMeals = orders?.length || 0;
      const mealsByType = orders?.reduce((acc: any, order) => {
        acc[order.meal_type] = (acc[order.meal_type] || 0) + 1;
        return acc;
      }, {});

      // Create report
      const { error: reportError } = await supabase
        .from('kitchen_reports')
        .insert({
          report_date: today,
          total_meals_served: totalMeals,
          meals_by_type: mealsByType,
          observations: observations,
          created_by: user.id
        });

      if (reportError) throw reportError;

      toast({
        title: "Relatório criado!",
        description: "O relatório foi enviado ao administrador com sucesso."
      });

      setObservations("");
      loadReports();
    } catch (error: any) {
      toast({
        title: "Erro ao criar relatório",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Gerar Relatório Diário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Adicione observações sobre o dia, incidentes, estoque, etc..."
              rows={5}
              className="resize-none"
            />
          </div>

          <Button
            onClick={generateReport}
            disabled={submitting}
            className="w-full bg-gradient-primary hover:shadow-neon smooth-transition hover-lift"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando Relatório...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Relatório ao Administrador
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Relatórios Anteriores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum relatório criado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-accent">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {new Date(report.report_date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {report.total_meals_served} refeições servidas
                        </span>
                      </div>
                      
                      {report.meals_by_type && (
                        <div className="flex gap-3 text-sm">
                          {Object.entries(report.meals_by_type).map(([type, count]) => (
                            <span key={type} className="text-muted-foreground">
                              {type}: {count as number}
                            </span>
                          ))}
                        </div>
                      )}

                      {report.observations && (
                        <p className="text-sm text-muted-foreground pt-2 border-t">
                          {report.observations}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManager;