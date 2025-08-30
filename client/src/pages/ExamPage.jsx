import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema } from "../schemas/zodSchemas";
import { z } from "zod";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(examSchema),
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await axiosSecure.get("/api/exam");
    setQuestions(res.data);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    await axiosSecure.post("/api/exam", data);
    reset();
    fetchQuestions();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📝 Exam Q&A Generator</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mb-6"
      >
        <select {...register("type")} className="select select-bordered">
          <option value="mcq">MCQ</option>
          <option value="short">Short</option>
          <option value="tf">True/False</option>
        </select>
        <select {...register("difficulty")} className="select select-bordered">
          <option value="">Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          {...register("prompt")}
          placeholder="Question prompt"
          className="input input-bordered"
        />
        <input
          {...register("answer")}
          placeholder="Answer"
          className="input input-bordered"
        />
        <button className="btn btn-primary">Add Question</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-6">
          {questions.map((q) => (
            <li key={q._id}>
              {q.prompt} ({q.type}) - {q.difficulty}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
