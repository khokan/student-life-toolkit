import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  PieChart,
} from "lucide-react";

export default function BudgetStats({ budgets }) {
  const stats = {
    totalIncome: budgets
      .filter((b) => b.type === "income")
      .reduce((sum, b) => sum + b.amount, 0),
    totalExpense: budgets
      .filter((b) => b.type === "expense")
      .reduce((sum, b) => sum + b.amount, 0),
    balance:
      budgets
        .filter((b) => b.type === "income")
        .reduce((sum, b) => sum + b.amount, 0) -
      budgets
        .filter((b) => b.type === "expense")
        .reduce((sum, b) => sum + b.amount, 0),
    transactions: budgets.length,
    thisMonth: {
      income: budgets
        .filter((b) => b.type === "income" && isThisMonth(new Date(b.date)))
        .reduce((sum, b) => sum + b.amount, 0),
      expense: budgets
        .filter((b) => b.type === "expense" && isThisMonth(new Date(b.date)))
        .reduce((sum, b) => sum + b.amount, 0),
    },
  };

  function isThisMonth(date) {
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Income */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Total Income</p>
            <p className="text-2xl font-bold text-success">
              ${stats.totalIncome.toFixed(2)}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-success/60" />
        </div>
      </div>

      {/* Total Expense */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Total Expense</p>
            <p className="text-2xl font-bold text-error">
              ${stats.totalExpense.toFixed(2)}
            </p>
          </div>
          <TrendingDown className="w-8 h-8 text-error/60" />
        </div>
      </div>

      {/* Balance */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Balance</p>
            <p
              className={`text-2xl font-bold ${
                stats.balance >= 0 ? "text-success" : "text-error"
              }`}
            >
              ${stats.balance.toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-info/60" />
        </div>
      </div>

      {/* This Month */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">This Month</p>
            <p className="text-lg font-bold text-warning">
              +${stats.thisMonth.income.toFixed(2)}
            </p>
            <p className="text-sm text-error">
              -${stats.thisMonth.expense.toFixed(2)}
            </p>
          </div>
          <Calendar className="w-8 h-8 text-warning/60" />
        </div>
      </div>

      {/* Total Transactions */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Transactions</p>
            <p className="text-2xl font-bold text-info">{stats.transactions}</p>
          </div>
          <PieChart className="w-8 h-8 text-info/60" />
        </div>
      </div>
    </div>
  );
}
