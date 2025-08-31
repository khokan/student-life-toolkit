import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetList from "../components/budget/BudgetList";
import BudgetStats from "../components/budget/BudgetStats";
import BudgetChart from "../components/budget/BudgetChart";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import {
  DollarSign,
  Plus,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  PieChart,
  BarChart3,
} from "lucide-react";

/**
 * BudgetPage - Main component for managing financial transactions
 * Features: CRUD operations, income/expense tracking, charts, and financial analytics
 */
export default function BudgetPage() {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [dateRange, setDateRange] = useState("all");
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // Fetch budgets with React Query
  const {
    data: budgets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/budget");
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    retry: 2,
  });

  // Create transaction mutation
  const createMutation = useMutation({
    mutationFn: (newTransaction) =>
      axiosSecure.post("/api/budget", newTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries(["budgets"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Create transaction failed:", error);
    },
  });

  // Update transaction mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.put(`/api/budget/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["budgets"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Update transaction failed:", error);
    },
  });

  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/budget/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["budgets"]);
    },
    onError: (error) => {
      console.error("Delete transaction failed:", error);
    },
  });

  // Filter transactions based on selected criteria
  const filteredBudgets = budgets.filter((transaction) => {
    const typeMatch =
      selectedFilter === "all" || transaction.type === selectedFilter;

    // Date range filtering
    let dateMatch = true;
    if (dateRange !== "all") {
      const transactionDate = new Date(transaction.date);
      const now = new Date();

      switch (dateRange) {
        case "today":
          dateMatch = transactionDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          dateMatch = transactionDate >= weekStart;
          break;
        case "month":
          dateMatch =
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear();
          break;
        default:
          dateMatch = true;
      }
    }

    return typeMatch && dateMatch;
  });

  // Open modal for editing
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    document.getElementById("budget_modal").showModal();
  };

  // Open modal for creating new transaction
  const handleCreate = () => {
    setEditingTransaction(null);
    document.getElementById("budget_modal").showModal();
  };

  // Close modal and reset editing state
  const closeModal = () => {
    setEditingTransaction(null);
    document.getElementById("budget_modal").close();
  };

  // Handle form submission for both create and update
  const handleSubmit = (data) => {
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Export data function
  const handleExport = () => {
    const csvContent = [
      ["Type", "Amount", "Description", "Date"],
      ...filteredBudgets.map((t) => [
        t.type,
        t.amount,
        t.description,
        new Date(t.date).toLocaleDateString(),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading financial data..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-error mb-2">
            Failed to load transactions
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
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-base-content">
                    Budget Tracker
                  </h1>
                  <p className="text-base-content/60">
                    Manage your income and expenses with powerful analytics
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="btn btn-primary gap-2"
                disabled={createMutation.isLoading}
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <BudgetStats budgets={budgets} />

          {/* Chart Section */}
          <BudgetChart
            budgets={budgets}
            chartType={selectedChartType}
            dateRange={dateRange}
          />

          {/* Filters and Controls Section */}
          <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Type Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Transaction Type
                  </span>
                </label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Transactions</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Date Range</span>
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Chart Type Selector */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Chart Type</span>
                </label>
                <select
                  value={selectedChartType}
                  onChange={(e) => setSelectedChartType(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedFilter("all");
                    setDateRange("all");
                  }}
                  className="btn btn-ghost flex-1"
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleExport}
                  className="btn btn-outline gap-2"
                  disabled={filteredBudgets.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <BudgetList
            budgets={filteredBudgets}
            onEdit={handleEdit}
            onDelete={deleteMutation.mutate}
            isLoading={deleteMutation.isLoading}
          />

          {/* Add/Edit Transaction Modal */}
          <dialog id="budget_modal" className="modal">
            <div className="modal-box max-w-md">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </form>
              <h3 className="text-xl font-bold mb-6">
                {editingTransaction
                  ? "Edit Transaction"
                  : "Add New Transaction"}
              </h3>
              <BudgetForm
                transaction={editingTransaction}
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
