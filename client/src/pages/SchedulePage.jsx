import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Calendar,
  User,
  BookOpen,
  X,
  Loader2,
} from "lucide-react";

export default function SchedulePage() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Form for creating new schedule
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: createErrors, isSubmitting: isCreating },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  // Form for editing existing schedule
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue,
    formState: { errors: editErrors, isSubmitting: isUpdating },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/schedule");
      setList(res.data);
    } catch (e) {
      console.error("Error loading schedule:", e);
      alert("Error loading schedule");
    } finally {
      setLoading(false);
    }
  }

  const onSubmitCreate = async (data) => {
    try {
      await axiosSecure.post("/api/schedule", data);
      reset();
      setShowCreateModal(false);
      load();
    } catch (error) {
      console.error("Create Error:", error);
      alert(error.response?.data?.error || "Error creating schedule");
    }
  };

  const onSubmitUpdate = async (data) => {
    if (!editing) return;

    try {
      await axiosSecure.put(`/api/schedule/${editing._id}`, data);
      setEditing(null);
      resetEdit();
      load();
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.response?.data?.error || "Error updating schedule");
    }
  };

  async function onDelete(id) {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axiosSecure.delete(`/api/schedule/${id}`);
        load();
      } catch (e) {
        alert("Error deleting schedule");
      }
    }
  }

  function openEdit(item) {
    setEditing(item);
    setValue("subject", item.subject);
    setValue("instructor", item.instructor);
    setValue("date", item.date ? item.date.split("T")[0] : "");
    setValue("startTime", item.startTime);
    setValue("endTime", item.endTime);
    setValue("colorCode", item.colorCode || "#3B82F6");
  }

  function openCreateModal() {
    setShowCreateModal(true);
    reset();
  }

  function closeModals() {
    setShowCreateModal(false);
    setEditing(null);
    resetEdit();
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Class Schedule Manager
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize your classes with a beautiful and intuitive schedule
            system. Add, edit, and manage your courses with ease.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Class Card */}
          <div className="lg:col-span-1">
            <div
              onClick={openCreateModal}
              className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 h-full flex items-center justify-center min-h-[300px]"
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

          {/* Schedule List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.map((schedule) => (
                <div
                  key={schedule._id}
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
                          onClick={() => openEdit(schedule)}
                          className="btn btn-sm btn-outline btn-circle hover:btn-primary"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(schedule._id)}
                          className="btn btn-sm btn-outline btn-circle hover:btn-error"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Schedule Details */}
                    <div className="space-y-3">
                      {schedule.date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {getDayOfWeek(schedule.date)} •{" "}
                            {formatDate(schedule.date)}
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
                        style={{
                          backgroundColor: schedule.colorCode || "#3B82F6",
                        }}
                      />
                      <span className="text-xs text-gray-500">Theme color</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {list.length === 0 && (
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
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Schedule New Class</h3>
              <button
                onClick={closeModals}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
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
                  {createErrors.subject && (
                    <span className="text-error text-sm mt-1">
                      {createErrors.subject.message}
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
                  {createErrors.instructor && (
                    <span className="text-error text-sm mt-1">
                      {createErrors.instructor.message}
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
                  {createErrors.startTime && (
                    <span className="text-error text-sm mt-1">
                      {createErrors.startTime.message}
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
                  {createErrors.endTime && (
                    <span className="text-error text-sm mt-1">
                      {createErrors.endTime.message}
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
                <button
                  type="button"
                  onClick={closeModals}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? (
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
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Class</h3>
              <button
                onClick={closeModals}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitEdit(onSubmitUpdate)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subject *</span>
                  </label>
                  <input
                    {...registerEdit("subject")}
                    className="input input-bordered"
                  />
                  {editErrors.subject && (
                    <span className="text-error text-sm mt-1">
                      {editErrors.subject.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Instructor *</span>
                  </label>
                  <input
                    {...registerEdit("instructor")}
                    className="input input-bordered"
                  />
                  {editErrors.instructor && (
                    <span className="text-error text-sm mt-1">
                      {editErrors.instructor.message}
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
                  {...registerEdit("date")}
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
                    {...registerEdit("startTime")}
                    className="input input-bordered"
                  />
                  {editErrors.startTime && (
                    <span className="text-error text-sm mt-1">
                      {editErrors.startTime.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Time *</span>
                  </label>
                  <input
                    type="time"
                    {...registerEdit("endTime")}
                    className="input input-bordered"
                  />
                  {editErrors.endTime && (
                    <span className="text-error text-sm mt-1">
                      {editErrors.endTime.message}
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
                    {...registerEdit("colorCode")}
                    className="w-12 h-12 border rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">
                    Choose a color for this class
                  </span>
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={closeModals}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
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
      )}
    </div>
  );
}
