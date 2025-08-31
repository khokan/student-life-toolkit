import { Trash2 } from "lucide-react";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ScheduleDelete({ schedule, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete "${schedule.subject}"?`)
    ) {
      setIsDeleting(true);
      try {
        await axiosSecure.delete(`/api/schedule/${schedule._id}`);
        onSuccess(schedule._id);
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Error deleting schedule");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-sm btn-outline btn-circle hover:btn-error"
      title="Delete"
      disabled={isDeleting}
    >
      {isDeleting ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
