import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import authenticateToken from './middleware/authMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello user ${req.user.id}, you are authenticated!` });
});

const PORT = 5173;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`, `http://localhost:${PORT}`));  