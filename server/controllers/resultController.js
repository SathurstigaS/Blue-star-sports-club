const db = require('../config/db');

// Get results by sport ID
const getResultsBySport = async (req, res) => {
    try {
        const { sportId } = req.params;
        const [rows] = await db.query(
            `SELECT r.*, s.name as sport_name, s.gender, ac.name as age_category_name
             FROM results r
             JOIN sports s ON r.sport_id = s.id
             JOIN age_categories ac ON s.age_category_id = ac.id
             WHERE r.sport_id = ?`,
            [sportId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all results (admin)
const getAllResults = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.*, s.name as sport_name, s.gender, ac.name as age_category_name
            FROM results r
            JOIN sports s ON r.sport_id = s.id
            JOIN age_categories ac ON s.age_category_id = ac.id
            ORDER BY ac.id, s.gender, s.name
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create result
const createResult = async (req, res) => {
    try {
        const { sport_id, gold_winner, silver_winner, bronze_winner } = req.body;
        const [result] = await db.query(
            'INSERT INTO results (sport_id, gold_winner, silver_winner, bronze_winner) VALUES (?, ?, ?, ?)',
            [sport_id, gold_winner, silver_winner, bronze_winner]
        );
        res.status(201).json({
            id: result.insertId,
            sport_id,
            gold_winner,
            silver_winner,
            bronze_winner
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update result
const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { sport_id, gold_winner, silver_winner, bronze_winner } = req.body;
        await db.query(
            'UPDATE results SET sport_id = ?, gold_winner = ?, silver_winner = ?, bronze_winner = ? WHERE id = ?',
            [sport_id, gold_winner, silver_winner, bronze_winner, id]
        );
        res.json({ message: 'Result updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete result
const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM results WHERE id = ?', [id]);
        res.json({ message: 'Result deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getResultsBySport,
    getAllResults,
    createResult,
    updateResult,
    deleteResult
};
