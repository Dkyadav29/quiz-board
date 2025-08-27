const pool = require('../config/db');

exports.submitQuiz = async (req, res) => {
  try {
    const { user_id, skill_id, answers } = req.body; 
    // answers = [{ question_id, selected_option }]

    if (!user_id || !skill_id || !answers) 
      return res.status(400).json({ message: "Missing fields" });

    // Fetch questions for this skill
    const [questions] = await pool.execute("SELECT * FROM questions WHERE skill_id = ?", [skill_id]);

    let score = 0;
    const correctAnswers = {};

    questions.forEach(q => {
      correctAnswers[q.id] = q.correct_option;
    });

    answers.forEach(a => {
      if (correctAnswers[a.question_id] === a.selected_option) score++;
    });

    await pool.execute(
      "INSERT INTO quiz_attempts (user_id, skill_id, selected_answers, score) VALUES (?,?,?,?)",
      [user_id, skill_id, JSON.stringify(answers), score]
    );

    res.json({ message: "Quiz submitted", score, total: questions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getQuizAttempts = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM quiz_attempts WHERE user_id = ?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
