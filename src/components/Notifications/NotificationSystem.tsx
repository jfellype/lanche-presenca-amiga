import { memo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Bell, X, AlertTriangle, CheckCircle, Info, Clock, Users } from "lucide-react";
import { optimizedStyles } from "@/utils/performance";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  urgent: boolean;
}

const NotificationSystem = memo(() => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Meta de Frequência Atingida",
      message: "A turma 5ºA atingiu 98% de frequência esta semana!",
      timestamp: "2 min atrás",
      read: false,
      urgent: false
    },
    {
      id: "2", 
      type: "warning",
      title: "Estoque Baixo",
      message: "Arroz integral com apenas 15% do estoque restante",
      timestamp: "15 min atrás",
      read: false,
      urgent: true
    },
    {
      id: "3",
      type: "info",
      title: "Novo Aluno Matriculado",
      message: "Lucas Ferreira foi matriculado na turma 5ºC",
      timestamp: "1 hora atrás",
      read: true,
      urgent: false
    },
    {
      id: "4",
      type: "error",
      title: "Falha no Sistema",
      message: "Erro temporário no módulo de relatórios. Resolvido automaticamente.",
      timestamp: "2 horas atrás",
      read: true,
      urgent: false
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.urgent && !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      success: <CheckCircle className="h-4 w-4 text-secondary" />,
      warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      info: <Info className="h-4 w-4 text-primary" />,
      error: <X className="h-4 w-4 text-destructive" />
    };
    return icons[type as keyof typeof icons];
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      success: "border-l-secondary bg-secondary/5",
      warning: "border-l-yellow-500 bg-yellow-500/5",
      info: "border-l-primary bg-primary/5", 
      error: "border-l-destructive bg-destructive/5"
    };
    return colors[type as keyof typeof colors];
  };

  // Auto-generate notifications (demo)
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'warning' : 'info',
        title: Math.random() > 0.5 ? 'Atualização do Sistema' : 'Nova Atividade',
        message: 'Demonstração de notificação em tempo real do SIGEA',
        timestamp: 'agora',
        read: false,
        urgent: Math.random() > 0.8
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 30000); // Nova notificação a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-primary-foreground hover:bg-white/20 hover:shadow-neon transition-all duration-300"
        style={optimizedStyles}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center">
            <div className={`w-5 h-5 rounded-full text-xs font-bold font-mono flex items-center justify-center ${
              urgentCount > 0 
                ? 'bg-destructive text-destructive-foreground animate-pulse-glow' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          </div>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <Card className="absolute top-12 right-0 w-96 max-h-96 z-50 glass bg-card/95 border-primary/20 shadow-neon backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notificações
                  {unreadCount > 0 && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
                      {unreadCount} novas
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={markAllAsRead}
                      className="text-xs font-mono hover:bg-primary/20"
                    >
                      Marcar todas
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`group relative p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                          !notification.read ? 'bg-opacity-100' : 'bg-opacity-50 opacity-60'
                        } hover:bg-opacity-80 transition-all duration-300 cursor-pointer`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm text-foreground">
                                  {notification.title}
                                </p>
                                {notification.urgent && !notification.read && (
                                  <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
                                    URGENTE
                                  </Badge>
                                )}
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all duration-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="font-mono text-sm">Nenhuma notificação</p>
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-4 border-t border-border/50 bg-background/30">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full font-mono text-xs glass border-primary/30 hover:shadow-neon"
                  >
                    Ver todas as notificações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
});

NotificationSystem.displayName = 'NotificationSystem';

export default NotificationSystem;