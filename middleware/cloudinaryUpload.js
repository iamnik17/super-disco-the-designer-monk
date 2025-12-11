const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage for pre-compression
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 1 // Only 1 file at a time
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter check:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      console.log('File rejected: Not an image');
      return cb(new Error('Only image files are allowed'), false);
    }
    
    // Check specific formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      console.log('File rejected: Unsupported format');
      return cb(new Error('Only JPG, PNG, and WebP images are allowed'), false);
    }
    
    console.log('File accepted');
    cb(null, true);
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  console.error('Upload error:', err.message);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 25MB' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files. Only 1 file allowed' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected field name. Use "image" field' 
      });
    }
  }
  
  if (err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }
  
  return res.status(500).json({ 
    error: 'Upload failed: ' + err.message 
  });
};

// Manual Cloudinary upload after compression
const uploadToCloudinary = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'designer-monk',
        public_id: filename,
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:best' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

module.exports = { upload, cloudinary, handleUploadError, uploadToCloudinary };