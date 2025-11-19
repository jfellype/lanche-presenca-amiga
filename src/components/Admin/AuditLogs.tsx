import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AuditLogs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auth_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: 'Login',
      signup: 'Cadastro',
      logout: 'Logout',
      password_reset: 'Redefinição de Senha',
      email_change: 'Alteração de Email',
    };
    return labels[action] || action;
  };

  return (
    <Card className="glass border-border/50 shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-primary" />
          Logs de Auditoria
        </CardTitle>
        <CardDescription>
          Histórico de ações e eventos de segurança do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando logs...
                  </TableCell>
                </TableRow>
              ) : logs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum log encontrado
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(log.created_at!), "dd/MM/yy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getActionLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.email}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.ip_address || '-'}
                    </TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge variant="outline" className="gap-1 border-green-500/50 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          Sucesso
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-red-500/50 text-red-600 dark:text-red-400">
                          <XCircle className="h-3 w-3" />
                          Falha
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {log.error_message || 'Sem erros'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{logs?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total de Eventos</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {logs?.filter(l => l.success).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Eventos Bem-sucedidos</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">
                {logs?.filter(l => !l.success).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Falhas de Autenticação</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
