import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { examSchema } from "../../schemas/zodSchemas";

import { 
  Loader2, 
  X, 
  BookOpen, 
  TypeIcon, 
  BarChart3, 
  FileText, 
  HelpCircle, 
  List, 
  Star, 
  Edit3, 
  ClipboardCheck, 
  CheckCircle, 
  CheckSquare, 
  Save, 
  Plus 
} from "lucide-react";

export default function ExamForm({
  question,
  onSubmit,
  isLoading = false,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      type: "mcq",
      difficulty: "medium",
      options: ["", "", "", ""],
    },
  });

  const selectedType = watch("type");
  const options = watch("options") || [];
  const currentAnswer = watch("answer");

  // Pre-fill form when editing
  useEffect(() => {
    if (question) {
      // Reset form first to clear any previous values
      reset({
        type: question.type,
        difficulty: question.difficulty,
        prompt: question.prompt,
        answer: question.answer,
        options: question.options || ["", "", "", ""],
      });
    } else {
      // Reset form for new question
      reset({
        type: "mcq",
        difficulty: "medium",
        prompt: "",
        answer: "",
        options: ["", "", "", ""],
      });
    }
  }, [question, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
  {/* Header */}
  <div className="text-center mb-4">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3">
      <BookOpen className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800">
      {question ? "Edit Question" : "Create New Question"}
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      {question ? "Update your question details" : "Add a new question to your exam"}
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Question Type */}
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <div className="w-5 h-5 text-gray-500">
          <TypeIcon className="w-4 h-4" />
        </div>
        <span className="label-text font-semibold text-gray-700">Question Type</span>
      </label>
      <select
        {...register("type")}
        className="select select-bordered w-full bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary pl-9"
        disabled={isLoading}
      >
        <option value="mcq">Multiple Choice (MCQ)</option>
        <option value="short">Short Answer</option>
        <option value="tf">True/False</option>
      </select>
      {errors.type && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <X className="w-4 h-4" />
          {errors.type.message}
        </span>
      )}
    </div>

    {/* Difficulty Level */}
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <div className="w-5 h-5 text-gray-500">
          <BarChart3 className="w-4 h-4" />
        </div>
        <span className="label-text font-semibold text-gray-700">Difficulty Level</span>
      </label>
      <select
        {...register("difficulty")}
        className="select select-bordered w-full bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary pl-9"
        disabled={isLoading}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      {errors.difficulty && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <X className="w-4 h-4" />
          {errors.difficulty.message}
        </span>
      )}
    </div>
  </div>

  {/* Question Prompt */}
  <div className="form-control">
    <label className="label flex items-center gap-2 pb-2">
      <div className="w-5 h-5 text-gray-500">
        <FileText className="w-4 h-4" />
      </div>
      <span className="label-text font-semibold text-gray-700">Question Prompt</span>
    </label>
    <div className="relative">
      <textarea
        {...register("prompt")}
        placeholder="Enter your question here... Be specific and clear for best results."
        className="textarea textarea-bordered w-full h-28 resize-none bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary pl-9"
        rows={3}
        disabled={isLoading}
      />
      <HelpCircle className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
    </div>
    {errors.prompt && (
      <span className="text-error text-sm mt-2 flex items-center gap-2">
        <X className="w-4 h-4" />
        {errors.prompt.message}
      </span>
    )}
  </div>

  {/* Dynamic Fields based on Question Type */}
  {selectedType === "mcq" && (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <label className="label p-0 flex items-center gap-2">
          <div className="w-5 h-5 text-gray-500">
            <List className="w-4 h-4" />
          </div>
          <span className="label-text font-semibold text-gray-700">
            Multiple Choice Options
          </span>
        </label>
        <span className="text-xs text-warning bg-warning/10 px-3 py-1.5 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Select the correct answer
        </span>
      </div>
      
      <div className="space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  {...register(`options.${index}`)}
                  placeholder={`Option ${index + 1}`}
                  className="input input-bordered w-full bg-transparent border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary pl-8"
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm text-gray-500 font-medium">{index + 1}.</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 min-w-[120px] sm:min-w-[100px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("answer")}
                  value={options[index] || ""}
                  checked={currentAnswer === options[index]}
                  className="radio radio-primary radio-sm"
                  disabled={isLoading || !options[index]}
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">Correct</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 space-y-2">
        {errors.options && (
          <span className="text-error text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {errors.options.message}
          </span>
        )}
        {errors.answer && (
          <span className="text-error text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {errors.answer.message}
          </span>
        )}
      </div>
    </div>
  )}

  {selectedType === "short" && (
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <div className="w-5 h-5 text-gray-500">
          <Edit3 className="w-4 h-4" />
        </div>
        <span className="label-text font-semibold text-gray-700">Expected Answer</span>
      </label>
      <div className="relative">
        <textarea
          {...register("answer")}
          placeholder="Enter the expected answer... This will be used for auto-grading."
          className="textarea textarea-bordered w-full h-20 resize-none bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary pl-9"
          rows={2}
          disabled={isLoading}
        />
        <ClipboardCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
      </div>
      {errors.answer && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <X className="w-4 h-4" />
          {errors.answer.message}
        </span>
      )}
    </div>
  )}

  {selectedType === "tf" && (
    <div className="form-control">
      <label className="label flex items-center gap-2 pb-2">
        <div className="w-5 h-5 text-gray-500">
          <CheckCircle className="w-4 h-4" />
        </div>
        <span className="label-text font-semibold text-gray-700">Correct Answer</span>
      </label>
      <div className="relative">
        <select
          {...register("answer")}
          className="select select-bordered w-full bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary pl-9"
          disabled={isLoading}
        >
          <option value="">Select correct answer</option>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
        <CheckSquare className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      {errors.answer && (
        <span className="text-error text-sm mt-2 flex items-center gap-2">
          <X className="w-4 h-4" />
          {errors.answer.message}
        </span>
      )}
    </div>
  )}

  {/* Form Actions */}
  <div className="modal-action flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-200">
    <button
      type="button"
      onClick={onCancel}
      className="btn btn-ghost min-w-[120px] border border-gray-300 hover:bg-gray-50 order-2 sm:order-1 flex items-center gap-2"
      disabled={isLoading}
    >
      <X className="w-4 h-4" />
      Cancel
    </button>
    <button 
      type="submit" 
      className="btn btn-primary min-w-[140px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-0 text-white shadow-sm hover:shadow-md transition-all order-1 sm:order-2 flex items-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {question ? "Updating..." : "Creating..."}
        </>
      ) : question ? (
        <>
          <Save className="w-4 h-4" />
          Update Question
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Create Question
        </>
      )}
    </button>
  </div>
</form>
  );
}