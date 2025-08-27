const pool = require('../config/db');

// User-wise performance & skill gaps
exports.userPerformance = async (req, res) => {
  const { user_id } = req.params;
  const [rows] = await pool.query(
    `SELECT q.skill_id, s.name AS skill_name, 
            AVG(q.score/q.total_questions*100) AS avg_score
     FROM quiz_attempts q
     JOIN skills s ON q.skill_id = s.id
     WHERE q.user_id=?
     GROUP BY q.skill_id`, [user_id]
  );
  res.json(rows);
};

// Time-based performance (week/month)
exports.timeBasedPerformance = async (req, res) => {
  const { user_id, period } = req.query; // period=week or month
  const interval = period === 'month' ? 'MONTH' : 'WEEK';
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, SUM(score) as total_score, SUM(total_questions) as total_questions
     FROM quiz_attempts
     WHERE user_id=? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 ${interval})
     GROUP BY DATE(created_at)`, [user_id]
  );
  res.json(rows);
};
