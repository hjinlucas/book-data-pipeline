import Book from '../models/Book.js';

const handleError = (res, error) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const addBooks = async (req, res) => {
    try {
      const books = req.body;
  
      if (!Array.isArray(books)) {
        res.status(400).json({ error: 'Request body must be an array of books' });
        return;
      }
  
      const savedBooks = await Book.insertMany(books);
      res.status(201).json({ 
        message: 'Books successfully added',
        books: savedBooks
      });
    } catch (error) {
      handleError(res, error);
    }
};
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Execute query with Promise.all for parallel execution
    const [books, total] = await Promise.all([
      Book.find({})
        .sort({ 'title.main': 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments({})
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      data: {
        books,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    // Update the book
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validation on update
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        book: updatedBook
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

