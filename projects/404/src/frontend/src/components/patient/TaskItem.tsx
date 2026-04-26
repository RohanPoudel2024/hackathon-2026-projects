import { Check, Circle } from "lucide-react";
import { Card } from "../ui/Card";

interface TaskItemProps {
  title: string;
  description?: string;
  completed: boolean;
  onToggle: () => void;
  category?: "medication" | "lifestyle" | "follow-up" | "lab";
}

const categoryColors = {
  medication: "bg-blue-50 text-blue-700 border-blue-100",
  lifestyle: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "follow-up": "bg-amber-50 text-amber-700 border-amber-100",
  lab: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function TaskItem({
  title,
  description,
  completed,
  onToggle,
  category,
}: TaskItemProps) {
  return (
    <Card
      className={`border-b-0 border-x-0 border-t-0 bg-transparent shadow-none transition-all duration-300 ${
        completed ? "opacity-60 bg-white/20" : "hover:bg-white/60 bg-white/40"
      } p-0 rounded-2xl mb-2`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={completed}
        className="flex w-full items-start gap-3 px-4 py-3 text-left"
      >
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-300 ${
            completed
              ? "border-emerald-500 bg-emerald-500 text-white scale-95"
              : "border-gray-300/60 bg-white text-gray-300 hover:border-gray-400 group-hover:scale-105"
          }`}
        >
          {completed ? (
            <Check size={16} strokeWidth={3} />
          ) : (
            <Circle size={12} />
          )}
        </span>

        <span className="flex-1">
          <span className="flex items-start justify-between gap-2">
            <span
              className={`text-[15px] font-bold ${
                completed ? "text-gray-500 line-through decoration-gray-400/50" : "text-gray-900"
              }`}
            >
              {title}
            </span>
            {category && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  categoryColors[category]
                } ${completed ? "opacity-60" : ""}`}
              >
                {category}
              </span>
            )}
          </span>

          {description && (
            <span
              className={`mt-1 block text-xs ${completed ? "text-gray-400" : "text-gray-600"}`}
            >
              {description}
            </span>
          )}
        </span>
      </button>
    </Card>
  );
}
