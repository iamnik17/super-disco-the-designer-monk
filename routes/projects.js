const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { upload, handleUploadError } = require('../middleware/cloudinaryUpload');
const { preCompressImage } = require('../middleware/preCompress');

// GET all projects
router.get('/', async (req, res) => {
  try {
    console.log('Fetching projects from database...');
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log('Projects found:', projects.length);
    res.json({
      success: true,
      count: projects.length,
      projects: projects
    });
  } catch (error) {
    console.error('GET projects error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: 'Failed to fetch projects'
    });
  }
});

// POST create project with Cloudinary upload
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }
    next();
  });
}, preCompressImage, async (req, res) => {
  try {
    console.log('POST /api/projects called');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('File uploaded:', !!req.file);
    if (req.file) {
      console.log('File details:', JSON.stringify({
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }, null, 2));
    }

    const { title, projectName, category, style, layout, location, pricing, bhk, scope, propertyType, size, priceMin, priceMax, status } = req.body;

    if (!req.file) {
      console.log('No file uploaded - returning error');
      return res.status(400).json({ error: 'Image is required' });
    }

    console.log('Creating project with data:', JSON.stringify({
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
    }, null, 2));

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

    console.log('Saving project to database...');
    await project.save();
    console.log('Project saved successfully');
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: project
    });
  } catch (error) {
    console.error('Project creation error:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create project'
    });
  }
});

// PUT update project
router.put('/:id', upload.single('image'), async (req, res) => {
  console.log('PUT route hit for ID:', req.params.id);
  console.log('Has file:', !!req.file);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
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
    
    console.log('Project updated successfully:', JSON.stringify(project, null, 2));
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error.message);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
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