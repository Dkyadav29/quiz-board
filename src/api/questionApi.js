export const addQuestion = async (questionData, token) => {
  const res = await fetch("http://localhost:4000/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(questionData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add question");
  }

  return res.json();
};

export const getQuestions = async (token) => {
  const res = await fetch("http://localhost:4000/api/questions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch questions");
  }

  return res.json();
};
