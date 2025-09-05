import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UtensilsCrossed, Plus, Clock, Users, CheckCircle } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: "principal" | "acompanhamento" | "sobremesa" | "bebida";
  available: boolean;
  studentsServed: number;
  totalStudents: number;
}

const LunchSection = () => {
  const [menuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Arroz com Feijão",
      description: "Arroz branco e feijão carioca temperados",
      category: "principal",
      available: true,
      studentsServed: 145,
      totalStudents: 200,
    },
    {
      id: 2,
      name: "Frango Grelhado",
      description: "Peito de frango grelhado com temperos naturais",
      category: "principal",
      available: true,
      studentsServed: 120,
      totalStudents: 200,
    },
    {
      id: 3,
      name: "Salada Verde",
      description: "Mix de folhas verdes com tomate cereja",
      category: "acompanhamento",
      available: true,
      studentsServed: 89,
      totalStudents: 200,
    },
    {
      id: 4,
      name: "Gelatina de Morango",
      description: "Sobremesa refrescante sabor morango",
      category: "sobremesa",
      available: false,
      studentsServed: 0,
      totalStudents: 200,
    },
    {
      id: 5,
      name: "Suco Natural",
      description: "Suco de frutas da estação",
      category: "bebida",
      available: true,
      studentsServed: 178,
      totalStudents: 200,
    },
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "principal":
        return "bg-primary text-primary-foreground";
      case "acompanhamento":
        return "bg-secondary text-secondary-foreground";
      case "sobremesa":
        return "bg-accent text-accent-foreground";
      case "bebida":
        return "bg-yellow-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProgressPercentage = (served: number, total: number) => {
    return Math.round((served / total) * 100);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="bg-gradient-card backdrop-blur-sm shadow-soft border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              Cardápio do Dia
            </CardTitle>
            <Button className="bg-gradient-secondary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-background/50 border border-border/50 hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.available ? (
                      <Badge className="bg-secondary text-secondary-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Disponível
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <Clock className="h-3 w-3 mr-1" />
                        Indisponível
                      </Badge>
                    )}
                  </div>
                </div>

                {item.available && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Estudantes servidos
                      </span>
                      <span className="font-medium">
                        {item.studentsServed}/{item.totalStudents}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${getProgressPercentage(
                            item.studentsServed,
                            item.totalStudents
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getProgressPercentage(item.studentsServed, item.totalStudents)}% dos estudantes já foram servidos
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LunchSection;