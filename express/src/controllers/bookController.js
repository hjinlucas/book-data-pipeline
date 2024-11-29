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

export const getAllMainGenres = async (req, res) => {
  try {
    const genres = await Book.getAllMainGenres();
    res.json(genres);
  } catch (error) {
    handleError(res, error);
  }
};

export const getSubgenresByMain = async (req, res) => {
  try {
    const { mainGenre } = req.params;
    const subgenres = await Book.getSubgenresByMain(mainGenre);
    res.json(subgenres);
  } catch (error) {
    handleError(res, error);
  }
};

export const getBooksByGenre = async (req, res) => {
  try {
    const { genre, page = '1', limit = '10' } = req.query;
    const result = await Book.findBooksByGenre(
      genre,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
};