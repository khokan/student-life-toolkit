import {
  Trash2,
  Edit2,
  Play,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

/**
 * ExamList - Displays list of exam questions with actions
 * Supports filtering, deletion, and practice mode initiation
 */
export default function ExamList({ questions, onDelete, isLoading }) {
  if (questions.length === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center border border-base-300">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-500 mb-2">
          No questions found
        </h3>
        <p className="text-gray-400">
          Create your first question to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Questions ({questions.length})
        </h2>
        <button className="btn btn-outline btn-sm gap-2">
          <Play className="w-4 h-4" />
          Practice Mode
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question._id}
            className="card bg-base-200 shadow-sm border border-base-300 p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`badge badge-sm ${
                      question.type === "mcq"
                        ? "badge-primary"
                        : question.type === "short"
                        ? "badge-secondary"
                        : "badge-accent"
                    }`}
                  >
                    {question.type.toUpperCase()}
                  </span>
                  <span
                    className={`badge badge-sm ${
                      question.difficulty === "easy"
                        ? "badge-success"
                        : question.difficulty === "medium"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-base-content mb-2">
                  {question.prompt}
                </h3>
                {question.type === "mcq" && question.options && (
                  <div className="space-y-1 mb-2">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {option === question.answer ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <div className="w-4 h-4" />
                        )}
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                {question.type !== "mcq" && (
                  <p className="text-sm text-base-content/60">
                    Answer: {question.answer}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button className="btn btn-sm btn-outline btn-circle">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(question._id)}
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
