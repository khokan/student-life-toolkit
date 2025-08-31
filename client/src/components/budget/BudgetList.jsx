import {
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

export default function BudgetList({ budgets, onEdit, onDelete, isLoading }) {
  if (budgets.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center border border-base-300">
        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-base-content/40" />
        </div>
        <h3 className="text-lg font-semibold text-base-content/60 mb-2">
          No transactions found
        </h3>
        <p className="text-base-content/40">
          Add your first transaction to start tracking your budget
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Transactions ({budgets.length})
        </h2>
        <div className="text-sm text-base-content/60">
          Sorted by: Most Recent
        </div>
      </div>

      <div className="space-y-3">
        {budgets.map((transaction) => (
          <div
            key={transaction._id}
            className="card bg-base-200 shadow-sm border border-base-300 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {transaction.type === "income" ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-error" />
                  )}
                  <span
                    className={`badge badge-sm ${
                      transaction.type === "income"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {transaction.type}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-base-content/60">
                    <Calendar className="w-3 h-3" />
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className={`text-lg font-bold ${
                      transaction.type === "income"
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    ${transaction.amount.toFixed(2)}
                  </span>
                  <p className="text-base-content/80">
                    {transaction.description}
                  </p>
                </div>

                {transaction.category && (
                  <span className="badge badge-outline badge-sm">
                    {transaction.category}
                  </span>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(transaction)}
                  className="btn btn-sm btn-outline btn-circle"
                  disabled={isLoading}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(transaction._id)}
                  className="btn btn-sm btn-outline btn-circle btn-error"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
