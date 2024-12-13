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
      // 修改检查连接的请求路径为 /api/books/all 
      // 因为后端 getBooks 路由是绑定到 /all 上的
      await axios.get("http://localhost:3000/api/books/all");
      setDbStatus({ connected: true, error: null });
    } catch (error) {
      setDbStatus({ connected: false, error: error.message });
    }
  };

  const fetchBooks = async () => {
    try {
      // 调用 /api/books/all 接口获取分页书籍数据
      const response = await axios.get(
        `http://localhost:3000/api/books/all?page=${currentPage}&limit=16`
      );
      const { data } = response.data; 
      // 注：从后端返回的数据中取得 data.data 下的数据
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
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
      // 调用后端的updateBook接口：PUT /api/books/:id
      await axios.put(
        `http://localhost:3000/api/books/${updatedBook._id}`,
        updatedBook
      );
      setEditingBook(null);
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${bookId}`);
        // Refresh the books list after deletion
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
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
    // 根据后端要求的必填字段进行判断
    return (
      !isFieldEmpty(book.title?.main) &&
      !isFieldEmpty(book.title?.subtitle) &&
      Array.isArray(book.creators) && book.creators.length > 0 &&
      !isFieldEmpty(book.summary) &&
      !isFieldEmpty(book.isbn?.isbn13)
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
            A modern solution for managing and transforming book metadata. Upload XML files, 
            edit book information, and maintain a clean, structured database of your literary collection.
          </p>
          <div className="flex gap-4 justify-center">
            {/* 保留 UI标签无需改动 */}
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <span>XML Support</span>
            </div>
          
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
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
          {dbStatus.connected ? 'Database Status: Connected' : 'Database Status: Disconnected'}
          {dbStatus.error && (
            <span className="block text-xs text-red-600 dark:text-red-400">
              Error: {dbStatus.error}
            </span>
          )}
        </div>
      </div>

      {/* 删除CSV逻辑，仅保留基本UI或导入XML/Excel逻辑 */}
      <FileUpload />

      <div className="container mx-auto p-4">
        {/* 书籍展示 */}
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

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="w-[120px] h-[40px] flex items-center justify-center rounded-[30px] border border-zinc-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="w-[120px] h-[40px] flex items-center justify-center rounded-[30px] border border-zinc-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 分页 */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
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
