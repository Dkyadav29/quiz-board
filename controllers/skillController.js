const pool = require("../config/db");

// Create a new skill
exports.createSkill = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Both name and description are required" });
    }

    // Insert into DB
    const [rows] = await pool.execute(
      "INSERT INTO skills (name, description) VALUES (?, ?)",
      [name.trim(), description.trim()] // ✅ trim to avoid accidental spaces
    );

    return res
      .status(201)
      .json({ message: "Skill created successfully", skillId: rows.insertId });
  } catch (err) {
    console.error("Error creating skill:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Fetch all skills
exports.getSkills = async (req, res) => {
  try {
    const [skills] = await pool.execute("SELECT * FROM skills ORDER BY id DESC");
    return res.json(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
