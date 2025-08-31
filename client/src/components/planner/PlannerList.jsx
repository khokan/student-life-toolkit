import {
  Trash2,
  Edit2,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Flag,
  BookOpen,
} from "lucide-react";

export default function PlannerList({
  tasks,
  onEdit,
  onDelete,
  onToggleCompletion,
  isLoading,
}) {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Flag className="w-4 h-4 text-error" />;
      case "medium":
        return <Flag className="w-4 h-4 text-warning" />;
      case "low":
        return <Flag className="w-4 h-4 text-success" />;
      default:
        return <Flag className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "badge-error";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center border border-base-300">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-400">
          Create your first study task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Study Tasks ({tasks.length})</h2>
        <div className="text-sm text-gray-500">
          {tasks.filter((t) => t.isCompleted).length} completed
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`card p-4 border border-base-300 shadow-sm ${
              task.isCompleted ? "bg-base-200 opacity-75" : "bg-base-100"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() =>
                      onToggleCompletion(task._id, task.isCompleted)
                    }
                    className="btn btn-sm btn-circle btn-ghost"
                    disabled={isLoading}
                  >
                    {task.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <span
                    className={`badge badge-sm ${getPriorityColor(
                      task.priority
                    )} gap-1`}
                  >
                    {getPriorityIcon(task.priority)}
                    {task.priority}
                  </span>

                  {task.isCompleted && (
                    <span className="badge badge-sm badge-success">
                      Completed
                    </span>
                  )}
                </div>

                <h3
                  className={`text-lg font-semibold mb-2 ${
                    task.isCompleted
                      ? "line-through text-gray-500"
                      : "text-base-content"
                  }`}
                >
                  {task.subject}
                </h3>

                <p className="text-sm text-base-content/60 mb-3">
                  {task.topic}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-base-content/60">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {task.slots && task.slots.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-base-content/60 block mb-1">
                          Time Slots:
                        </span>
                        {task.slots.map((slot, index) => (
                          <span
                            key={index}
                            className="text-xs bg-base-200 px-2 py-1 rounded mr-1"
                          >
                            {slot.day} {slot.startTime}-{slot.endTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(task)}
                  className="btn btn-sm btn-outline btn-circle"
                  disabled={isLoading}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  className="btn btn-sm btn-outline btn-circle btn-error"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
