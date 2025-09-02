import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import PlannerForm from "../components/planner/PlannerForm";
import PlannerList from "../components/planner/PlannerList";
import PlannerStats from "../components/planner/PlannerStats";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import {
  Calendar,
  Plus,
  RefreshCw,
  AlertCircle,
  Target,
  Clock,
  BookOpen,
} from "lucide-react";

/**
 * PlannerPage - Main component for managing study tasks and schedules
 * Features: CRUD operations, task tracking, time slot management, and progress monitoring
 */
export default function PlannerPage() {
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("deadline-desc");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();


  // Fetch tasks with React Query for caching and state management
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["planner-tasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/planner");
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    retry: 2,
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: (newTask) => axiosSecure.post("/api/planner", newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["planner-tasks"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Create task failed:", error);
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.put(`/api/planner/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["planner-tasks"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Update task failed:", error);
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/planner/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["planner-tasks"]);
    },
    onError: (error) => {
      console.error("Delete task failed:", error);
    },
  });

  // Toggle task completion mutation
  const toggleCompletionMutation = useMutation({
    mutationFn: ({ id, isCompleted }) =>
      axiosSecure.patch(`/api/planner/${id}`, { isCompleted }),
    onSuccess: () => {
      queryClient.invalidateQueries(["planner-tasks"]);
    },
    onError: (error) => {
      console.error("Toggle completion failed:", error);
    },
  });

  // Filter tasks based on selected criteria
  const filteredTasks = tasks
  .filter((task) => {
    const priorityMatch =
      selectedPriority === "all" || task.priority === selectedPriority;
    const statusMatch =
      selectedStatus === "all" ||
      (selectedStatus === "completed" ? task.isCompleted : !task.isCompleted);
    return priorityMatch && statusMatch;
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "deadline-desc":
        return new Date(b.deadline) - new Date(a.deadline);
      case "deadline-asc":
        return new Date(a.deadline) - new Date(b.deadline);
      case "priority-desc":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "priority-asc":
        const priorityOrderAsc = { high: 3, medium: 2, low: 1 };
        return priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority];
      default:
        return new Date(b.deadline) - new Date(a.deadline);
    }
  });
  

  // Open modal for editing
  const handleEdit = (task) => {
    setEditingTask(task);
    document.getElementById("planner_modal").showModal();
  };

  // Open modal for creating new task
  const handleCreate = () => {
    setEditingTask(null);
    document.getElementById("planner_modal").showModal();
  };

  // Close modal and reset editing state
  const closeModal = () => {
    setEditingTask(null);
    document.getElementById("planner_modal").close();
  };

  // Handle form submission for both create and update
  const handleSubmit = (data) => {
    // Transform deadline to Date object
    const processedData = {
      ...data,
      deadline: new Date(data.deadline),
      slots: data.slots.filter(
        (slot) => slot.day && slot.startTime && slot.endTime
      ),
    };

    if (editingTask) {
      updateMutation.mutate({ id: editingTask._id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  // Handle task completion toggle
  const handleToggleCompletion = (taskId, currentStatus) => {
    toggleCompletionMutation.mutate({
      id: taskId,
      isCompleted: !currentStatus,
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your study plan..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-error mb-2">
            Failed to load tasks
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-base-content">
                    Study Planner
                  </h1>
                  <p className="text-base-content/60">
                    Organize your study schedule and track your progress
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="btn btn-primary gap-2"
                disabled={createMutation.isLoading}
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <PlannerStats tasks={tasks} />

          {/* Filters Section */}
          <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Priority</span>
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
             <div>
  <label className="label">
    <span className="label-text font-semibold">Sort By</span>
  </label>
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="select select-bordered w-full"
  >
    <option value="deadline-desc">Deadline (Newest First)</option>
    <option value="deadline-asc">Deadline (Oldest First)</option>
    <option value="priority-desc">Priority (High to Low)</option>
    <option value="priority-asc">Priority (Low to High)</option>
  </select>
</div>
              <div>
                <button
                  onClick={() => {
                    setSelectedPriority("all");
                    setSelectedStatus("all");
                  }}
                  className="btn btn-ghost w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <PlannerList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={deleteMutation.mutate}
            onToggleCompletion={handleToggleCompletion}
            isLoading={
              deleteMutation.isLoading || toggleCompletionMutation.isLoading
            }
          />

          {/* Add/Edit Task Modal */}
          <dialog id="planner_modal" className="modal">
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
                {editingTask ? "Edit Study Task" : "Add New Task"}
              </h3>
              <PlannerForm
                task={editingTask}
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
