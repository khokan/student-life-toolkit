import { useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
  "#16a34a",
  "#dc2626",
  "#2563eb",
  "#d97706",
  "#7c3aed",
  "#db2777",
];

export default function BudgetChart({
  budgets,
  chartType = "line",
  dateRange = "all",
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  // Process data for charts
  const processChartData = () => {
    if (chartType === "pie") {
      // For pie chart, group by category or type
      const typeData = [
        {
          name: "Income",
          value: budgets
            .filter((b) => b.type === "income")
            .reduce((sum, b) => sum + b.amount, 0),
        },
        {
          name: "Expense",
          value: budgets
            .filter((b) => b.type === "expense")
            .reduce((sum, b) => sum + b.amount, 0),
        },
      ];
      return typeData.filter((item) => item.value > 0);
    }

    // For line/bar charts, group by date
    const groupedData = budgets.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(groupedData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  const chartData = processChartData();

  if (chartData.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center border border-base-300">
        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-base-content/40" />
        </div>
        <h3 className="text-lg font-semibold text-base-content/60 mb-2">
          No chart data available
        </h3>
        <p className="text-base-content/40">
          Add transactions to see visual analytics
        </p>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "#f9fafb",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "#f9fafb",
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#16a34a" name="Income" />
            <Bar dataKey="expense" fill="#dc2626" name="Expense" />
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={activeIndex === index ? "#000" : "#fff"}
                  strokeWidth={activeIndex === index ? 2 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "#f9fafb",
              }}
            />
            <Legend />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Financial Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          {chartType === "line" && <TrendingUp className="w-4 h-4" />}
          {chartType === "bar" && <BarChart3 className="w-4 h-4" />}
          {chartType === "pie" && <PieChartIcon className="w-4 h-4" />}
          {chartType.toUpperCase()} Chart
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
