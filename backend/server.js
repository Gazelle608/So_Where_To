require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes.js');
const authenticateToken = require('./middleware/authMiddleware.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello user ${req.user.id}, you are authenticated!` });
});

const PORT = 5173;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`, `http://localhost:${PORT}`));
