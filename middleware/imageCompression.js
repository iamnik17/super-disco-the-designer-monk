const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// Image compression middleware
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const originalSize = req.file.buffer.length;
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const filepath = path.join(__dirname, '../uploads', filename);

    // Compress image using Sharp
    await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(filepath);

    // Get compressed file size
    const stats = fs.statSync(filepath);
    const compressedSize = stats.size;

    // Add file info to request
    req.fileInfo = {
      filename,
      originalSize,
      compressedSize,
      path: `/uploads/${filename}`
    };

    console.log(`Image compressed: ${(originalSize/1024/1024).toFixed(2)}MB → ${(compressedSize/1024).toFixed(2)}KB`);
    next();
  } catch (error) {
    console.error('Image compression error:', error);
    res.status(500).json({ error: 'Image compression failed' });
  }
};

module.exports = { upload, compressImage };