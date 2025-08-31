import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Palette,
  TrendingUp,
} from "lucide-react";

export default function ScheduleStats({ schedules }) {
  const stats = {
    total: schedules.length,
    thisWeek: schedules.filter((s) => {
      if (!s.date) return false;
      const scheduleDate = new Date(s.date);
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
    }).length,
    uniqueInstructors: new Set(schedules.map((s) => s.instructor)).size,
    totalHours: schedules
      .reduce((total, s) => {
        if (!s.startTime || !s.endTime) return total;
        const start = new Date(`2000-01-01T${s.startTime}`);
        const end = new Date(`2000-01-01T${s.endTime}`);
        const hours = (end - start) / (1000 * 60 * 60);
        return total + (hours > 0 ? hours : 0);
      }, 0)
      .toFixed(1),
    uniqueColors: new Set(schedules.map((s) => s.colorCode || "#3B82F6")).size,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Classes */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Total Classes</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </div>
          <BookOpen className="w-8 h-8 text-primary/60" />
        </div>
      </div>

      {/* This Week */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">This Week</p>
            <p className="text-2xl font-bold text-secondary">
              {stats.thisWeek}
            </p>
          </div>
          <Calendar className="w-8 h-8 text-secondary/60" />
        </div>
      </div>

      {/* Instructors */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Instructors</p>
            <p className="text-2xl font-bold text-accent">
              {stats.uniqueInstructors}
            </p>
          </div>
          <Users className="w-8 h-8 text-accent/60" />
        </div>
      </div>

      {/* Total Hours */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Total Hours</p>
            <p className="text-2xl font-bold text-warning">
              {stats.totalHours}h
            </p>
          </div>
          <Clock className="w-8 h-8 text-warning/60" />
        </div>
      </div>

      {/* Color Themes */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Color Themes</p>
            <p className="text-2xl font-bold text-info">{stats.uniqueColors}</p>
          </div>
          <Palette className="w-8 h-8 text-info/60" />
        </div>
      </div>
    </div>
  );
}
