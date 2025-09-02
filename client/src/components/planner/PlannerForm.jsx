import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { plannerSchema } from "../../schemas/zodSchemas";

import { 
  BookOpen, 
  Book, 
  FileText, 
  Flag, 
  Calendar, 
  Clock, 
  AlertCircle, 
  X, 
  Plus, 
  Loader2, 
  Save 
} from "lucide-react";

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
  <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
  {/* Header */}
  <div className="text-center mb-2">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3">
      <BookOpen className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800">
      {task ? "Edit Study Task" : "Create Study Task"}
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      {task ? "Update your study task details" : "Plan your study session with specific time slots"}
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Subject */}
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <Book className="w-4 h-4 text-gray-500" />
        <span className="label-text font-semibold text-gray-700">Subject</span>
      </label>
      <div className="relative">
        <input
          {...register("subject")}
          placeholder="e.g., Mathematics, Physics, Chemistry"
          className="input input-bordered w-full pl-9 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        />
        <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      {errors.subject && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.subject.message}
        </span>
      )}
    </div>

    {/* Topic */}
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <FileText className="w-4 h-4 text-gray-500" />
        <span className="label-text font-semibold text-gray-700">Topic</span>
      </label>
      <div className="relative">
        <input
          {...register("topic")}
          placeholder="Specific topic or chapter name"
          className="input input-bordered w-full pl-9 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        />
        <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      {errors.topic && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.topic.message}
        </span>
      )}
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Priority */}
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <Flag className="w-4 h-4 text-gray-500" />
        <span className="label-text font-semibold text-gray-700">Priority</span>
      </label>
      <div className="relative">
        <select
          {...register("priority")}
          className="select select-bordered w-full pl-9 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <Flag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      {errors.priority && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.priority.message}
        </span>
      )}
    </div>

    {/* Deadline */}
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="label-text font-semibold text-gray-700">Deadline</span>
      </label>
      <div className="relative">
        <input
          {...register("deadline")}
          type="datetime-local"
          className="input input-bordered w-full pl-9 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          disabled={isLoading}
        />
        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      {errors.deadline && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errors.deadline.message}
        </span>
      )}
    </div>
  </div>

  {/* Time Slots */}
  <div className="form-control">
    <div className="flex items-center justify-between mb-4">
      <label className="label p-0 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-500" />
        <span className="label-text font-semibold text-gray-700">Study Time Slots</span>
      </label>
      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
        Add your available time slots
      </span>
    </div>

    <div className="bg-base-200 rounded-lg border border-base-300 p-5 space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Day Input */}
            <div className="relative">
              <input
                {...register(`slots.${index}.day`)}
                placeholder="Day (e.g., Monday)"
                className="input input-bordered w-full pl-9 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Start Time */}
            <div className="relative">
              <input
                {...register(`slots.${index}.startTime`)}
                type="time"
                className="input input-bordered w-full pl-9 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* End Time */}
            <div className="relative">
              <input
                {...register(`slots.${index}.endTime`)}
                type="time"
                className="input input-bordered w-full pl-9 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="btn btn-sm btn-error btn-square mt-1"
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
        className="btn btn-outline btn-sm gap-2 w-full md:w-auto"
        disabled={isLoading}
      >
        <Plus className="w-4 h-4" />
        Add Another Time Slot
      </button>
    </div>

    {errors.slots && (
      <span className="text-error text-sm mt-2 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        {errors.slots.message}
      </span>
    )}
  </div>

  {/* Form Actions */}
  <div className="modal-action flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-200">
    <button
      type="button"
      onClick={onCancel}
      className="btn btn-ghost min-w-[120px] border border-gray-300 hover:bg-gray-50 order-2 sm:order-1 flex items-center gap-2"
      disabled={isLoading}
    >
      <X className="w-4 h-4" />
      Cancel
    </button>
    <button 
      type="submit" 
      className="btn btn-primary min-w-[140px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-0 text-white shadow-sm hover:shadow-md transition-all order-1 sm:order-2 flex items-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {task ? "Updating..." : "Creating..."}
        </>
      ) : task ? (
        <>
          <Save className="w-4 h-4" />
          Update Task
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Create Task
        </>
      )}
    </button>
  </div>
</form>
  );
}
