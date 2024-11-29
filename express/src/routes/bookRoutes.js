// routes/bookRoutes.js
import express from 'express';
import { addBooks, getAllMainGenres, getSubgenresByMain, getBooksByGenre } from '../controllers/bookController.js';

const router = express.Router();

router.post('/add', addBooks);
router.get('/genres', getAllMainGenres);
router.get('/subgenres/:mainGenre', getSubgenresByMain);
router.get('/', getBooksByGenre);

export default router;