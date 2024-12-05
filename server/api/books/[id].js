import dbConnect from "../../../lib/mongodb";
import Book from "../../../models/Book";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  try {
    if (req.method === "PUT") {
      console.log("Updating book with data:", req.body);

      const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedBook) {
        console.error("Book not found with id:", id);
        return res.status(404).json({ error: "Book not found" });
      }

      res.status(200).json(updatedBook);
    }
  } catch (error) {
    console.error("Error updating book:", error);
    // Send more detailed error information
    res.status(400).json({
      error: error.message,
      details: error.errors
        ? Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          }))
        : null,
    });
  }
}
