import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Type pour une tâche
interface Task {
  id: number;
  title: string;
  description: string;
  assignees: string[];
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
}

// Données de test
const initialPersonnel = [
  { id: 1, name: "Sophie Martin" },
  { id: 2, name: "Marc Dubois" },
  { id: 3, name: "Julie Bernard" },
];

export default function Projects() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    assignees: [],
    status: "todo",
    priority: "medium"
  });
  
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const handleCreate = () => {
    const task: Task = {
      id: tasks.length + 1,
      title: newTask.title || "",
      description: newTask.description || "",
      assignees: selectedAssignees,
      status: newTask.status as "todo" | "in_progress" | "done",
      priority: newTask.priority as "low" | "medium" | "high"
    };

    setTasks([...tasks, task]);
    setIsOpen(false);
    setNewTask({
      title: "",
      description: "",
      assignees: [],
      status: "todo",
      priority: "medium"
    });
    setSelectedAssignees([]);

    toast({
      title: "Tâche créée",
      description: "La nouvelle tâche a été créée avec succès."
    });
  };

  const moveTask = (taskId: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    { id: "todo", title: "À faire" },
    { id: "in_progress", title: "En cours" },
    { id: "done", title: "Terminé" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Projets</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0077B6] text-white hover:bg-[#0077B6]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle tâche
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Assignés</Label>
                <div className="space-y-2">
                  {initialPersonnel.map((person) => (
                    <div key={person.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`person-${person.id}`}
                        checked={selectedAssignees.includes(person.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssignees([...selectedAssignees, person.name]);
                          } else {
                            setSelectedAssignees(selectedAssignees.filter(name => name !== person.name));
                          }
                        }}
                      />
                      <Label htmlFor={`person-${person.id}`}>{person.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Priorité</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full bg-[#0077B6] text-white hover:bg-[#0077B6]/90"
                onClick={handleCreate}
              >
                Créer la tâche
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <Card key={column.id} className="p-4">
            <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
            <div className="space-y-4">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <Card key={task.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority === "high" ? "Haute" : 
                         task.priority === "medium" ? "Moyenne" : "Basse"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {task.assignees.map((assignee, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted rounded-full text-xs"
                        >
                          {assignee}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      {column.id !== "todo" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveTask(task.id, "todo")}
                        >
                          ← À faire
                        </Button>
                      )}
                      {column.id !== "in_progress" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveTask(task.id, "in_progress")}
                        >
                          En cours
                        </Button>
                      )}
                      {column.id !== "done" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveTask(task.id, "done")}
                        >
                          Terminé →
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
