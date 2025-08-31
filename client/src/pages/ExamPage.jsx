import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";
import ExamForm from "../components/exam/ExamForm";
import ExamList from "../components/exam/ExamList";
import ExamStats from "../components/exam/ExamStats";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import { FileText, Plus, RefreshCw, AlertCircle, Edit2 } from "lucide-react";

export default function ExamPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // Fetch questions with React Query
  const {
    data: questions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exam-questions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/exam");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Create question mutation
  const createMutation = useMutation({
    mutationFn: (newQuestion) => axiosSecure.post("/api/exam", newQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries(["exam-questions"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Create question failed:", error);
    },
  });

  // Update question mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.put(`/api/exam/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["exam-questions"]);
      closeModal();
    },
    onError: (error) => {
      console.error("Update question failed:", error);
    },
  });

  // Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/exam/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["exam-questions"]);
    },
    onError: (error) => {
      console.error("Delete question failed:", error);
    },
  });

  // Open modal for editing
  const handleEdit = (question) => {
    setEditingQuestion(question);
    document.getElementById("exam_modal").showModal();
  };

  // Open modal for creating new question
  const handleCreate = () => {
    setEditingQuestion(null);
    document.getElementById("exam_modal").showModal();
  };

  // Close modal and reset editing state
  const closeModal = () => {
    setEditingQuestion(null);
    document.getElementById("exam_modal").close();
  };

  // Handle form submission for both create and update
  const handleSubmit = (data) => {
    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filter questions based on selected criteria
  const filteredQuestions = questions.filter((q) => {
    const typeMatch = selectedType === "all" || q.type === selectedType;
    const difficultyMatch =
      selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    return typeMatch && difficultyMatch;
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading exam questions..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-error mb-2">
            Failed to load questions
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-base-content">
                    Exam Q&A Generator
                  </h1>
                  <p className="text-base-content/60">
                    Create, manage, and practice with exam questions
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="btn btn-primary gap-2"
                disabled={createMutation.isLoading}
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <ExamStats questions={questions} />

          {/* Filters Section */}
          <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6 border border-base-300">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text font-semibold">
                    Filter by Type
                  </span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Types</option>
                  <option value="mcq">Multiple Choice</option>
                  <option value="short">Short Answer</option>
                  <option value="tf">True/False</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text font-semibold">
                    Filter by Difficulty
                  </span>
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedDifficulty("all");
                  }}
                  className="btn btn-ghost"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <ExamList
            questions={filteredQuestions}
            onEdit={handleEdit}
            onDelete={deleteMutation.mutate}
            isLoading={deleteMutation.isLoading}
          />

          {/* Add/Edit Question Modal */}
          <dialog id="exam_modal" className="modal">
            <div className="modal-box max-w-2xl">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </form>
              <h3 className="text-xl font-bold mb-6">
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h3>
              <ExamForm
                question={editingQuestion}
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
