import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  BookOpen,
} from "lucide-react";

export default function PlannerStats({ tasks }) {
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.isCompleted).length,
    pending: tasks.filter((t) => !t.isCompleted).length,
    highPriority: tasks.filter((t) => t.priority === "high" && !t.isCompleted)
      .length,
    overdue: tasks.filter(
      (t) => !t.isCompleted && new Date(t.deadline) < new Date()
    ).length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* Total Tasks */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Total Tasks</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </div>
          <BookOpen className="w-8 h-8 text-primary/60" />
        </div>
      </div>

      {/* Completed */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Completed</p>
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-success/60" />
        </div>
      </div>

      {/* Pending */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Pending</p>
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          </div>
          <Clock className="w-8 h-8 text-warning/60" />
        </div>
      </div>

      {/* High Priority */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">High Priority</p>
            <p className="text-2xl font-bold text-error">
              {stats.highPriority}
            </p>
          </div>
          <Target className="w-8 h-8 text-error/60" />
        </div>
      </div>

      {/* Overdue */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Overdue</p>
            <p className="text-2xl font-bold text-error">{stats.overdue}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-error/60" />
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Completion Rate</p>
            <p className="text-2xl font-bold text-info">{completionRate}%</p>
          </div>
          <Calendar className="w-8 h-8 text-info/60" />
        </div>
      </div>
    </div>
  );
}
