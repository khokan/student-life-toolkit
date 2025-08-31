import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, DollarSign, FileText, Calendar, Type } from "lucide-react";
import { useEffect } from "react";
import { budgetSchema } from "../../schemas/zodSchemas";

export default function BudgetForm({
  transaction,
  onSubmit,
  isLoading = false,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      type: "expense",
    },
  });

  const selectedType = watch("type");

  // Pre-fill form when editing
  useEffect(() => {
    if (transaction) {
      setValue("type", transaction.type);
      setValue("amount", transaction.amount);
      setValue("description", transaction.description);
      setValue(
        "date",
        transaction.date
          ? new Date(transaction.date).toISOString().slice(0, 16)
          : ""
      );
    } else {
      // Reset form for new transaction
      reset({
        type: "expense",
        amount: "",
        description: "",
        date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [transaction, setValue, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Transaction Type */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <Type className="w-4 h-4" />
            Type *
          </span>
        </label>
        <select
          {...register("type")}
          className="select select-bordered w-full"
          disabled={isLoading}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && (
          <span className="text-error text-sm mt-1">{errors.type.message}</span>
        )}
      </div>

      {/* Amount */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Amount *
          </span>
        </label>
        <input
          {...register("amount", { valueAsNumber: true })}
          type="number"
          step="0.01"
          placeholder="0.00"
          className="input input-bordered w-full"
          disabled={isLoading}
        />
        {errors.amount && (
          <span className="text-error text-sm mt-1">
            {errors.amount.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Description *
          </span>
        </label>
        <input
          {...register("description")}
          placeholder="Enter description"
          className="input input-bordered w-full"
          disabled={isLoading}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Date */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date & Time *
          </span>
        </label>
        <input
          {...register("date")}
          type="datetime-local"
          className="input input-bordered w-full"
          disabled={isLoading}
        />
        {errors.date && (
          <span className="text-error text-sm mt-1">{errors.date.message}</span>
        )}
      </div>

      {/* Amount Preview */}
      {watch("amount") && (
        <div
          className={`p-3 rounded-lg border-2 ${
            selectedType === "income"
              ? "border-success bg-success/10 text-success"
              : "border-error bg-error/10 text-error"
          }`}
        >
          <div className="text-sm font-semibold">
            {selectedType === "income" ? "Income" : "Expense"}:
            <span className="ml-2">
              ${parseFloat(watch("amount") || 0).toFixed(2)}
            </span>
          </div>
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
              {transaction ? "Updating..." : "Adding..."}
            </>
          ) : transaction ? (
            "Update Transaction"
          ) : (
            "Add Transaction"
          )}
        </button>
      </div>
    </form>
  );
}
