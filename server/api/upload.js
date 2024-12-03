import express from 'express';
import multer from 'multer';
import path from 'path';
import parseOnixXML from '../parser/onix-parser.js';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for XML file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/xml' || file.mimetype === 'text/xml') {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'));
    }
  }
});

// Ensure uploads directory exists
try {
  await fs.mkdir(path.join(__dirname, '../uploads'), { recursive: true });
} catch (err) {
  console.error('Error creating uploads directory:', err);
}

// Handle file upload and parsing
router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const parsedData = await parseOnixXML(filePath);

    // Clean up uploaded file
    await fs.unlink(filePath);

    res.json({ 
      success: true, 
      data: parsedData,
      message: `Successfully parsed ${parsedData.length} books`
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ 
      error: 'Error processing file', 
      message: error.message 
    });
  }
});

export default router;
