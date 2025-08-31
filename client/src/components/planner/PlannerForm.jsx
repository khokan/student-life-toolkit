import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2, Plus, X, Clock, Calendar, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { plannerSchema } from "../../schemas/zodSchemas";

export default function PlannerForm({
  task,
  onSubmit,
  isLoading = false,
  onCancel,
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      priority: "medium",
      slots: [{ day: "", startTime: "", endTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  const watchedSlots = watch("slots");

  // Pre-fill form when editing
  useEffect(() => {
    if (task) {
      setValue("subject", task.subject);
      setValue("topic", task.topic);
      setValue("priority", task.priority);
      setValue(
        "deadline",
        task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ""
      );

      if (task.slots && task.slots.length > 0) {
        setValue("slots", task.slots);
      } else {
        setValue("slots", [{ day: "", startTime: "", endTime: "" }]);
      }
    } else {
      // Reset form for new task
      reset({
        subject: "",
        topic: "",
        priority: "medium",
        deadline: "",
        slots: [{ day: "", startTime: "", endTime: "" }],
      });
    }
  }, [task, setValue, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const addTimeSlot = () => {
    append({ day: "", startTime: "", endTime: "" });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Subject */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Subject</span>
        </label>
        <input
          {...register("subject")}
          placeholder="e.g., Mathematics, Physics"
          className="input input-bordered"
          disabled={isLoading}
        />
        {errors.subject && (
          <span className="text-error text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.subject.message}
          </span>
        )}
      </div>

      {/* Topic */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Topic</span>
        </label>
        <input
          {...register("topic")}
          placeholder="Specific topic or chapter"
          className="input input-bordered"
          disabled={isLoading}
        />
        {errors.topic && (
          <span className="text-error text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.topic.message}
          </span>
        )}
      </div>

      {/* Priority */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Priority</span>
        </label>
        <select
          {...register("priority")}
          className="select select-bordered"
          disabled={isLoading}
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        {errors.priority && (
          <span className="text-error text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.priority.message}
          </span>
        )}
      </div>

      {/* Deadline */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Deadline</span>
        </label>
        <input
          {...register("deadline")}
          type="datetime-local"
          className="input input-bordered"
          disabled={isLoading}
        />
        {errors.deadline && (
          <span className="text-error text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.deadline.message}
          </span>
        )}
      </div>

      {/* Time Slots */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Study Time Slots</span>
          <span className="label-text-alt text-gray-500">
            Add your available time slots
          </span>
        </label>

        <div className="space-y-3 p-4 bg-base-200 rounded-lg border border-base-300">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  {...register(`slots.${index}.day`)}
                  placeholder="Day (e.g., Monday)"
                  className="input input-bordered"
                  disabled={isLoading}
                />
                <input
                  {...register(`slots.${index}.startTime`)}
                  type="time"
                  className="input input-bordered"
                  disabled={isLoading}
                />
                <input
                  {...register(`slots.${index}.endTime`)}
                  type="time"
                  className="input input-bordered"
                  disabled={isLoading}
                />
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="btn btn-sm btn-error btn-square"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addTimeSlot}
            className="btn btn-outline btn-sm gap-2 mt-2"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            Add Time Slot
          </button>
        </div>

        {errors.slots && (
          <span className="text-error text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.slots.message}
          </span>
        )}
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
              {task ? "Updating..." : "Adding..."}
            </>
          ) : task ? (
            "Update Task"
          ) : (
            "Add Task"
          )}
        </button>
      </div>
    </form>
  );
}
