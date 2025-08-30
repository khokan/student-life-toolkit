import { useEffect, useState } from "react";
import ScheduleList from "./ScheduleList";
import ScheduleCreate from "./ScheduleCreate";
import ScheduleEdit from "./ScheduleEdit";
import { Loader2 } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    loadSchedules();
  }, []);

  async function loadSchedules() {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/schedule");
      setSchedules(res.data);
    } catch (e) {
      console.error("Error loading schedule:", e);
      alert("Error loading schedule");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(schedule) {
    setEditingSchedule(schedule);
  }

  function handleCreateSuccess() {
    setShowCreateModal(false);
    loadSchedules();
  }

  function handleEditSuccess() {
    setEditingSchedule(null);
    loadSchedules();
  }

  function handleDeleteSuccess() {
    loadSchedules();
  }

  function closeModals() {
    setShowCreateModal(false);
    setEditingSchedule(null);
  }

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

        {/* Add Class Card */}
        <ScheduleCreate onCreateClick={() => setShowCreateModal(true)} />

        {/* Main Content */}
        {/* Schedule List */}
        <ScheduleList
          schedules={schedules}
          onEdit={handleEdit}
          onDeleteSuccess={handleDeleteSuccess}
        />

        {/* Modals */}
        {showCreateModal && (
          <ScheduleCreate.Modal
            onClose={closeModals}
            onSuccess={handleCreateSuccess}
          />
        )}

        {editingSchedule && (
          <ScheduleEdit.Modal
            schedule={editingSchedule}
            onClose={closeModals}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
}
