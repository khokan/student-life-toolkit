import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function SchedulePage() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Form for creating a new schedule
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: createErrors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  // Form for editing an existing schedule
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue,
    formState: { errors: editErrors },
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
      load();
      alert("Class added successfully!");
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
      alert("Class updated successfully!");
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
        alert("Class deleted successfully!");
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
    setValue("colorCode", item.colorCode || "#2196F3");
  }

  function cancelEdit() {
    setEditing(null);
    resetEdit();
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Class Schedule Manager
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create New Class Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
          <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <input
                {...register("subject")}
                placeholder="e.g., Mathematics, Physics"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {createErrors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {createErrors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Instructor *
              </label>
              <input
                {...register("instructor")}
                placeholder="Instructor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {createErrors.instructor && (
                <p className="text-red-500 text-sm mt-1">
                  {createErrors.instructor.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                {...register("date")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  {...register("startTime")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {createErrors.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {createErrors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  {...register("endTime")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {createErrors.endTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {createErrors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Color Theme
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  {...register("colorCode")}
                  defaultValue="#2196F3"
                  className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  Click to choose a color
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Add Class
            </button>
          </form>
        </div>

        {/* Schedule List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>

          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No classes scheduled yet. Add your first class!
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((schedule) => (
                <div
                  key={schedule._id}
                  className="p-4 rounded-lg border"
                  style={{
                    borderLeft: `4px solid ${schedule.colorCode || "#2196F3"}`,
                    backgroundColor: `${schedule.colorCode || "#f9fafb"}20`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {schedule.subject}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Instructor: {schedule.instructor}
                      </p>
                      <div className="text-sm text-gray-500 space-y-1">
                        {schedule.date && (
                          <p>
                            {new Date(schedule.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                              }
                            )}
                            {` • ${formatDate(schedule.date)}`}
                          </p>
                        )}
                        <p>
                          Time: {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(schedule)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(schedule._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Class</h2>

            <form
              onSubmit={handleSubmitEdit(onSubmitUpdate)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject *
                </label>
                <input
                  {...registerEdit("subject")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editErrors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {editErrors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Instructor *
                </label>
                <input
                  {...registerEdit("instructor")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editErrors.instructor && (
                  <p className="text-red-500 text-sm mt-1">
                    {editErrors.instructor.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  {...registerEdit("date")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    {...registerEdit("startTime")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editErrors.startTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {editErrors.startTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    {...registerEdit("endTime")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editErrors.endTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {editErrors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Color Theme
                </label>
                <input
                  type="color"
                  {...registerEdit("colorCode")}
                  className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200"
                >
                  Update Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
