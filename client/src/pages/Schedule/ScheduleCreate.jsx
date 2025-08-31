import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Loader2 } from "lucide-react";
import { scheduleSchema } from "../../schemas/zodSchemas";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ScheduleCreate({ onCreateClick, disabled = false }) {
  return (
    <div className="mb-8">
      <div
        onClick={disabled ? undefined : onCreateClick}
        className={`card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 h-full flex items-center justify-center ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="card-body text-center">
          <div
            className={`w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
              disabled ? "" : "group-hover:bg-blue-200"
            }`}
          >
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Add New Class
          </h2>
          <p className="text-gray-500">
            {disabled
              ? "Processing..."
              : "Click here to schedule a new class session"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Modal Component
ScheduleCreate.Modal = function CreateModal({
  onClose,
  onSuccess,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      colorCode: "#3B82F6", // Set default value here instead of on input
    },
  });

  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    try {
      // Format date to ensure consistency
      const formattedData = {
        ...data,
        date: data.date || undefined, // Send undefined instead of empty string
      };

      const response = await axiosSecure.post("/api/schedule", formattedData);
      reset(); // Clear form after successful submission
      onSuccess(response.data);
    } catch (error) {
      console.error("Create Error:", error);
      alert(error.response?.data?.error || "Error creating schedule");
    }
  };

  const handleClose = () => {
    reset(); // Reset form when closing modal
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Schedule New Class</h3>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
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
                placeholder="Mathematics, Physics, etc."
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
                placeholder="Instructor name"
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
                  Creating...
                </>
              ) : (
                "Create Class"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
