import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, Clock, User, Utensils, Loader2 } from "lucide-react";

interface Order {
  id: string;
  student_name: string;
  menu_item: string;
  meal_type: string;
  status: string;
  created_at: string;
  order_date: string;
}

const OrdersList = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    
    // Realtime subscription
    const subscription = supabase
      .channel('menu_orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const { error } = await supabase
        .from('menu_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Pedido marcado como ${newStatus === 'completed' ? 'concluído' : 'em preparo'}.`
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const completedOrders = orders.filter(o => o.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
                <p className="text-sm text-muted-foreground">Pedidos Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Utensils className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{preparingOrders.length}</p>
                <p className="text-sm text-muted-foreground">Em Preparo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
                <p className="text-sm text-muted-foreground">Concluídos Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum pedido no momento
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">{order.student_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {order.meal_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <Utensils className="w-3 h-3 inline mr-1" />
                          {order.menu_item}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {getStatusText(order.status)}
                        </Badge>
                        
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            disabled={updating === order.id}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            {updating === order.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Iniciar'
                            )}
                          </Button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            disabled={updating === order.id}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            {updating === order.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Concluir
                              </>
                            )}
                          </Button>
                        )}
                      </div>
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

export default OrdersList;