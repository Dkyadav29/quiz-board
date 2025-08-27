import React, { useEffect, useState } from "react";
import { getQuestions } from "../api/questionApi";
import { getToken } from "../utils/auth";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const QUESTIONS_PER_PAGE = 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");

      try {
        const token = getToken();
        if (!token) {
          setError("You must be logged in to view questions.");
          return;
        }

        const res = await getQuestions(token);
        setQuestions(res || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err?.message || "Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let totalScore = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) totalScore += 1;
    });

    setScore(totalScore);
  };

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  if (loading) return <p className="text-center mt-8">Loading questions...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (questions.length === 0) return <p className="text-center mt-8">No questions found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Exam Questions</h1>

      {currentQuestions.map((q, index) => (
        <div key={q.id} className="mb-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="font-semibold text-lg mb-3">
            {startIndex + index + 1}. {q.question_text}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center space-x-3 p-2 border rounded cursor-pointer 
                  ${score !== null && q.correct_option === opt ? "bg-green-100 border-green-400" : ""}
                  ${score !== null && answers[q.id] === opt && answers[q.id] !== q.correct_option ? "bg-red-100 border-red-400" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt}
                  disabled={score !== null}
                  checked={answers[q.id] === opt}
                  onChange={() => handleOptionChange(q.id, opt)}
                  className="form-radio text-blue-600"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || score !== null}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || score !== null}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Submit & Score */}
      <div className="text-center mt-6">
        {score === null ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition-colors"
          >
            Submit Answers
          </button>
        ) : (
          <p className="text-xl font-bold text-blue-700">
            Your Score: {score} / {questions.length}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionsList;
