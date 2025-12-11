const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET all leads with pagination and sorting
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    const leads = await Lead.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    const total = await Lead.countDocuments();
    
    res.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body;
    
    const lead = new Lead({
      name,
      email,
      phone,
      message,
      source: source || 'Contact Form'
    });
    
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update lead status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;