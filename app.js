const express = require('express');
require('dotenv').config();
const app = express();
const cors = require("cors");   // 👈 add this line


const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const questionRoutes = require('./routes/questionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const reportRoutes = require('./routes/reportRoutes');
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/reports', reportRoutes);

// ✅ test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working ✅' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
