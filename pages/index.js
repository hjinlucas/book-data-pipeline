import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import FileUpload from '../components/FileUpload';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dbStatus, setDbStatus] = useState({ connected: false, error: null });
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
    checkDbConnection();
  }, [currentPage]);

  const checkDbConnection = async () => {
    try {
      await axios.get("http://localhost:5050/api/books");
      setDbStatus({ connected: true, error: null });
    } catch (error) {
      setDbStatus({ connected: false, error: error.message });
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5050/api/books?page=${currentPage}&limit=16`
      );
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedBook) => {
    try {
      console.log("Updating book with data:", updatedBook);
      await axios.put(
        `http://localhost:5050/api/books/${updatedBook._id}`,
        updatedBook
      );
      setEditingBook(null);
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const isFieldEmpty = (value) => {
    if (value === undefined || value === null) return true;
    if (typeof value === "string") return value.trim() === "";
    if (typeof value === "number") return value === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  };

  const isBookComplete = (book) => {
    return (
      !isFieldEmpty(book.title.main) &&
      !isFieldEmpty(book.title.subtitle) &&
      !isFieldEmpty(book.creators) &&
      book.creators.length > 0 &&
      !isFieldEmpty(book.summary) &&
      !isFieldEmpty(book.isbn.isbn13)
    );
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        ONIX Book Data Pipeline
      </h1>
      <FileUpload />
      <div className="container mx-auto p-4">
        <div className="mb-4 p-4 rounded-lg bg-gray-100">
          <h2 className="text-lg font-bold">Database Status</h2>
          {dbStatus.connected ? (
            <p className="text-green-600">Connected to MongoDB</p>
          ) : (
            <div className="text-red-600">
              <p>Not connected to MongoDB</p>
              {dbStatus.error && <p>Error: {dbStatus.error}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="border p-4 rounded-lg h-72 flex flex-col justify-between relative bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isBookComplete(book)
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isBookComplete(book) ? "Complete" : "Incomplete"}
                </span>

                <div className="pt-6">
                  <h2
                    className="text-lg font-semibold truncate"
                    title={book.title.main}
                  >
                    {book.title.main}
                  </h2>

                  <p className="text-sm text-gray-600 mt-2 truncate">
                    By: {book.creators.map((creator) => creator.name).join(", ")}
                  </p>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {book.summary}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    ISBN: {book.isbn.isbn13}
                  </p>
                </div>
              </div>

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 transition-colors"
                onClick={() => handleEdit(book)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>

        {isModalOpen && (
          <Modal
            book={editingBook}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </main>
  );
}
