import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function SchedulePage() {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(scheduleSchema),
  });
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const axiosSecure = useAxiosSecure();
  const {
    register: regEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
  } = useForm({ resolver: zodResolver(scheduleSchema) });

  async function load() {
    try {
      const res = await axiosSecure.get("/api/schedule");
      setList(res.data);
    } catch (e) {
      alert("Error loading schedule");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(data) {
    try {
      console.log(data);
      await axiosSecure.post("/schedule", data);
      reset();
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Error creating schedule");
    }
  }

  async function onUpdate(data) {
    try {
      await axiosSecure.put(`/schedule/${editing._id}`, data);
      setEditing(null);
      resetEdit();
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Error updating schedule");
    }
  }

  async function onDelete(id) {
    if (window.confirm("Delete this class?")) {
      try {
        await axiosSecure.delete(`/schedule/${id}`);
        load();
      } catch (e) {
        alert("Error deleting schedule");
      }
    }
  }

  function openEdit(item) {
    setEditing(item);
    resetEdit(item);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Create New Class */}
      <div className="card p-4">
        <h3>Add Class</h3>
        <form
          onSubmit={handleSubmit(onSubmit)} // Fixed: removed arrow function
          className="space-y-2 mt-2"
        >
          <input
            {...register("subject")}
            placeholder="Subject"
            className="input w-full"
          />
          <input
            {...register("day")}
            placeholder="Day (e.g., Monday)"
            className="input w-full"
          />
          <div className="flex gap-2">
            <input
              {...register("startTime")}
              placeholder="Start"
              className="input w-full"
            />
            <input
              {...register("endTime")}
              placeholder="End"
              className="input w-full"
            />
          </div>
          <input
            {...register("instructor")}
            placeholder="Instructor"
            className="input w-full"
          />
          <input
            type="color"
            {...register("color")}
            defaultValue="#60A5FA"
            className="w-16 h-10 border"
          />
          <button type="submit" className="btn">
            Save
          </button>{" "}
          {/* Added type="submit" */}
        </form>
      </div>

      {/* Schedule List */}
      <div className="card p-4">
        <h3>Schedule</h3>
        <div className="mt-2 space-y-2">
          {list.map((s) => (
            <div
              key={s._id}
              className="flex items-center justify-between p-2 rounded"
              style={{ background: s.color || "#fff" }}
            >
              <div>
                <div className="font-semibold">{s.subject}</div>
                <div className="text-sm">
                  {s.day} • {s.startTime} - {s.endTime} • {s.instructor}
                </div>
              </div>
              <div className="space-x-2">
                <button className="btn btn-xs" onClick={() => openEdit(s)}>
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => onDelete(s._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="card bg-white p-4 w-96">
            <h3 className="font-semibold mb-2">Edit Class</h3>
            <form onSubmit={handleEditSubmit(onUpdate)} className="space-y-2">
              <input
                {...regEdit("subject")}
                placeholder="Subject"
                className="input w-full"
              />
              <input
                {...regEdit("day")}
                placeholder="Day"
                className="input w-full"
              />
              <div className="flex gap-2">
                <input
                  {...regEdit("startTime")}
                  placeholder="Start"
                  className="input w-full"
                />
                <input
                  {...regEdit("endTime")}
                  placeholder="End"
                  className="input w-full"
                />
              </div>
              <input
                {...regEdit("instructor")}
                placeholder="Instructor"
                className="input w-full"
              />
              <input
                type="color"
                {...regEdit("color")}
                className="w-16 h-10 border"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="btn btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  Update
                </button>{" "}
                {/* Added type="submit" */}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
