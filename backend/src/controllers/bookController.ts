import { Request, Response } from 'express';
import Book from '../models/Book';

// 错误处理函数
const handleError = (res: Response, error: unknown) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};

// 批量添加书籍
export const addBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = req.body;
  
      if (!Array.isArray(books)) {
        res.status(400).json({ error: 'Request body must be an array of books' });
        return;
      }
  
      // Perform your database logic here
      res.status(201).json({ message: 'Books successfully added' });
    } catch (error) {
      handleError(res, error);
    }
  };

// 获取所有主分类
export const getAllMainGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Book.getAllMainGenres();
    res.json(genres);
  } catch (error) {
    handleError(res, error);
  }
};

// 根据主分类获取子分类
export const getSubgenresByMain = async (req: Request, res: Response) => {
  try {
    const { mainGenre } = req.params;
    const subgenres = await Book.getSubgenresByMain(mainGenre);
    res.json(subgenres);
  } catch (error) {
    handleError(res, error);
  }
};

// 根据分类获取书籍
export const getBooksByGenre = async (req: Request, res: Response) => {
  try {
    const { genre, page = '1', limit = '10' } = req.query;
    const result = await Book.findBooksByGenre(
      genre as string,
      parseInt(page as string),
      parseInt(limit as string)
    );
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
};
