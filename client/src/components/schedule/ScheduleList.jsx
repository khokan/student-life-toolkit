import { Trash2, Edit2, Calendar, Clock, User, Grid, List } from "lucide-react";

export default function ScheduleList({
  schedules,
  onEdit,
  onDelete,
  viewMode = "grid",
  isLoading,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDayOfWeek = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  if (schedules.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center border border-base-300">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500 mb-2">
          No classes scheduled
        </h3>
        <p className="text-gray-400">Add your first class to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Classes ({schedules.length})</h2>
        <div className="text-sm text-base-content/60">
          {viewMode === "grid" ? "Grid View" : "List View"}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule._id}
              schedule={schedule}
              onEdit={onEdit}
              onDelete={onDelete}
              isLoading={isLoading}
              formatDate={formatDate}
              getDayOfWeek={getDayOfWeek}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Subject</th>
                <th>Instructor</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule._id} className="hover:bg-base-200">
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: schedule.colorCode || "#3B82F6",
                        }}
                      />
                      <span className="font-medium">{schedule.subject}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-base-content/60" />
                      {schedule.instructor}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-base-content/60" />
                      {schedule.date && (
                        <span className="text-sm">
                          {getDayOfWeek(schedule.date)} •{" "}
                          {formatDate(schedule.date)}
                        </span>
                      )}
                      <Clock className="w-4 h-4 text-base-content/60 ml-2" />
                      <span className="text-sm">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(schedule)}
                        className="btn btn-sm btn-outline btn-circle"
                        disabled={isLoading}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(schedule._id)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Schedule Card Component for Grid View
function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
  isLoading,
  formatDate,
  getDayOfWeek,
}) {
  return (
    <div
      className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border-l-4"
      style={{ borderLeftColor: schedule.colorCode || "#3B82F6" }}
    >
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="card-title text-base font-bold text-base-content mb-1">
              {schedule.subject}
            </h3>
            <div className="badge badge-outline badge-sm gap-1">
              <User className="w-3 h-3" />
              {schedule.instructor}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(schedule)}
              className="btn btn-sm btn-ghost btn-circle"
              disabled={isLoading}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(schedule._id)}
              className="btn btn-sm btn-ghost btn-circle text-error"
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

        {/* Schedule Details */}
        <div className="space-y-2 text-sm">
          {schedule.date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-base-content/60" />
              <span className="text-base-content/70">
                {getDayOfWeek(schedule.date)} • {formatDate(schedule.date)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-base-content/60" />
            <span className="text-base-content/70">
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
        </div>

        {/* Color Indicator */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-base-200">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: schedule.colorCode || "#3B82F6" }}
          />
          <span className="text-xs text-base-content/50">Theme color</span>
        </div>
      </div>
    </div>
  );
}
