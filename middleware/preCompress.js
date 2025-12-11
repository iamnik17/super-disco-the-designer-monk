const sharp = require('sharp');

const preCompressImage = async (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  try {
    console.log('Original file size:', (req.file.size / 1024 / 1024).toFixed(2) + 'MB');

    // Compress image before Cloudinary upload
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    // If still too large, compress more aggressively
    let finalBuffer = compressedBuffer;
    if (compressedBuffer.length > 9 * 1024 * 1024) { // If > 9MB
      finalBuffer = await sharp(req.file.buffer)
        .resize(1600, 900, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 60, progressive: true })
        .toBuffer();
      console.log('Applied aggressive compression');
    }

    console.log('Compressed file size:', (finalBuffer.length / 1024 / 1024).toFixed(2) + 'MB');

    // Replace original buffer with compressed one
    req.file.buffer = finalBuffer;
    req.file.size = finalBuffer.length;

    next();
  } catch (error) {
    console.error('Pre-compression error:', error);
    next(); // Continue without compression if it fails
  }
};

module.exports = { preCompressImage };