// routes/bookRoutes.js
import express from 'express';
import { addBooks, getBooks, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

router.post('/add', addBooks);
router.get('/all', getBooks);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
export default router;