const pool = require('../config/db');

// Admin creates a question
exports.createQuestion = async (req, res) => {
  try {
    const { skill_id, question_text, options, correct_option } = req.body;

    if (!skill_id || !question_text || !options || !correct_option)
      return res.status(400).json({ message: "Missing fields" });

    if (!options.includes(correct_option))
      return res.status(400).json({ message: "Correct option must match options" });

    const [result] = await pool.execute(
      "INSERT INTO questions (skill_id, question_text, options, correct_option) VALUES (?,?,?,?)",
      [skill_id, question_text.trim(), JSON.stringify(options), correct_option.trim()]
    );

    res.status(201).json({ message: "Question created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get questions for users
exports.getQuestions = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM questions");

    const filtered = rows.map(q => {
      let optionsArr;

      if (typeof q.options === 'string') {
        try {
          optionsArr = JSON.parse(q.options);
        } catch {
          optionsArr = q.options.split(',');
        }
      } else if (Array.isArray(q.options)) {
        optionsArr = q.options;
      } else {
        optionsArr = [];
      }

      if (req.user.role === 'user') {
        return { id: q.id, question_text: q.question_text, options: optionsArr, skill_id: q.skill_id };
      }

      return { ...q, options: optionsArr };
    });

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
