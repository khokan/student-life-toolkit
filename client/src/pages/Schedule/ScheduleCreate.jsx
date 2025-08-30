import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { scheduleSchema } from "../../schemas/zodSchemas";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ScheduleCreate({ onCreateClick }) {
  return (
    <div className="mb-8">
      <div
        onClick={onCreateClick}
        className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 h-full flex items-center justify-center"
      >
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Add New Class
          </h2>
          <p className="text-gray-500">
            Click here to schedule a new class session
          </p>
        </div>
      </div>
    </div>
  );
}

// Modal Component
ScheduleCreate.Modal = function CreateModal({ onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    try {
      await axiosSecure.post("/api/schedule", data);
      reset();
      onSuccess();
    } catch (error) {
      console.error("Create Error:", error);
      alert(error.response?.data?.error || "Error creating schedule");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Schedule New Class</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
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
                defaultValue="#3B82F6"
                className="w-12 h-12 border rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                Choose a color for this class
              </span>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
