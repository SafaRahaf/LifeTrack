import { useEffect, useState } from "react";
import { X, Plus, Save } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";

interface TaskFormProps {
  editingTask: Task | null;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const emptyTask = {
  title: "",
  description: "",
  priority: "medium" as TaskPriority,
  status: "todo" as TaskStatus,
  dueDate: "",
};

function TaskForm({ editingTask, onSave, onClose }: TaskFormProps) {
  const [form, setForm] = useState(emptyTask);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate,
      });
    } else {
      setForm(emptyTask);
    }
  }, [editingTask]);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) return;

    const task: Task = {
      id: editingTask?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
      createdAt: editingTask?.createdAt ?? new Date().toISOString(),
    };

    onSave(task);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-pink-500">
              LifeTrack
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#171020]">
              {editingTask ? "Edit task" : "Create a new task"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Task title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Finish my React project"
              className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add some details..."
              rows={3}
              className="w-full resize-none rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400"
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="w-full rounded-xl border border-purple-100 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#171020] px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-900"
          >
            {editingTask ? <Save size={17} /> : <Plus size={17} />}
            {editingTask ? "Save changes" : "Add task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
