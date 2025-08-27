import React, { useState } from "react";
import { addQuestion } from "../api/questionApi";
import { getToken } from "../utils/auth";

const AddQuestion = () => {
  const [skillId, setSkillId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
    if (!newOptions.includes(correctOption)) setCorrectOption("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillNumber = Number(skillId);
    const trimmedQuestion = questionText.trim();
    const trimmedOptions = options.map(opt => opt.trim()).filter(opt => opt !== "");
    const trimmedCorrectOption = correctOption.trim();

    if (isNaN(skillNumber) || !trimmedQuestion || trimmedOptions.length < 2 || !trimmedCorrectOption) {
      alert("All fields are required and at least 2 options must be provided.");
      return;
    }

    if (!trimmedOptions.includes(trimmedCorrectOption)) {
      alert("Correct option must match one of the provided options.");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("You must be logged in to add a question.");
      return;
    }

    setLoading(true);
    try {
      await addQuestion(
        {
          skill_id: skillNumber,
          question_text: trimmedQuestion,
          options: trimmedOptions,
          correct_option: trimmedCorrectOption,
        },
        token
      );
      alert("Question added successfully!");
      setSkillId("");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectOption("");
    } catch (err) {
      console.error("Backend error:", err.message);
      alert(err.message || "Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add Question</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="number" placeholder="Skill ID" value={skillId} onChange={e => setSkillId(e.target.value)} className="p-2 border rounded" required />
        <input type="text" placeholder="Question Text" value={questionText} onChange={e => setQuestionText(e.target.value)} className="p-2 border rounded" required />
        {options.map((opt, idx) => (
          <input key={idx} type="text" placeholder={`Option ${idx+1}`} value={opt} onChange={e => handleOptionChange(idx, e.target.value)} className="p-2 border rounded" required />
        ))}
        <select value={correctOption} onChange={e => setCorrectOption(e.target.value)} className="p-2 border rounded" required>
          <option value="">Select Correct Option</option>
          {options.filter(opt => opt.trim() !== "").map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
        <button type="submit" disabled={loading} className={`p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
