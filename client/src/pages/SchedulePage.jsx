import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";
import ScheduleList from "../components/schedule/ScheduleList";
import ScheduleForm from "../components/schedule/ScheduleForm";
import ScheduleStats from "../components/schedule/ScheduleStats";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import {
  Calendar,
  Plus,
  RefreshCw,
  AlertCircle,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  Layout,
  Grid,
  List
} from "lucide-react";

/**
 * SchedulePage - Main component for managing class schedules
 * Features: CRUD operations, color-coded classes, instructor management, and time scheduling
 */
export default function SchedulePage() {
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedView, setSelectedView] = useState("grid");
  const [filterInstructor, setFilterInstructor] = useState("all");
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // Fetch schedules with React Query
  const {
    data: schedules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/schedule");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Create schedule mutation
  const createMutation = useMutation({
    mutationFn: (newSchedule) => axiosSecure.post("/api/schedule", newSchedule),
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Create schedule failed:", error);
    },
  });

  // Update schedule mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.put(`/api/schedule/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Update schedule failed:", error);
    },
  });

  // Delete schedule mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/schedule/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules"]);
    },
    onError: (error) => {
      console.error("Delete schedule failed:", error);
    },
  });

  // Get unique instructors for filter
  const instructors = [
    ...new Set(schedules.map((s) => s.instructor).filter(Boolean)),
  ];

  // Filter schedules based on selected criteria
  const filteredSchedules = schedules.filter(
    (schedule) =>
      filterInstructor === "all" || schedule.instructor === filterInstructor
  );

  // Open modal for editing
  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    document.getElementById("schedule_modal").showModal();
  };

  // Open modal for creating new schedule
  const handleCreate = () => {
    setEditingSchedule(null);
    document.getElementById("schedule_modal").showModal();
  };

  // Close modal and reset editing state
  const closeModal = () => {
    setEditingSchedule(null);
    document.getElementById("schedule_modal").close();
  };

  // Handle form submission for both create and update
  const handleSubmit = (data) => {
    if (editingSchedule) {
      updateMutation.mutate({ id: editingSchedule._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading class schedule..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-error mb-2">
            Failed to load schedule
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="btn btn-primary gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-base-content">
                    Class Schedule Manager
                  </h1>
                  <p className="text-base-content/60">
                    Organize your classes with color-coded scheduling system
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="btn btn-primary gap-2"
                disabled={createMutation.isLoading}
              >
                <Plus className="w-5 h-5" />
                Add Class
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <ScheduleStats schedules={schedules} />

          {/* Filters and View Options */}
          <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Instructor Filter */}
                <div className="w-full sm:w-64">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Filter by Instructor
                    </span>
                  </label>
                  <select
                    value={filterInstructor}
                    onChange={(e) => setFilterInstructor(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="all">All Instructors</option>
                    {instructors.map((instructor) => (
                      <option key={instructor} value={instructor}>
                        {instructor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggle */}
               <div className="w-full sm:w-auto">
                  <div className="flex items-center gap-3 mt-3">
                    <label className="label p-0 flex items-center gap-2 min-w-[80px]">
                      <Layout className="w-4 h-4 text-gray-500" />
                      <span className="label-text font-semibold text-gray-700 whitespace-nowrap">View:</span>
                    </label>
                    <div className="join border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <button
                        className={`join-item btn gap-2 min-w-[80px] px-3 ${
                          selectedView === "grid" 
                            ? "btn-primary border-0 text-white" 
                            : "btn-ghost bg-white text-gray-700 hover:bg-gray-50 border-0"
                        } transition-all duration-200`}
                        onClick={() => setSelectedView("grid")}
                      >
                        <Grid className="w-4 h-4" />
                        <span className="sm:hidden">Grid</span>
                        <span className="hidden sm:inline">Grid View</span>
                      </button>
                      <button
                        className={`join-item btn gap-2 min-w-[80px] px-3 ${
                          selectedView === "list" 
                            ? "btn-primary border-0 text-white" 
                            : "btn-ghost bg-white text-gray-700 hover:bg-gray-50 border-0"
                        } transition-all duration-200`}
                        onClick={() => setSelectedView("list")}
                      >
                        <List className="w-4 h-4" />
                        <span className="sm:hidden">List</span>
                        <span className="hidden sm:inline">List View</span>
                      </button>
                    </div>
                  </div>
              </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilterInstructor("all")}
                  className="btn btn-ghost"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Schedule List */}
          <ScheduleList
            schedules={filteredSchedules}
            onEdit={handleEdit}
            onDelete={deleteMutation.mutate}
            viewMode={selectedView}
            isLoading={deleteMutation.isLoading}
          />

          {/* Add/Edit Schedule Modal */}
          <dialog id="schedule_modal" className="modal">
            <div className="modal-box max-w-2xl">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </form>
              <h3 className="text-xl font-bold mb-6">
                {editingSchedule ? "Edit Class" : "Add New Class"}
              </h3>
              <ScheduleForm
                schedule={editingSchedule}
                onSubmit={handleSubmit}
                isLoading={createMutation.isLoading || updateMutation.isLoading}
                onCancel={closeModal}
              />
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={closeModal}>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </ErrorBoundary>
  );
}
