import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Calendar, Check, Clock, Search, User, X } from "lucide-react";

interface Student {
  id: number;
  name: string;
  class: string;
  status: "presente" | "ausente" | "atrasado";
}

const AttendanceSection = () => {
  const [students] = useState<Student[]>([
    { id: 1, name: "João Silva", class: "5ºA", status: "presente" },
    { id: 2, name: "Maria Santos", class: "5ºA", status: "ausente" },
    { id: 3, name: "Pedro Costa", class: "5ºB", status: "atrasado" },
    { id: 4, name: "Ana Oliveira", class: "5ºA", status: "presente" },
    { id: 5, name: "Lucas Ferreira", class: "5ºB", status: "presente" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "presente":
        return "bg-secondary text-secondary-foreground";
      case "ausente":
        return "bg-destructive text-destructive-foreground";
      case "atrasado":
        return "bg-yellow-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "presente":
        return <Check className="h-3 w-3" />;
      case "ausente":
        return <X className="h-3 w-3" />;
      case "atrasado":
        return <Clock className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="bg-gradient-card backdrop-blur-sm shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Controle de Frequência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              Marcar Presença
            </Button>
          </div>

          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:shadow-soft transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.class}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(student.status)}>
                  {getStatusIcon(student.status)}
                  <span className="ml-1 capitalize">{student.status}</span>
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSection;