const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { upload } = require('../middleware/cloudinaryUpload');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create project with Cloudinary upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, projectName, category, style, layout, location, pricing, bhk, scope, propertyType, size, priceMin, priceMax, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const project = new Project({
      title,
      projectName,
      category,
      style,
      layout,
      location,
      pricing,
      bhk,
      scope,
      propertyType,
      size,
      status: status || 'delivered',
      priceMin: Number(priceMin),
      priceMax: Number(priceMax),
      imageUrl: req.file.path
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update project
router.put('/:id', upload.single('image'), async (req, res) => {
  console.log('PUT route hit for ID:', req.params.id);
  console.log('Has file:', !!req.file);
  
  try {
    const { title, projectName, category, style, layout, location, pricing, bhk, scope, propertyType, size, priceMin, priceMax, status } = req.body;
    
    const updateData = {
      title,
      projectName,
      category,
      style,
      layout,
      location,
      pricing,
      bhk,
      scope,
      propertyType,
      size,
      status: status || 'delivered',
      priceMin: Number(priceMin),
      priceMax: Number(priceMax)
    };

    // Handle new image upload with Cloudinary
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('Project updated successfully');
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug: Log when this module is loaded
console.log('Projects routes loaded');

module.exports = router;