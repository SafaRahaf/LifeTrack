import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import type { Task, TaskStatus } from "../types/task";

const STORAGE_KEY = "lifetrack_tasks";

const initialTasks: Task[] = [
  {
    id: "demo-1",
    title: "Finish my React project",
    description: "Build the first version of LifeTrack.",
    priority: "high",
    status: "in-progress",
    dueDate: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Buy a new laptop stand",
    description: "Find a comfortable stand for my desk.",
    priority: "medium",
    status: "todo",
    dueDate: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Organize my workspace",
    description: "",
    priority: "low",
    status: "completed",
    dueDate: "",
    createdAt: new Date().toISOString(),
  },
];

type Filter = "all" | TaskStatus;

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      "in-progress": tasks.filter((task) => task.status === "in-progress")
        .length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks
      .filter((task) => filter === "all" || task.status === filter)
      .filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query),
      )
      .sort((a, b) => {
        if (a.status === "completed" && b.status !== "completed") return 1;
        if (a.status !== "completed" && b.status === "completed") return -1;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [tasks, filter, search]);

  function handleSave(task: Task) {
    setTasks((previous) => {
      const exists = previous.some((item) => item.id === task.id);

      return exists
        ? previous.map((item) => (item.id === task.id ? task : item))
        : [task, ...previous];
    });

    setShowForm(false);
    setEditingTask(null);
  }

  function handleStatusChange(id: string, status: TaskStatus) {
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  function openCreateForm() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditForm(task: Task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function clearAllTasks() {
    if (!tasks.length) return;

    const confirmed = window.confirm("Delete all your tasks?");

    if (confirmed) {
      setTasks([]);
    }
  }

  const filterOptions: { value: Filter; label: string }[] = [
    { value: "all", label: "All tasks" },
    { value: "todo", label: "To do" },
    { value: "in-progress", label: "In progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-pink-500">
            Stay productive ✨
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#171020]">
            Things to do
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Turn your plans into progress.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-black to-purple-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-purple-900"
        >
          <Plus size={18} />
          Add task
        </button>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Total tasks"
          value={counts.all}
          icon={<ListTodo size={19} />}
          color="bg-purple-100 text-purple-700"
        />
        <Stat
          label="To do"
          value={counts.todo}
          icon={<Clock3 size={19} />}
          color="bg-pink-100 text-pink-700"
        />
        <Stat
          label="In progress"
          value={counts["in-progress"]}
          icon={<Clock3 size={19} />}
          color="bg-amber-100 text-amber-700"
        />
        <Stat
          label="Completed"
          value={counts.completed}
          icon={<CheckCircle2 size={19} />}
          color="bg-green-100 text-green-700"
        />
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your tasks..."
            className="w-full rounded-xl border border-purple-100 py-3 pl-10 pr-4 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                filter === option.value
                  ? "bg-[#171020] text-white"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              {option.label}
              <span className="ml-1.5 opacity-70">{counts[option.value]}</span>
            </button>
          ))}

          <button
            onClick={clearAllTasks}
            className="ml-auto flex items-center gap-1 rounded-full px-3 py-2 text-xs text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Clear all
          </button>
        </div>
      </section>

      {/* Task list */}
      <section className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
              <ListTodo size={27} />
            </div>
            <h3 className="mt-4 text-lg font-bold">Nothing here yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try a different search term."
                : "Add a task and start making progress."}
            </p>
            {!search && (
              <button
                onClick={openCreateForm}
                className="mt-5 rounded-xl bg-[#171020] px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-900"
              >
                Create a task
              </button>
            )}
          </div>
        )}
      </section>

      {showForm && (
        <TaskForm
          editingTask={editingTask}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

interface StatProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function Stat({ label, value, icon, color }: StatProps) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#171020]">{value}</p>
    </div>
  );
}

export default Tasks;
