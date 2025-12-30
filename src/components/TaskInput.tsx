import { useState } from "react";
import { Plus, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskInputProps {
  onAdd: (text: string, deadline?: Date) => void;
}

const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const deadlineDate = deadline ? new Date(deadline) : undefined;
      onAdd(text.trim(), deadlineDate);
      setText("");
      setDeadline("");
    }
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="relative space-y-3">
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-4 rounded-xl bg-card card-shadow transition-spring",
          "border-2",
          isFocused ? "border-primary shadow-[0_0_24px_hsl(var(--primary)/0.15)]" : "border-transparent"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40 transition-spring",
            "flex items-center justify-center",
            isFocused && "border-primary/60 rotate-90"
          )}
        >
          <Plus
            className={cn(
              "w-3 h-3 text-muted-foreground transition-spring",
              isFocused && "text-primary scale-110"
            )}
          />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent outline-none font-body text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className={cn(
            "px-4 py-2 rounded-lg font-body font-medium transition-spring",
            "bg-primary text-primary-foreground",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "enabled:hover:scale-105 enabled:hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
            "enabled:active:scale-95"
          )}
        >
          Add
        </button>
      </div>
      
      {/* Deadline input */}
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-xl bg-card/50 border border-border transition-all",
          deadline && "border-primary/30"
        )}
      >
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <label className="text-sm text-muted-foreground font-medium">
          Deadline (optional):
        </label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={minDateTime}
          className="flex-1 bg-transparent outline-none font-body text-foreground text-sm cursor-pointer"
        />
        {deadline && (
          <button
            type="button"
            onClick={() => setDeadline("")}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Clear deadline"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskInput;
