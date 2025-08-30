import { Calendar, Clock, User, BookOpen, Edit3, Trash2 } from "lucide-react";
import ScheduleDelete from "./ScheduleDelete";

export default function ScheduleList({ schedules, onEdit, onDeleteSuccess }) {
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

  return (
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule._id}
            schedule={schedule}
            onEdit={onEdit}
            onDeleteSuccess={onDeleteSuccess}
            formatDate={formatDate}
            getDayOfWeek={getDayOfWeek}
          />
        ))}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            No classes scheduled yet
          </h3>
          <p className="text-gray-400">
            Click "Add New Class" to create your first schedule
          </p>
        </div>
      )}
    </div>
  );
}

function ScheduleCard({
  schedule,
  onEdit,
  onDeleteSuccess,
  formatDate,
  getDayOfWeek,
}) {
  return (
    <div
      className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4"
      style={{ borderLeftColor: schedule.colorCode || "#3B82F6" }}
    >
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="card-title text-lg font-bold text-gray-800 mb-1">
              {schedule.subject}
            </h3>
            <div className="badge badge-outline badge-sm">
              <User className="w-3 h-3 mr-1" />
              {schedule.instructor}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(schedule)}
              className="btn btn-sm btn-outline btn-circle hover:btn-primary"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <ScheduleDelete schedule={schedule} onSuccess={onDeleteSuccess} />
          </div>
        </div>

        {/* Schedule Details */}
        <div className="space-y-3">
          {schedule.date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {getDayOfWeek(schedule.date)} • {formatDate(schedule.date)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
        </div>

        {/* Color Indicator */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: schedule.colorCode || "#3B82F6" }}
          />
          <span className="text-xs text-gray-500">Theme color</span>
        </div>
      </div>
    </div>
  );
}
