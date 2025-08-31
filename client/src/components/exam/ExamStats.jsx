import { FileText, CheckCircle, XCircle, BarChart3 } from "lucide-react";

/**
 * ExamStats - Displays statistics about exam questions
 * Shows counts by type, difficulty, and overall metrics
 */
export default function ExamStats({ questions }) {
  const stats = {
    total: questions.length,
    byType: {
      mcq: questions.filter((q) => q.type === "mcq").length,
      short: questions.filter((q) => q.type === "short").length,
      tf: questions.filter((q) => q.type === "tf").length,
    },
    byDifficulty: {
      easy: questions.filter((q) => q.difficulty === "easy").length,
      medium: questions.filter((q) => q.difficulty === "medium").length,
      hard: questions.filter((q) => q.difficulty === "hard").length,
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Questions */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Total Questions</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </div>
          <FileText className="w-8 h-8 text-primary/60" />
        </div>
      </div>

      {/* MCQ Questions */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">MCQ Questions</p>
            <p className="text-2xl font-bold text-secondary">
              {stats.byType.mcq}
            </p>
          </div>
          <BarChart3 className="w-8 h-8 text-secondary/60" />
        </div>
      </div>

      {/* Short Answer */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">Short Answer</p>
            <p className="text-2xl font-bold text-accent">
              {stats.byType.short}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-accent/60" />
        </div>
      </div>

      {/* True/False */}
      <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">True/False</p>
            <p className="text-2xl font-bold text-warning">{stats.byType.tf}</p>
          </div>
          <XCircle className="w-8 h-8 text-warning/60" />
        </div>
      </div>
    </div>
  );
}
