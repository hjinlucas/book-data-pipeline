import express from 'express';
import { addBooks, getAllMainGenres, getSubgenresByMain, getBooksByGenre } from '../controllers/bookController';

const router = express.Router();

// 批量添加书籍
router.post('/add', addBooks);

// 获取所有主分类
router.get('/genres', getAllMainGenres);

// 根据主分类获取子分类
router.get('/subgenres/:mainGenre', getSubgenresByMain);

// 根据分类获取书籍
router.get('/', getBooksByGenre);

export default router;
