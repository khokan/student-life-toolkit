import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { plannerSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function PlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      slots: [{ day: "", startTime: "", endTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axiosSecure.get("/api/planner");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitError("");
      // Transform deadline to Date for server
      data.deadline = new Date(data.deadline);
      const res = await axiosSecure.post("/api/planner", data);
      reset();
      fetchTasks();
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📝 Study Planner</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 max-w-xl"
      >
        <input
          {...register("subject")}
          placeholder="Subject"
          className="input input-bordered"
        />
        {errors.subject && (
          <p className="text-red-500">{errors.subject.message}</p>
        )}

        <input
          {...register("topic")}
          placeholder="Topic"
          className="input input-bordered"
        />
        {errors.topic && <p className="text-red-500">{errors.topic.message}</p>}

        <select {...register("priority")} className="select select-bordered">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && (
          <p className="text-red-500">{errors.priority.message}</p>
        )}

        <input
          {...register("deadline")}
          type="datetime-local"
          className="input input-bordered"
        />
        {errors.deadline && (
          <p className="text-red-500">{errors.deadline.message}</p>
        )}

        <div className="border p-2 rounded">
          <h3 className="font-semibold mb-1">Slots</h3>
          {fields.map((slot, index) => (
            <div key={slot.id} className="flex gap-2 mb-2 items-center">
              <input
                {...register(`slots.${index}.day`)}
                placeholder="Day"
                className="input input-bordered"
              />
              <input
                {...register(`slots.${index}.startTime`)}
                type="time"
                className="input input-bordered"
              />
              <input
                {...register(`slots.${index}.endTime`)}
                type="time"
                className="input input-bordered"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-sm btn-error"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ day: "", startTime: "", endTime: "" })}
            className="btn btn-sm btn-outline mt-1"
          >
            Add Slot
          </button>
          {errors.slots && (
            <p className="text-red-500">{errors.slots.message}</p>
          )}
        </div>

        {submitError && <p className="text-red-600">{submitError}</p>}

        <button className="btn btn-primary mt-2">Add Task</button>
      </form>

      <h3 className="text-lg font-semibold mt-6">Existing Tasks</h3>
      <div className="mt-2 space-y-2">
        {tasks.map((task) => (
          <div key={task._id} className="card p-3 border rounded shadow-sm">
            <p>
              <strong>Subject:</strong> {task.subject}
            </p>
            <p>
              <strong>Topic:</strong> {task.topic}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toLocaleString()}
            </p>
            <p>
              <strong>Slots:</strong>
            </p>
            <ul className="list-disc list-inside">
              {task.slots.map((s, i) => (
                <li key={i}>
                  {s.day}: {s.startTime} - {s.endTime}
                </li>
              ))}
            </ul>
            <p>
              <strong>Completed:</strong> {task.isCompleted ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
