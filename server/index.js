import express from "express";
import cors from "cors";
import dbConnect from "./lib/mongodb.js";
import Book from "./models/Book.js";
import uploadRouter from "./api/upload.js";

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/upload", uploadRouter);

app.get("/api/books", async (req, res) => {
  try {
    await dbConnect();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    const books = await Book.find({}).skip(skip).limit(limit);

    const total = await Book.countDocuments({});

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    await dbConnect();
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/books/batch", async (req, res) => {
  try {
    await dbConnect();
    const { books } = req.body;
    
    if (!Array.isArray(books)) {
      return res.status(400).json({ error: 'Books must be an array' });
    }

    // Use insertMany for better performance
    const result = await Book.insertMany(books, { 
      ordered: false, // Continue processing even if some documents fail
      rawResult: true // Get detailed result information
    });

    res.status(201).json({
      success: true,
      inserted: result.insertedCount,
      total: books.length
    });
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      res.status(409).json({ 
        error: 'Some books already exist in database',
        details: error.writeErrors?.map(e => e.err.errmsg)
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    await dbConnect();
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
