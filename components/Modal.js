import { useState } from "react";
import { X } from "lucide-react";

const Modal = ({ book, onClose, onSave }) => {
  const [updatedBook, setUpdatedBook] = useState({
    ...book,
    creators: book.creators || [],
    title: {
      main: book.title?.main || "",
      subtitle: book.title?.subtitle || "",
    },
    isbn: {
      isbn13: book.isbn?.isbn13 || "",
      isbn10: book.isbn?.isbn10 || "",
    },
    series: {
      name: book.series?.name || "",
      position: book.series?.position || ""
    },
    genre: {
      main: book.genre?.main || "",
      subgenres: (book.genre?.subgenres && book.genre?.subgenres.join(", ")) || ""
    },
    publisher: book.publisher || "",
    target_audience: book.target_audience || "",
    form: book.form || "",
    pages: book.pages || 0,
    type: book.type || "",
    summary: book.summary || "",
    copyright_date: book.copyright_date || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("title.")) {
      const field = name.split(".")[1];
      setUpdatedBook({ ...updatedBook, title: { ...updatedBook.title, [field]: value } });
    } else if (name.startsWith("series.")) {
      const field = name.split(".")[1];
      setUpdatedBook({ ...updatedBook, series: { ...updatedBook.series, [field]: value } });
    } else if (name.startsWith("isbn.")) {
      const field = name.split(".")[1];
      setUpdatedBook({ ...updatedBook, isbn: { ...updatedBook.isbn, [field]: value } });
    } else if (name.startsWith("genre.")) {
      const field = name.split(".")[1];
      setUpdatedBook({ ...updatedBook, genre: { ...updatedBook.genre, [field]: value } });
    } else {
      setUpdatedBook({ ...updatedBook, [name]: value });
    }
  };

  const handleCreatorChange = (index, field, value) => {
    const newCreators = [...updatedBook.creators];
    newCreators[index] = { ...newCreators[index], [field]: value };
    setUpdatedBook({ ...updatedBook, creators: newCreators });
  };

  const handleAddCreator = () => {
    setUpdatedBook({
      ...updatedBook,
      creators: [...updatedBook.creators, { name: "", role: "" }]
    });
  };

  const handleRemoveCreator = (index) => {
    const newCreators = updatedBook.creators.filter((_, i) => i !== index);
    setUpdatedBook({ ...updatedBook, creators: newCreators });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 在提交前处理genre.subgenres从字符串转为数组
    const subgenresArray = updatedBook.genre.subgenres
      ? updatedBook.genre.subgenres.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const finalBookData = {
      ...updatedBook,
      genre: {
        main: updatedBook.genre.main,
        subgenres: subgenresArray
      }
    };

    onSave(finalBookData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-20">
      <div className="relative flex h-full mx-auto flex-col overflow-hidden border dark:bg-black bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-950 lg:w-[900px] w-[80%] rounded-[24px]">
        <div className="sticky top-0 z-10 bg-gray-300 dark:bg-black border-b border-zinc-300 dark:border-zinc-700 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl text-zinc-950 dark:text-zinc-50">
              Edit Book
            </h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title and Subtitle */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title.main"
                        value={updatedBook.title.main}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        name="title.subtitle"
                        value={updatedBook.title.subtitle}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  {/* ISBN */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        ISBN-13
                      </label>
                      <input
                        type="text"
                        name="isbn.isbn13"
                        value={updatedBook.isbn.isbn13}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        ISBN-10
                      </label>
                      <input
                        type="text"
                        name="isbn.isbn10"
                        value={updatedBook.isbn.isbn10}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Creators Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                    Creators
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddCreator}
                    className="text-sm px-4 py-2 rounded-full dark:bg-gray-900 bg-gray-400 hover:bg-gray-500 text-white dark:hover:bg-gray-800"
                  >
                    Add Creator
                  </button>
                </div>
                <div className="space-y-3">
                  {updatedBook.creators.map((creator, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={creator.name}
                        onChange={(e) =>
                          handleCreatorChange(index, "name", e.target.value)
                        }
                        className="flex-1 p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={creator.role}
                        onChange={(e) =>
                          handleCreatorChange(index, "role", e.target.value)
                        }
                        className="flex-1 p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                        placeholder="Role"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCreator(index)}
                        className="p-3 rounded-full dark:bg-gray-900 bg-gray-400 hover:bg-gray-500 text-white dark:hover:bg-gray-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Publisher Info */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Publisher
                      </label>
                      <input
                        type="text"
                        name="publisher"
                        value={updatedBook.publisher}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Copyright Date
                      </label>
                      <input
                        type="number"
                        name="copyright_date"
                        value={updatedBook.copyright_date}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Pages
                      </label>
                      <input
                        type="number"
                        name="pages"
                        value={updatedBook.pages}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Classification */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        value={updatedBook.type}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      >
                        <option value="">Select Type</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Nonfiction">Nonfiction</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Form
                      </label>
                      <input
                        type="text"
                        name="form"
                        value={updatedBook.form}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        name="target_audience"
                        value={updatedBook.target_audience}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Series and Genre Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Series & Genre
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Series */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Series Name
                      </label>
                      <input
                        type="text"
                        name="series.name"
                        value={updatedBook.series.name}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Series Position
                      </label>
                      <input
                        type="text"
                        name="series.position"
                        value={updatedBook.series.position}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Main Genre
                      </label>
                      <input
                        type="text"
                        name="genre.main"
                        value={updatedBook.genre.main}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Subgenres (comma separated)
                      </label>
                      <input
                        type="text"
                        name="genre.subgenres"
                        value={updatedBook.genre.subgenres}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Summary
                </h3>
                <textarea
                  name="summary"
                  value={updatedBook.summary}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
