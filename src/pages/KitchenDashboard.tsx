import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { ChefHat, Users, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  type: 'lanche' | 'almoço';
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preparationTime: number;
  servings: number;
  status: 'preparando' | 'pronto' | 'servindo';
  image?: string;
}

const KitchenDashboard = () => {
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Sanduíche Natural Integral',
      type: 'lanche',
      ingredients: ['Pão integral', 'Peito de peru', 'Alface', 'Tomate', 'Queijo branco', 'Maionese caseira'],
      allergens: ['Glúten', 'Lactose'],
      nutritionalInfo: { calories: 285, protein: 18, carbs: 28, fat: 12 },
      preparationTime: 5,
      servings: 45,
      status: 'pronto'
    },
    {
      id: '2',
      name: 'Wrap Vegano de Hummus',
      type: 'lanche',
      ingredients: ['Tortilla integral', 'Hummus', 'Cenoura ralada', 'Pepino', 'Folhas verdes', 'Tomate seco'],
      allergens: ['Glúten'],
      nutritionalInfo: { calories: 245, protein: 12, carbs: 35, fat: 8 },
      preparationTime: 3,
      servings: 25,
      status: 'preparando'
    },
    {
      id: '3',
      name: 'Arroz Integral com Feijão Orgânico',
      type: 'almoço',
      ingredients: ['Arroz integral', 'Feijão carioca orgânico', 'Cebola', 'Alho', 'Louro', 'Azeite extra virgem'],
      allergens: [],
      nutritionalInfo: { calories: 320, protein: 14, carbs: 58, fat: 4 },
      preparationTime: 45,
      servings: 180,
      status: 'servindo'
    },
    {
      id: '4',
      name: 'Peito de Frango Grelhado',
      type: 'almoço',
      ingredients: ['Peito de frango orgânico', 'Ervas finas', 'Limão', 'Azeite', 'Sal marinho', 'Páprica'],
      allergens: [],
      nutritionalInfo: { calories: 185, protein: 31, carbs: 0, fat: 6 },
      preparationTime: 20,
      servings: 120,
      status: 'pronto'
    },
    {
      id: '5',
      name: 'Salada Detox Colorida',
      type: 'almoço',
      ingredients: ['Mix de folhas', 'Beterraba', 'Cenoura', 'Pepino', 'Tomate cereja', 'Azeite', 'Vinagre balsâmico'],
      allergens: [],
      nutritionalInfo: { calories: 85, protein: 3, carbs: 12, fat: 3 },
      preparationTime: 10,
      servings: 200,
      status: 'pronto'
    },
    {
      id: '6',
      name: 'Opção Sem Lactose - Mingau de Aveia',
      type: 'lanche',
      ingredients: ['Aveia', 'Leite de coco', 'Banana', 'Canela', 'Mel', 'Castanhas'],
      allergens: [],
      nutritionalInfo: { calories: 195, protein: 8, carbs: 32, fat: 6 },
      preparationTime: 8,
      servings: 30,
      status: 'pronto'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparando': return 'bg-yellow-500';
      case 'pronto': return 'bg-green-500';
      case 'servindo': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparando': return <Clock className="w-4 h-4" />;
      case 'pronto': return <CheckCircle className="w-4 h-4" />;
      case 'servindo': return <Users className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getAllergenColor = (allergen: string) => {
    switch (allergen.toLowerCase()) {
      case 'lactose': return 'bg-red-100 text-red-800 border-red-200';
      case 'glúten': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const lunchItems = menuItems.filter(item => item.type === 'almoço');
  const snackItems = menuItems.filter(item => item.type === 'lanche');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Cozinha SIGEA
            </h1>
            <p className="text-muted-foreground">
              Gestão completa do cardápio escolar
            </p>
          </div>
        </div>

        <Alert className="mb-6 border-green-200 bg-green-50">
          <AlertTriangle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Atenção:</strong> Todos os pratos são preparados considerando alergias e intolerâncias alimentares.
            Verifique sempre os alérgenos indicados em cada item.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="almoco" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="almoco" className="text-lg">
              Almoço
            </TabsTrigger>
            <TabsTrigger value="lanche" className="text-lg">
              Lanche
            </TabsTrigger>
          </TabsList>

          <TabsContent value="almoco" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lunchItems.map((item) => (
                <Card key={item.id} className="glass overflow-hidden hover:shadow-neon transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor(item.status)} text-white text-xs`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Ingredientes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.ingredients.map((ingredient, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {item.allergens.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-600">Alérgenos:</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen, idx) => (
                            <Badge key={idx} className={`text-xs border ${getAllergenColor(allergen)}`}>
                              ⚠️ {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Calorias:</strong> {item.nutritionalInfo.calories} kcal</p>
                        <p><strong>Proteína:</strong> {item.nutritionalInfo.protein}g</p>
                      </div>
                      <div>
                        <p><strong>Carboidratos:</strong> {item.nutritionalInfo.carbs}g</p>
                        <p><strong>Gordura:</strong> {item.nutritionalInfo.fat}g</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        🍽️ {item.servings} porções
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ⏱️ {item.preparationTime} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lanche" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {snackItems.map((item) => (
                <Card key={item.id} className="glass overflow-hidden hover:shadow-neon transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor(item.status)} text-white text-xs`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Ingredientes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.ingredients.map((ingredient, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {item.allergens.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-600">Alérgenos:</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen, idx) => (
                            <Badge key={idx} className={`text-xs border ${getAllergenColor(allergen)}`}>
                              ⚠️ {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Calorias:</strong> {item.nutritionalInfo.calories} kcal</p>
                        <p><strong>Proteína:</strong> {item.nutritionalInfo.protein}g</p>
                      </div>
                      <div>
                        <p><strong>Carboidratos:</strong> {item.nutritionalInfo.carbs}g</p>
                        <p><strong>Gordura:</strong> {item.nutritionalInfo.fat}g</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        🍽️ {item.servings} porções
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ⏱️ {item.preparationTime} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-sm text-muted-foreground">Pratos Prontos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-muted-foreground">Em Preparo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">1</p>
                  <p className="text-sm text-muted-foreground">Sendo Servido</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default KitchenDashboard;