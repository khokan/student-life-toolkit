import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/budget"); // match your backend route
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitError("");
      await axiosSecure.post("/api/budget", data);
      reset();
      fetchBudgets();
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">💰 Budget Tracker</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mb-6 max-w-md"
      >
        <select {...register("type")} className="select select-bordered">
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}

        <input
          {...register("amount", { valueAsNumber: true })}
          type="number"
          placeholder="Amount"
          className="input input-bordered"
        />
        {errors.amount && (
          <p className="text-red-500">{errors.amount.message}</p>
        )}

        <input
          {...register("description")}
          placeholder="Description"
          className="input input-bordered"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <input
          {...register("date")}
          type="datetime-local"
          className="input input-bordered"
        />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}

        {submitError && <p className="text-red-600">{submitError}</p>}

        <button className="btn btn-primary mt-2">Add Budget</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b._id}>
                <td>{b.type}</td>
                <td>{b.amount}</td>
                <td>{b.description}</td>
                <td>{new Date(b.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
