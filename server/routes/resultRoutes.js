const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getResultsBySport,
    getAllResults,
    createResult,
    updateResult,
    deleteResult
} = require('../controllers/resultController');

// Public routes
router.get('/sport/:sportId', getResultsBySport);

// Admin routes (protected)
router.get('/', authMiddleware, getAllResults);
router.post('/', authMiddleware, createResult);
router.put('/:id', authMiddleware, updateResult);
router.delete('/:id', authMiddleware, deleteResult);

module.exports = router;
