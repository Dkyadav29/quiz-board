export const getSkills = async (token) => {
  const res = await fetch("http://localhost:4000/api/skills", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch skills");
  }

  return res.json();
};
