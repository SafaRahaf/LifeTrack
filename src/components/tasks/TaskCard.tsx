import {
  CheckCircle2,
  Circle,
  Clock3,
  Edit3,
  Trash2,
  RotateCcw,
} from "lucide-react";
import type { Task, TaskStatus } from "../../types/task";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityStyles = {
  low: "bg-green-50 text-green-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-pink-50 text-pink-700",
};

function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <article className="group rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <button
          onClick={() =>
            onStatusChange(task.id, isCompleted ? "todo" : "completed")
          }
          className="mt-1 shrink-0 text-pink-500 transition hover:text-purple-600"
          aria-label={isCompleted ? "Reopen task" : "Complete task"}
        >
          {isCompleted ? <CheckCircle2 size={23} /> : <Circle size={23} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={`font-semibold ${
                isCompleted ? "text-gray-400 line-through" : "text-[#171020]"
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                priorityStyles[task.priority]
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="mt-2 text-sm text-gray-500 w-[calc(100%-1rem)] line-clamp-3">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Clock3 size={14} />
                Due: {task.dueDate}
              </span>
            )}

            <span className="capitalize">{task.status.replace("-", " ")}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
            {!isCompleted && (
              <button
                onClick={() =>
                  onStatusChange(
                    task.id,
                    task.status === "todo" ? "in-progress" : "todo",
                  )
                }
                className="flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-100"
              >
                <Clock3 size={14} />
                {task.status === "todo" ? "Start" : "Move to to-do"}
              </button>
            )}

            {isCompleted && (
              <button
                onClick={() => onStatusChange(task.id, "todo")}
                className="flex items-center gap-1 rounded-lg bg-pink-50 px-3 py-2 text-xs font-medium text-pink-700 hover:bg-pink-100"
              >
                <RotateCcw size={14} />
                Reopen
              </button>
            )}

            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              <Edit3 size={14} />
              Edit
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
