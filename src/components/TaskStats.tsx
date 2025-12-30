import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskStatsProps {
  total: number;
  completed: number;
}

const TaskStats = ({ total, completed }: TaskStatsProps) => {
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { icon: ListTodo, label: "Total", value: total, color: "text-foreground" },
    { icon: Circle, label: "Pending", value: pending, color: "text-accent" },
    { icon: CheckCircle2, label: "Done", value: completed, color: "text-primary" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl bg-card card-shadow transition-spring hover-lift",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <stat.icon className={cn("w-5 h-5", stat.color)} />
            <span className="text-2xl font-display font-semibold text-foreground">
              {stat.value}
            </span>
            <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-1">
        <div className="flex justify-between text-sm font-body text-muted-foreground mb-2">
          <span>Progress</span>
          <span className="font-medium text-foreground">{percentage}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
