const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/results', resultRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Sports Meet API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
