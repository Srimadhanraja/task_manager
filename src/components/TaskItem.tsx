import { useState, useEffect } from "react";
import { Check, Trash2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  deadline?: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

const TaskItem = ({ id, text, completed, deadline, onToggle, onDelete, delay = 0 }: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isOverdue, setIsOverdue] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!deadline || completed) {
      setTimeRemaining("");
      return;
    }

    const updateTimeRemaining = () => {
      const now = new Date();
      const deadlineTime = new Date(deadline);
      const diff = deadlineTime.getTime() - now.getTime();

      if (diff < 0) {
        setIsOverdue(true);
        setTimeRemaining("Overdue!");
        return;
      }

      setIsOverdue(false);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const days = Math.floor(hours / 24);

      // Mark as urgent if less than 1 hour remaining
      setIsUrgent(diff < 3600000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [deadline, completed]);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(id), 200);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 px-5 py-4 rounded-xl bg-card card-shadow task-item",
        "border border-transparent hover:border-primary/20",
        completed && "opacity-60",
        isDeleting && "scale-95 opacity-0 transition-all duration-200",
        isOverdue && !completed && "border-destructive/30 bg-destructive/5"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(id)}
          className={cn(
            "task-checkbox flex-shrink-0",
            completed && "checked"
          )}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && (
            <Check className="w-3 h-3 text-primary-foreground animate-check-pop" />
          )}
        </button>

        {/* Task text */}
        <span
          className={cn(
            "flex-1 text-foreground font-body transition-all duration-300",
            completed && "line-through text-muted-foreground"
          )}
        >
          {text}
        </span>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className={cn(
            "p-2 rounded-lg text-muted-foreground transition-spring",
            "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
            "hover:bg-destructive/10 hover:text-destructive hover:scale-110",
            "focus:opacity-100 focus:translate-x-0"
          )}
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Hover accent line */}
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full bg-primary transition-all duration-300",
            isHovered ? "h-8 opacity-100" : "h-0 opacity-0"
          )}
        />
      </div>

      {/* Deadline display */}
      {deadline && !completed && timeRemaining && (
        <div
          className={cn(
            "flex items-center gap-2 text-xs ml-9 px-3 py-1.5 rounded-lg w-fit",
            isOverdue
              ? "bg-destructive/10 text-destructive"
              : isUrgent
              ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isOverdue ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          <span className="font-medium">
            {isOverdue ? timeRemaining : `Due in ${timeRemaining}`}
          </span>
          <span className="text-[10px] opacity-70">
            {new Date(deadline).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
