import express from 'express';
import multer from 'multer';
import path from 'path';
import parseOnixXML from '../parser/onix-parser.js';
import parseXLSX from '../parser/xlsx-parser.js';
import { transformXLSXToDBSchema, transformONIXToDBSchema } from '../lib/transformers.js';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import mongoose from 'mongoose'; // Assuming mongoose is used for database operations

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for file uploads
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
    const allowedTypes = ['application/xml', 'text/xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only XML and XLSX files are allowed'));
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

    console.log('File upload details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const filePath = req.file.path;
    let parsedData;
    let dbReadyData;

    // Parse based on file type
    const isXLSX = req.file.originalname.toLowerCase().endsWith('.xlsx') || 
                   (req.file.mimetype && (
                     req.file.mimetype.includes('spreadsheetml') || 
                     req.file.mimetype === 'application/vnd.ms-excel'
                   ));

    console.log('File type detection:', { isXLSX, mimetype: req.file.mimetype });

    if (isXLSX) {
      console.log('Processing as XLSX file');
      parsedData = await parseXLSX(filePath);
      console.log('XLSX Raw Data Sample:', parsedData[0]);
      dbReadyData = transformXLSXToDBSchema(parsedData);
      console.log('Transformed Data Sample:', dbReadyData[0]);
    } else if (req.file.originalname.toLowerCase().endsWith('.xml')) {
      console.log('Processing as XML file');
      parsedData = await parseOnixXML(filePath);
      dbReadyData = transformONIXToDBSchema(parsedData);
    } else {
      throw new Error(`Unsupported file type. Mimetype: ${req.file.mimetype}, Filename: ${req.file.originalname}`);
    }

    // Clean up uploaded file
    await fs.unlink(filePath);

    res.json({ 
      success: true, 
      data: dbReadyData,
      message: `Successfully parsed ${dbReadyData.length} books`,
      format: req.file.mimetype.includes('xml') ? 'ONIX' : 'XLSX'
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
