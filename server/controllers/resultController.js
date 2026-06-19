const path = require('path');
const fs = require('fs');
const Result = require('../models/Result');
const { isConnected } = require('../config/db');

const serializeResult = (doc) => ({
  id: doc._id.toString(),
  sport_id: doc.sport_id.toString(),
  gold_winner: doc.gold_winner,
  silver_winner: doc.silver_winner,
  bronze_winner: doc.bronze_winner,
  pdf_path: doc.pdf_path || ''
});

const getResultsBySport = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { sportId } = req.params;
    const results = await Result.find({ sport_id: sportId })
      .populate({ path: 'sport_id', select: 'name gender age_category_id', populate: { path: 'age_category_id', select: 'name' } })
      .sort({ createdAt: 1 });

    const formatted = results.map((result) => ({
      ...serializeResult(result),
      sport_name: result.sport_id?.name || '',
      gender: result.sport_id?.gender || '',
      age_category_name: result.sport_id?.age_category_id?.name || ''
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllResults = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const results = await Result.find()
      .populate({ path: 'sport_id', select: 'name gender age_category_id', populate: { path: 'age_category_id', select: 'name' } })
      .sort({ createdAt: 1 });

    const formatted = results.map((result) => ({
      ...serializeResult(result),
      sport_name: result.sport_id?.name || '',
      gender: result.sport_id?.gender || '',
      age_category_name: result.sport_id?.age_category_id?.name || ''
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createResult = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { sport_id, gold_winner, silver_winner, bronze_winner } = req.body;
    const result = await Result.create({ sport_id, gold_winner, silver_winner, bronze_winner });
    res.status(201).json(serializeResult(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateResult = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { id } = req.params;
    const { sport_id, gold_winner, silver_winner, bronze_winner } = req.body;
    await Result.findByIdAndUpdate(id, { sport_id, gold_winner, silver_winner, bronze_winner }, { new: true });
    res.json({ message: 'Result updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteResult = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { id } = req.params;
    const result = await Result.findById(id);
    if (result?.pdf_path) {
      const filePath = path.join(__dirname, '../uploads', path.basename(result.pdf_path));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Result.findByIdAndDelete(id);
    res.json({ message: 'Result deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadResultPdf = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    if (!req.file) return res.status(400).json({ message: 'No PDF file uploaded' });

    const { id } = req.params;
    const result = await Result.findById(id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    // Delete old PDF if exists
    if (result.pdf_path) {
      const oldPath = path.join(__dirname, '../uploads', path.basename(result.pdf_path));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const pdfUrl = `/uploads/${req.file.filename}`;
    await Result.findByIdAndUpdate(id, { pdf_path: pdfUrl });
    res.json({ message: 'PDF uploaded successfully', pdf_path: pdfUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeResultPdf = async (req, res) => {
  try {
    if (!isConnected()) return res.status(503).json({ message: 'Database unavailable' });
    const { id } = req.params;
    const result = await Result.findById(id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    if (result.pdf_path) {
      const filePath = path.join(__dirname, '../uploads', path.basename(result.pdf_path));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Result.findByIdAndUpdate(id, { pdf_path: '' });
    res.json({ message: 'PDF removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getResultsBySport, getAllResults, createResult, updateResult, deleteResult, uploadResultPdf, removeResultPdf };