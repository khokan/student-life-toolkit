import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { scheduleSchema } from "../../schemas/zodSchemas";
import { useEffect } from "react"; // Changed from useState to useEffect

export default function ScheduleEdit() {
  // This component is used through its Modal export
  return null;
}

// Modal Component
ScheduleEdit.Modal = function EditModal({ schedule, onClose, onSuccess, loading = false }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  // Initialize form with schedule data - FIXED: Use useEffect instead of useState
  useEffect(() => {
    if (schedule) {
      setValue("subject", schedule.subject);
      setValue("instructor", schedule.instructor);
      setValue("date", schedule.date ? schedule.date.split("T")[0] : "");
      setValue("startTime", schedule.startTime);
      setValue("endTime", schedule.endTime);
      setValue("colorCode", schedule.colorCode || "#3B82F6");
    }
  }, [schedule, setValue]);

  const onSubmit = async (data) => {
    try {
      // Format the data for the API but DON'T make the call here
      const formattedData = {
        ...data,
        date: data.date || undefined, // Convert empty string to undefined
      };
      
      // Pass the formatted data to the parent component
      // The parent will handle the actual API call via React Query
      onSuccess(formattedData);
    } catch (error) {
      console.error("Form validation error:", error);
      // This should only catch form validation errors, not API errors
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Edit Class: {schedule?.subject}</h3>
          <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject *</span>
              </label>
              <input
                {...register("subject")}
                className="input input-bordered"
                disabled={loading}
              />
              {errors.subject && (
                <span className="text-error text-sm mt-1">
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Instructor *</span>
              </label>
              <input
                {...register("instructor")}
                className="input input-bordered"
                disabled={loading}
              />
              {errors.instructor && (
                <span className="text-error text-sm mt-1">
                  {errors.instructor.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              {...register("date")}
              className="input input-bordered"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Time *</span>
              </label>
              <input
                type="time"
                {...register("startTime")}
                className="input input-bordered"
                disabled={loading}
              />
              {errors.startTime && (
                <span className="text-error text-sm mt-1">
                  {errors.startTime.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">End Time *</span>
              </label>
              <input
                type="time"
                {...register("endTime")}
                className="input input-bordered"
                disabled={loading}
              />
              {errors.endTime && (
                <span className="text-error text-sm mt-1">
                  {errors.endTime.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Theme Color</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                {...register("colorCode")}
                className="w-12 h-12 border rounded cursor-pointer"
                disabled={loading}
              />
              <span className="text-sm text-gray-500">
                Choose a color for this class
              </span>
            </div>
          </div>

          <div className="modal-action">
            <button 
              type="button" 
              onClick={handleClose} 
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Class"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};