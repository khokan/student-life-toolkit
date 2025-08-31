import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, BookOpen, User, Clock, Palette } from "lucide-react";
import { useEffect } from "react";
import { scheduleSchema } from "../../schemas/zodSchemas";

export default function ScheduleForm({
  schedule,
  onSubmit,
  isLoading = false,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      colorCode: "#3B82F6",
    },
  });

  const selectedColor = watch("colorCode");

  // Pre-fill form when editing
  useEffect(() => {
    if (schedule) {
      setValue("subject", schedule.subject);
      setValue("instructor", schedule.instructor);
      setValue("date", schedule.date ? schedule.date.split("T")[0] : "");
      setValue("startTime", schedule.startTime);
      setValue("endTime", schedule.endTime);
      setValue("colorCode", schedule.colorCode || "#3B82F6");
    } else {
      // Reset form for new schedule
      reset({
        subject: "",
        instructor: "",
        date: "",
        startTime: "",
        endTime: "",
        colorCode: "#3B82F6",
      });
    }
  }, [schedule, setValue, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const predefinedColors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Amber
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Subject */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Subject *
          </span>
        </label>
        <input
          {...register("subject")}
          placeholder="Mathematics, Physics, Chemistry..."
          className="input input-bordered"
          disabled={isLoading}
        />
        {errors.subject && (
          <span className="text-error text-sm mt-1">
            {errors.subject.message}
          </span>
        )}
      </div>

      {/* Instructor */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            Instructor *
          </span>
        </label>
        <input
          {...register("instructor")}
          placeholder="Instructor name"
          className="input input-bordered"
          disabled={isLoading}
        />
        {errors.instructor && (
          <span className="text-error text-sm mt-1">
            {errors.instructor.message}
          </span>
        )}
      </div>

      {/* Date */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Date</span>
        </label>
        <input
          type="date"
          {...register("date")}
          className="input input-bordered"
          disabled={isLoading}
        />
        {errors.date && (
          <span className="text-error text-sm mt-1">{errors.date.message}</span>
        )}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Start Time *
            </span>
          </label>
          <input
            type="time"
            {...register("startTime")}
            className="input input-bordered"
            disabled={isLoading}
          />
          {errors.startTime && (
            <span className="text-error text-sm mt-1">
              {errors.startTime.message}
            </span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              End Time *
            </span>
          </label>
          <input
            type="time"
            {...register("endTime")}
            className="input input-bordered"
            disabled={isLoading}
          />
          {errors.endTime && (
            <span className="text-error text-sm mt-1">
              {errors.endTime.message}
            </span>
          )}
        </div>
      </div>

      {/* Color Picker */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Theme Color
          </span>
        </label>

        <div className="space-y-3">
          {/* Custom Color Picker */}
          <div className="flex items-center gap-4">
            <input
              type="color"
              {...register("colorCode")}
              className="w-12 h-12 border-2 border-base-300 rounded-lg cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-sm text-base-content/60">
              {selectedColor}
            </span>
          </div>

          {/* Predefined Colors */}
          <div>
            <p className="text-sm text-base-content/60 mb-2">Quick picks:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("colorCode", color)}
                  className="w-8 h-8 rounded-lg border-2 border-base-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="modal-action">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {schedule ? "Updating..." : "Creating..."}
            </>
          ) : schedule ? (
            "Update Class"
          ) : (
            "Create Class"
          )}
        </button>
      </div>
    </form>
  );
}
