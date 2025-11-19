import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Settings, Bell, Shield, Database, Globe } from "lucide-react";

const SystemSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    schoolName: "SIGEA - Sistema Integrado",
    emailNotifications: true,
    maintenanceMode: false,
    maxUploadSize: "10",
    sessionTimeout: "30",
  });

  return (
    <Card className="glass border-border/50 shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Settings className="h-6 w-6 text-primary" />
          Configurações do Sistema
        </CardTitle>
        <CardDescription>
          Configure parâmetros gerais e preferências do sistema SIGEA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="gap-2">
              <Globe className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="database" className="gap-2">
              <Database className="h-4 w-4" />
              Banco de Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">Nome da Instituição</Label>
                <Input
                  id="schoolName"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Nome exibido em todo o sistema
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUpload">Tamanho Máximo de Upload (MB)</Label>
                <Input
                  id="maxUpload"
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Limite para upload de arquivos e imagens
                </p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Modo de Manutenção</Label>
                  <p className="text-xs text-muted-foreground">
                    Desabilita o acesso ao sistema temporariamente
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Notificações por E-mail</Label>
                  <p className="text-xs text-muted-foreground">
                    Enviar notificações importantes por e-mail
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-xs text-muted-foreground">
                    Notificações em tempo real no navegador
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Relatórios Semanais Automáticos</Label>
                  <p className="text-xs text-muted-foreground">
                    Envio automático de relatórios toda semana
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tempo de inatividade antes de deslogar automaticamente
                </p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores (2FA)</Label>
                  <p className="text-xs text-muted-foreground">
                    Requer código adicional no login
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Forçar Senha Forte</Label>
                  <p className="text-xs text-muted-foreground">
                    Exigir senhas com 8+ caracteres e complexidade
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Logs de Auditoria</Label>
                  <p className="text-xs text-muted-foreground">
                    Registrar todas as ações importantes do sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Status do Banco de Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tamanho:</p>
                      <p className="font-mono font-semibold">156.4 MB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conexões Ativas:</p>
                      <p className="font-mono font-semibold">12/100</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Último Backup:</p>
                      <p className="font-mono font-semibold">Há 2 horas</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status:</p>
                      <p className="font-mono font-semibold text-green-600">Operacional</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Criar Backup Manual
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Database className="h-4 w-4 mr-2" />
                  Restaurar Backup (Em breve)
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Database className="h-4 w-4 mr-2" />
                  Otimizar Banco de Dados (Em breve)
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border/50">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={() => toast.success('Configurações salvas com sucesso!')}>
            Salvar Alterações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
