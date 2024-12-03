import dbConnect from "../../../lib/mongodb";
import Book from "../../../models/Book";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 16;
      const skip = (page - 1) * limit;

      const books = await Book.find({}).skip(skip).limit(limit).lean();

      const total = await Book.countDocuments({});

      res.status(200).json({
        books,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
