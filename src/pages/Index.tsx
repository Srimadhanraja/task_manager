import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import TaskItem from "@/components/TaskItem";
import TaskInput from "@/components/TaskInput";
import TaskStats from "@/components/TaskStats";
import EmailSettings from "@/components/EmailSettings";
import { reminderService } from "@/services/reminderService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  deadline?: Date;
}

const initialTasks: Task[] = [
  { id: "1", text: "Review project requirements", completed: true },
  { id: "2", text: "Design the user interface", completed: true },
  { id: "3", text: "Implement hover effects", completed: false },
  { id: "4", text: "Add smooth animations", completed: false },
  { id: "5", text: "Test on different devices", completed: false },
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initial render
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        // Convert deadline strings back to Date objects
        return parsed.map((task: any) => ({
          ...task,
          deadline: task.deadline ? new Date(task.deadline) : undefined
        }));
      } catch (e) {
        console.error("Failed to parse saved tasks:", e);
        return initialTasks;
      }
    }
    return initialTasks;
  });
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  // Load email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }

    // Request notification permission
    reminderService.requestNotificationPermission();
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Start reminder service when email and tasks are available
  useEffect(() => {
    if (userEmail && tasks.length > 0) {
      reminderService.start(
        { email: userEmail, tasks },
        (task) => {
          toast({
            title: "Task Reminder",
            description: `"${task.text}" is due soon!`,
          });
        }
      );
    }

    return () => reminderService.stop();
  }, [userEmail, tasks, toast]);

  const handleEmailChange = (email: string) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
  };

  const addTask = (text: string, deadline?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      deadline,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-display font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Velvet Tasks
          </h1>
          <p className="text-muted-foreground font-body">
            Smooth as velvet, powerful as steel
          </p>
          
          {/* Email Settings Button */}
          <div className="mt-4 flex justify-center">
            <EmailSettings email={userEmail} onEmailChange={handleEmailChange} />
          </div>
        </header>

        {/* Stats */}
        <section className="mb-8">
          <TaskStats total={tasks.length} completed={completedCount} />
        </section>

        {/* Input */}
        <section className="mb-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <TaskInput onAdd={addTask} />
        </section>

        {/* Task list */}
        <section className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-body">
                No tasks yet. Add one above!
              </p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                id={task.id}
                text={task.text}
                completed={task.completed}
                deadline={task.deadline}
                onToggle={toggleTask}
                onDelete={deleteTask}
                delay={index * 50}
              />
            ))
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground font-body">
          <p>Hover over tasks to reveal actions ✨</p>
          {userEmail && (
            <p className="mt-2">
              Email reminders enabled for: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
