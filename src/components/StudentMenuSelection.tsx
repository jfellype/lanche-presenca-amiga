import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MenuItemCard {
  id: string;
  name: string;
  description: string;
  category: string;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
  };
  image?: string;
}

const mockMenu: MenuItemCard[] = [
  {
    id: "1",
    name: "Arroz Integral com Feijão",
    description: "Arroz integral orgânico com feijão carioca e tempero caseiro",
    category: "Principal",
    allergens: [],
    nutritionalInfo: { calories: 320, protein: 14, carbs: 58 },
  },
  {
    id: "2",
    name: "Peito de Frango Grelhado",
    description: "Peito de frango orgânico grelhado com ervas finas",
    category: "Principal",
    allergens: [],
    nutritionalInfo: { calories: 185, protein: 31, carbs: 0 },
  },
  {
    id: "3",
    name: "Salada Detox",
    description: "Mix de folhas, beterraba, cenoura e vinagre balsâmico",
    category: "Acompanhamento",
    allergens: [],
    nutritionalInfo: { calories: 85, protein: 3, carbs: 12 },
  },
  {
    id: "4",
    name: "Sanduíche Natural",
    description: "Pão integral com peito de peru, alface e tomate",
    category: "Lanche",
    allergens: ["Glúten", "Lactose"],
    nutritionalInfo: { calories: 285, protein: 18, carbs: 28 },
  },
];

const StudentMenuSelection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Selecione pelo menos um item",
        description: "Escolha os itens que deseja para sua refeição.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Aqui você enviaria para a cozinha e admin
      // Por enquanto, apenas simulação
      
      toast({
        title: "Pedido enviado!",
        description: `${selectedItems.length} item(ns) enviado(s) para a cozinha.`,
      });

      setSelectedItems([]);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar pedido",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Principal: "bg-primary/20 text-primary border-primary/30",
      Acompanhamento: "bg-secondary/20 text-secondary border-secondary/30",
      Lanche: "bg-accent/20 text-accent border-accent/30",
      Bebida: "bg-orange/20 text-orange border-orange/30",
    };
    return colors[category] || "bg-muted/20 text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Cardápio do Dia
          </h2>
          <p className="text-muted-foreground">Escolha seus itens para a refeição</p>
        </div>
        {selectedItems.length > 0 && (
          <Button
            onClick={handleSubmitOrder}
            disabled={loading}
            className="bg-gradient-accent hover:shadow-neon smooth-transition hover-lift"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Enviar Pedido ({selectedItems.length})
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockMenu.map((item) => (
          <Card
            key={item.id}
            className={`glass cursor-pointer smooth-transition hover-lift ${
              selectedItems.includes(item.id)
                ? "border-primary shadow-neon"
                : "border-border/50 hover-glow"
            }`}
            onClick={() => toggleSelection(item.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {selectedItems.includes(item.id) && (
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
              <Badge className={`${getCategoryColor(item.category)} w-fit`}>
                {item.category}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{item.description}</p>

              {item.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.allergens.map((allergen, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs border-yellow-500/30 text-yellow-600"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {allergen}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t">
                <div>
                  <p className="text-muted-foreground">Calorias</p>
                  <p className="font-bold">{item.nutritionalInfo.calories}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Proteína</p>
                  <p className="font-bold">{item.nutritionalInfo.protein}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Carbos</p>
                  <p className="font-bold">{item.nutritionalInfo.carbs}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentMenuSelection;
