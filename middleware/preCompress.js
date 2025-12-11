const sharp = require('sharp');

const preCompressImage = async (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  try {
    console.log('Original file size:', (req.file.size / 1024 / 1024).toFixed(2) + 'MB');

    // Compress image before Cloudinary upload
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    console.log('Compressed file size:', (compressedBuffer.length / 1024 / 1024).toFixed(2) + 'MB');

    // Replace original buffer with compressed one
    req.file.buffer = compressedBuffer;
    req.file.size = compressedBuffer.length;

    next();
  } catch (error) {
    console.error('Pre-compression error:', error);
    next(); // Continue without compression if it fails
  }
};

module.exports = { preCompressImage };