import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  Type,
  Filter,
  Download
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function BudgetPage() {
  const [editingBudget, setEditingBudget] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch budgets with React Query
  const {
    data: budgets = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/budget");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newBudget) => axiosSecure.post("/api/budget", newBudget),
    onSuccess: (response) => {
      // Optimistic update
      queryClient.setQueryData(["budgets"], (old) => [
        ...(old || []),
        response.data,
      ]);
      setShowAddModal(false);
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.put(`/api/budget/${id}`, data),
    onSuccess: (response, variables) => {
      // Optimistic update
      queryClient.setQueryData(["budgets"], (old) =>
        (old || []).map((budget) =>
          budget._id === variables.id ? response.data : budget
        )
      );
      setEditingBudget(null);
      setShowAddModal(false);
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/budget/${id}`),
    onSuccess: (_, deletedId) => {
      // Optimistic update
      queryClient.setQueryData(["budgets"], (old) =>
        (old || []).filter((budget) => budget._id !== deletedId)
      );
    },
    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(budgetSchema),
  });

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setValue("type", budget.type);
    setValue("amount", budget.amount);
    setValue("description", budget.description);
    setValue("date", new Date(budget.date).toISOString().slice(0, 16));
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingBudget) {
      updateMutation.mutate({ id: editingBudget._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingBudget(null);
    reset();
  };

  const filteredBudgets = budgets.filter(budget => 
    filter === "all" || budget.type === filter
  );

  const totalIncome = budgets
    .filter(b => b.type === "income")
    .reduce((sum, b) => sum + b.amount, 0);

  const totalExpense = budgets
    .filter(b => b.type === "expense")
    .reduce((sum, b) => sum + b.amount, 0);

  const balance = totalIncome - totalExpense;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error loading budgets</div>
          <button
            onClick={() => queryClient.refetchQueries(["budgets"])}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Group data by date
const chartData = budgets.reduce((acc, b) => {
  const date = new Date(b.date).toLocaleDateString();

  if (!acc[date]) {
    acc[date] = { date, income: 0, expense: 0 };
  }

  if (b.type === "income") {
    acc[date].income += b.amount;
  } else {
    acc[date].expense += b.amount;
  }

  return acc;
}, {});

// Convert object → array sorted by date
const chartDataArray = Object.values(chartData).sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">💰 Budget Tracker</h1>
              <p className="text-gray-600">Manage your income and expenses effectively</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary gap-2"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards - These update automatically */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Balance</p>
                <p className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${balance.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

{/* Chart Section */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
  <h2 className="text-lg font-bold text-gray-800 mb-4">Income vs Expense Over Time</h2>
  <div className="w-full h-80">
    <ResponsiveContainer>
      <LineChart data={chartDataArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#16a34a" // green
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#dc2626" // red
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="select select-bordered"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
        </div>

        {/* Budgets Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBudgets.map((budget) => (
                  <tr key={budget._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {budget.type === "income" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`badge badge-lg ${
                          budget.type === "income" 
                            ? "badge-success" 
                            : "badge-error"
                        }`}>
                          {budget.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-semibold ${
                        budget.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        ${budget.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{budget.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(budget.date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="btn btn-sm btn-outline btn-circle hover:btn-primary"
                          title="Edit"
                          disabled={updateMutation.isPending || deleteMutation.isPending}
                        >
                          {updateMutation.isPending && updateMutation.variables?.id === budget._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Edit3 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(budget._id)}
                          className="btn btn-sm btn-outline btn-circle hover:btn-error"
                          title="Delete"
                          disabled={deleteMutation.isPending || updateMutation.isPending}
                        >
                          {deleteMutation.isPending && deleteMutation.variables === budget._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBudgets.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-400">
                {filter === "all" 
                  ? "Add your first transaction to get started" 
                  : `No ${filter} transactions found`}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingBudget ? "Edit Transaction" : "Add New Transaction"}
                </h3>
                <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Type
                    </span>
                  </label>
                  <select 
                    {...register("type")} 
                    className="select select-bordered w-full"
                    disabled={isSubmitting}
                  >
                    <option value="">Select type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  {errors.type && (
                    <span className="text-error text-sm mt-1">{errors.type.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </span>
                  </label>
                  <input
                    {...register("amount", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
                  />
                  {errors.amount && (
                    <span className="text-error text-sm mt-1">{errors.amount.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </span>
                  </label>
                  <input
                    {...register("description")}
                    placeholder="Enter description"
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <span className="text-error text-sm mt-1">{errors.description.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date & Time
                    </span>
                  </label>
                  <input
                    {...register("date")}
                    type="datetime-local"
                    className="input input-bordered w-full"
                    disabled={isSubmitting}
                  />
                  {errors.date && (
                    <span className="text-error text-sm mt-1">{errors.date.message}</span>
                  )}
                </div>

                <div className="modal-action">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="btn btn-ghost"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {editingBudget ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingBudget ? "Update Transaction" : "Add Transaction"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}