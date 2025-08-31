import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ScheduleList from "./ScheduleList";
import ScheduleCreate from "./ScheduleCreate";
import ScheduleEdit from "./ScheduleEdit";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function SchedulePage() {
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch schedules with React Query
  const {
    data: schedules = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/schedule");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newSchedule) => axiosSecure.post("/api/schedule", newSchedule),
    onSuccess: (response) => {
      // Update cache optimistically
      queryClient.setQueryData(["schedules"], (old) => [
        ...(old || []),
        response.data,
      ]);
      setShowCreateModal(false);
    },
    onError: (error) => {
      console.error("Create failed:", error);
      alert("Failed to create schedule");
    },
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.put(`/api/schedule/${id}`, data),
    onSuccess: (response, variables) => {
      // Update cache optimistically
      queryClient.setQueryData(["schedules"], (old) =>
        (old || []).map((schedule) =>
          schedule._id === variables.id ? response.data : schedule
        )
      );
      setEditingSchedule(null);
    },
    onError: (error) => {
      console.error("Update failed:", error);
      alert("Failed to update schedule");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/schedule/${id}`),
    onSuccess: (_, deletedId) => {
      // Update cache optimistically
      queryClient.setQueryData(["schedules"], (old) =>
        (old || []).filter((schedule) => schedule._id !== deletedId)
      );
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Failed to delete schedule");
    },
  });

  function closeModals() {
    setShowCreateModal(false);
    setEditingSchedule(null);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">
            Error loading schedule
          </div>
          <button
            onClick={() => queryClient.refetchQueries(["schedules"])}
            className="btn btn-primary"
          >
            Try Again
          </button>
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

        {/* Main Content Grid */}
        {/* Add Class Card */}
        <ScheduleCreate
          onCreateClick={() => setShowCreateModal(true)}
          disabled={createMutation.isPending}
        />

        {/* Schedule List */}
        <ScheduleList
          schedules={schedules}
          onEdit={setEditingSchedule}
          onDeleteSuccess={deleteMutation.mutate}
          disabled={deleteMutation.isPending}
        />

        {/* Modals */}
        {showCreateModal && (
          <ScheduleCreate.Modal
            onClose={closeModals}
            onSuccess={createMutation.mutate}
            loading={createMutation.isPending}
          />
        )}

        {editingSchedule && (
          <ScheduleEdit.Modal
            schedule={editingSchedule}
            onClose={closeModals}
            onSuccess={(data) =>
              editMutation.mutate({ id: editingSchedule._id, data })
            }
            loading={editMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
