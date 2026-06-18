const db = require('../config/db');

// Get all age categories
const getAgeCategories = async (req, res) => {
    try {
        const [rows] = await db.query(
    'SELECT * FROM age_categories ORDER BY id'
);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get sports by age category and gender
const getSports = async (req, res) => {
    try {
        const { ageCategoryId, gender } = req.params;
        const [rows] = await db.query(
            'SELECT * FROM sports WHERE age_category_id = ? AND gender = ?',
            [ageCategoryId, gender]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create age category
const createAgeCategory = async (req, res) => {
    try {
        const { name} = req.body;
        const [result] = await db.query(
            'INSERT INTO age_categories (name) VALUES (?)',
            [name]
        );
       res.status(201).json({
    id: result.insertId,
    name
});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update age category
const updateAgeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name,} = req.body;
        await db.query(
            'UPDATE age_categories SET name = ? WHERE id = ?',
            [name, id]
        );
        res.json({ message: 'Age category updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete age category
const deleteAgeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM age_categories WHERE id = ?', [id]);
        res.json({ message: 'Age category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create sport
const createSport = async (req, res) => {
    try {
        const { name, age_category_id, gender } = req.body;
        const [result] = await db.query(
            'INSERT INTO sports (name, age_category_id, gender) VALUES (?, ?, ?)',
            [name, age_category_id, gender]
        );
        res.status(201).json({ id: result.insertId, name, age_category_id, gender });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update sport
const updateSport = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age_category_id, gender } = req.body;
        await db.query(
            'UPDATE sports SET name = ?, age_category_id = ?, gender = ? WHERE id = ?',
            [name, age_category_id, gender, id]
        );
        res.json({ message: 'Sport updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete sport
const deleteSport = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM sports WHERE id = ?', [id]);
        res.json({ message: 'Sport deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all sports (admin)
const getAllSports = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, ac.name as age_category_name 
            FROM sports s 
            JOIN age_categories ac ON s.age_category_id = ac.id 
            ORDER BY ac.id, s.gender, s.name
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAgeCategories,
    getSports,
    createAgeCategory,
    updateAgeCategory,
    deleteAgeCategory,
    createSport,
    updateSport,
    deleteSport,
    getAllSports
};
