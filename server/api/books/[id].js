import dbConnect from "../../../lib/mongodb";
import Book from "../../../models/Book";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  try {
    if (req.method === "PUT") {
      const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedBook) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.status(200).json(updatedBook);
    }
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: error.message });
  }
}
