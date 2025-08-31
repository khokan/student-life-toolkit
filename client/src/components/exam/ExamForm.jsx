import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { examSchema } from "../../schemas/zodSchemas";

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
    },
  });

  const selectedType = watch("type");
  const options = watch("options") || [];

  // Pre-fill form when editing
  useEffect(() => {
    if (question) {
      setValue("type", question.type);
      setValue("difficulty", question.difficulty);
      setValue("prompt", question.prompt);
      setValue("answer", question.answer);

      if (question.type === "mcq" && question.options) {
        question.options.forEach((option, index) => {
          setValue(`options.${index}`, option);
        });
      }
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
  }, [question, setValue, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Question Type */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Question Type</span>
        </label>
        <select
          {...register("type")}
          className="select select-bordered"
          disabled={isLoading}
        >
          <option value="mcq">Multiple Choice (MCQ)</option>
          <option value="short">Short Answer</option>
          <option value="tf">True/False</option>
        </select>
        {errors.type && (
          <span className="text-error text-sm mt-1">{errors.type.message}</span>
        )}
      </div>

      {/* Difficulty Level */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Difficulty Level</span>
        </label>
        <select
          {...register("difficulty")}
          className="select select-bordered"
          disabled={isLoading}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Question Prompt */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Question Prompt</span>
        </label>
        <textarea
          {...register("prompt")}
          placeholder="Enter your question here..."
          className="textarea textarea-bordered h-24"
          rows={3}
          disabled={isLoading}
        />
        {errors.prompt && (
          <span className="text-error text-sm mt-1">
            {errors.prompt.message}
          </span>
        )}
      </div>

      {/* Dynamic Fields based on Question Type */}
      {selectedType === "mcq" && (
        <div className="space-y-3">
          <label className="label">
            <span className="label-text font-semibold">
              Multiple Choice Options
            </span>
            <span className="label-text-alt text-warning">
              * Check the correct answer
            </span>
          </label>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                {...register(`options.${index}`)}
                placeholder={`Option ${index + 1}`}
                className="input input-bordered flex-1"
                disabled={isLoading}
              />
              <input
                type="radio"
                {...register("answer")}
                value={options[index] || ""}
                className="radio radio-primary"
                disabled={isLoading || !options[index]}
              />
              <span className="text-sm text-gray-500 w-16">Correct</span>
            </div>
          ))}
          {errors.options && (
            <span className="text-error text-sm mt-1">
              {errors.options.message}
            </span>
          )}
          {errors.answer && (
            <span className="text-error text-sm mt-1">
              {errors.answer.message}
            </span>
          )}
        </div>
      )}

      {selectedType === "short" && (
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Expected Answer</span>
          </label>
          <textarea
            {...register("answer")}
            placeholder="Enter the expected answer..."
            className="textarea textarea-bordered"
            rows={2}
            disabled={isLoading}
          />
          {errors.answer && (
            <span className="text-error text-sm mt-1">
              {errors.answer.message}
            </span>
          )}
        </div>
      )}

      {selectedType === "tf" && (
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Correct Answer</span>
          </label>
          <select
            {...register("answer")}
            className="select select-bordered"
            disabled={isLoading}
          >
            <option value="">Select correct answer</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {errors.answer && (
            <span className="text-error text-sm mt-1">
              {errors.answer.message}
            </span>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="modal-action">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {question ? "Updating..." : "Adding..."}
            </>
          ) : question ? (
            "Update Question"
          ) : (
            "Add Question"
          )}
        </button>
      </div>
    </form>
  );
}
