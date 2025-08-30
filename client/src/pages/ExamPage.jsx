import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema } from "../schemas/zodSchemas";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
  });

  const selectedType = watch("type");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/api/exam");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosSecure.post("/api/exam", data);
      reset();
      fetchQuestions();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📝 Exam Q&A Generator</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mb-6"
      >
        {/* Type */}
        <select {...register("type")} className="select select-bordered">
          <option value="mcq">MCQ</option>
          <option value="short">Short</option>
          <option value="tf">True/False</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}

        {/* Difficulty */}
        <select {...register("difficulty")} className="select select-bordered">
          <option value="">Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Prompt */}
        <input
          {...register("prompt")}
          placeholder="Question prompt"
          className="input input-bordered"
        />
        {errors.prompt && (
          <p className="text-red-500">{errors.prompt.message}</p>
        )}

        {/* Dynamic fields */}
        {selectedType === "mcq" && (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Options (check one correct)</p>

            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  {...register(`options.${i}`)}
                  placeholder={`Option ${i + 1}`}
                  className="input input-bordered"
                />
                <input
                  type="radio"
                  value={watch(`options.${i}`)} // value = whatever option text is typed
                  {...register("answer")}
                  className="radio radio-primary"
                />
                <span className="text-sm">Correct</span>
              </div>
            ))}

            {errors.options && (
              <p className="text-red-500">{errors.options.message}</p>
            )}
            {errors.answer && (
              <p className="text-red-500">{errors.answer.message}</p>
            )}
          </div>
        )}

        {selectedType === "short" && (
          <input
            {...register("answer")}
            placeholder="Expected short answer"
            className="input input-bordered"
          />
        )}

        {selectedType === "tf" && (
          <select {...register("answer")} className="select select-bordered">
            <option value="">Select answer</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        )}
        {errors.answer && (
          <p className="text-red-500">{errors.answer.message}</p>
        )}

        <button className="btn btn-primary mt-2">Add Question</button>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-6">
          {questions.map((q) => (
            <li key={q._id}>
              <strong>{q.prompt}</strong> ({q.type})
              {q.difficulty && ` - ${q.difficulty}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
