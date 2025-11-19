import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, Search, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Status do usuário atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar status do usuário');
    },
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch(role) {
      case 'admin': return 'default';
      case 'teacher': return 'secondary';
      case 'kitchen': return 'outline';
      case 'library': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      teacher: 'Professor',
      student: 'Estudante',
      kitchen: 'Cozinha',
      library: 'Biblioteca'
    };
    return labels[role] || role;
  };

  return (
    <Card className="glass border-border/50 shadow-medium">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              Gestão de Usuários
            </CardTitle>
            <CardDescription>
              Gerencie contas, permissões e status dos usuários do sistema
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Adicione um novo usuário ao sistema SIGEA
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input placeholder="Digite o nome completo" />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input type="email" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <Label>Papel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="teacher">Professor</SelectItem>
                      <SelectItem value="student">Estudante</SelectItem>
                      <SelectItem value="kitchen">Cozinha</SelectItem>
                      <SelectItem value="library">Biblioteca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  toast.info('Funcionalidade em desenvolvimento');
                  setIsDialogOpen(false);
                }}>
                  Criar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Papéis</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="teacher">Professores</SelectItem>
                <SelectItem value="student">Estudantes</SelectItem>
                <SelectItem value="kitchen">Cozinha</SelectItem>
                <SelectItem value="library">Biblioteca</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Usuários */}
          <ScrollArea className="h-[500px] rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <Badge variant="outline" className="gap-1 border-green-500/50 text-green-600 dark:text-green-400">
                            <UserCheck className="h-3 w-3" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 border-red-500/50 text-red-600 dark:text-red-400">
                            <UserX className="h-3 w-3" />
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('Edição em desenvolvimento')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus.mutate({ 
                              userId: user.id, 
                              isActive: user.is_active ?? true 
                            })}
                          >
                            {user.is_active ? (
                              <UserX className="h-4 w-4 text-destructive" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{users?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total de Usuários</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {users?.filter(u => u.is_active).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Usuários Ativos</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  {users?.filter(u => u.role === 'admin').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Administradores</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-secondary">
                  {users?.filter(u => u.role === 'teacher').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Professores</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
