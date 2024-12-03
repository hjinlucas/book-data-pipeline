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
    <main className="min-h-screen p-8 bg-white dark:bg-zinc-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center space-y-8 mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Book Data Pipeline
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            A modern solution for managing and transforming book metadata. Upload XML or Excel files, 
            edit book information, and maintain a clean, structured database of your literary collection.
          </p>
          <div className="flex gap-4 justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>XML Support</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Excel Support</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm8-1v18M3 11h18" />
              </svg>
              <span>Batch Processing</span>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className={`flex items-center gap-2 p-2 rounded-lg max-w-fit mx-auto ${
          dbStatus.connected 
            ? 'bg-emerald-100 dark:bg-emerald-900/50' 
            : 'bg-red-100 dark:bg-red-900/50'
        }`}>
          <div className="w-4 h-4">
            {dbStatus.connected ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path 
                  fill="#10B981" 
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path 
                  fill="#EF4444" 
                  d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                />
              </svg>
            )}
          </div>
          <span className={`text-sm font-medium ${
            dbStatus.connected 
              ? 'text-emerald-800 dark:text-emerald-100' 
              : 'text-red-800 dark:text-red-100'
          }`}>
            Database Status: {dbStatus.connected ? 'Connected' : 'Disconnected'}
            {dbStatus.error && (
              <span className="block text-xs text-red-600 dark:text-red-400">
                Error: {dbStatus.error}
              </span>
            )}
          </span>
        </div>
      </div>

      <FileUpload />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="border p-4 rounded-lg h-72 flex flex-col justify-between relative bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isBookComplete(book)
                      ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100"
                      : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-100"
                  }`}
                >
                  {isBookComplete(book) ? "Complete" : "Incomplete"}
                </span>

                <div className="pt-6">
                  <h2
                    className="text-lg font-semibold truncate text-zinc-900 dark:text-zinc-100"
                    title={book.title.main}
                  >
                    {book.title.main}
                  </h2>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 truncate">
                    By: {book.creators.map((creator) => creator.name).join(", ")}
                  </p>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
                    {book.summary}
                  </p>

                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                    ISBN: {book.isbn.isbn13}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleEdit(book)}
                className="w-[120px] h-[40px] flex items-center justify-center rounded-[30px] border border-zinc-400 
                bg-gradient-to-t from-[#D8D9DB] via-white to-[#FDFDFD] dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700
                text-[14px] font-semibold text-[#606060] dark:text-zinc-200 shadow-sm
                transition-all duration-200
                hover:shadow-[0_4px_3px_1px_#FCFCFC,0_6px_8px_#D6D7D9,0_-4px_4px_#CECFD1,0_-6px_4px_#FEFEFE,inset_0_0_3px_3px_#CECFD1]
                dark:hover:shadow-[0_4px_3px_1px_#18181B,0_6px_8px_#27272A,0_-4px_4px_#27272A,0_-6px_4px_#18181B,inset_0_0_3px_3px_#3F3F46]
                active:shadow-[0_4px_3px_1px_#FCFCFC,0_6px_8px_#D6D7D9,0_-4px_4px_#CECFD1,0_-6px_4px_#FEFEFE,inset_0_0_5px_3px_#999999,inset_0_0_30px_#aaaaaa]
                dark:active:shadow-[0_4px_3px_1px_#18181B,0_6px_8px_#27272A,0_-4px_4px_#27272A,0_-6px_4px_#18181B,inset_0_0_5px_3px_#3F3F46,inset_0_0_30px_#52525B]
                focus:shadow-[0_4px_3px_1px_#FCFCFC,0_6px_8px_#D6D7D9,0_-4px_4px_#CECFD1,0_-6px_4px_#FEFEFE,inset_0_0_5px_3px_#999999,inset_0_0_30px_#aaaaaa]
                dark:focus:shadow-[0_4px_3px_1px_#18181B,0_6px_8px_#27272A,0_-4px_4px_#27272A,0_-6px_4px_#18181B,inset_0_0_5px_3px_#3F3F46,inset_0_0_30px_#52525B]"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-[100px] h-[40px] flex items-center justify-center rounded-[30px] border border-zinc-400 
            bg-gradient-to-t from-[#D8D9DB] via-white to-[#FDFDFD] dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700
            text-[14px] font-semibold text-[#606060] dark:text-zinc-200 shadow-sm
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            enabled:hover:shadow-[0_4px_3px_1px_#FCFCFC,0_6px_8px_#D6D7D9,0_-4px_4px_#CECFD1,0_-6px_4px_#FEFEFE,inset_0_0_3px_3px_#CECFD1]
            enabled:dark:hover:shadow-[0_4px_3px_1px_#18181B,0_6px_8px_#27272A,0_-4px_4px_#27272A,0_-6px_4px_#18181B,inset_0_0_3px_3px_#3F3F46]"
          >
            Previous
          </button>

          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">Page</span>
            <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-semibold min-w-[40px] text-center">
              {currentPage}
            </span>
            <span className="font-medium">of</span>
            <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-semibold min-w-[40px] text-center">
              {totalPages}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-[100px] h-[40px] flex items-center justify-center rounded-[30px] border border-zinc-400 
            bg-gradient-to-t from-[#D8D9DB] via-white to-[#FDFDFD] dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700
            text-[14px] font-semibold text-[#606060] dark:text-zinc-200 shadow-sm
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            enabled:hover:shadow-[0_4px_3px_1px_#FCFCFC,0_6px_8px_#D6D7D9,0_-4px_4px_#CECFD1,0_-6px_4px_#FEFEFE,inset_0_0_3px_3px_#CECFD1]
            enabled:dark:hover:shadow-[0_4px_3px_1px_#18181B,0_6px_8px_#27272A,0_-4px_4px_#27272A,0_-6px_4px_#18181B,inset_0_0_3px_3px_#3F3F46]"
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
