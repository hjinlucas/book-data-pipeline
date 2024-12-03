import { useState } from "react";

const Modal = ({ book, onClose, onSave }) => {
  const [updatedBook, setUpdatedBook] = useState({
    ...book,
    creators: book.creators || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("series.")) {
      const seriesField = name.split(".")[1];
      setUpdatedBook({
        ...updatedBook,
        series: { ...updatedBook.series, [seriesField]: value },
      });
    } else if (name.startsWith("isbn.")) {
      const isbnField = name.split(".")[1];
      setUpdatedBook({
        ...updatedBook,
        isbn: { ...updatedBook.isbn, [isbnField]: value },
      });
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
      creators: [...updatedBook.creators, { name: "", role: "" }],
    });
  };

  const handleRemoveCreator = (index) => {
    const newCreators = updatedBook.creators.filter((_, i) => i !== index);
    setUpdatedBook({ ...updatedBook, creators: newCreators });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedBook);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title.main"
              value={updatedBook.title.main}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Subtitle</label>
            <input
              type="text"
              name="title.subtitle"
              value={updatedBook.title.subtitle}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Creators</label>
            {updatedBook.creators.map((creator, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={creator.name}
                  onChange={(e) =>
                    handleCreatorChange(index, "name", e.target.value)
                  }
                  className="border rounded w-1/2 p-2 mr-2"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={creator.role}
                  onChange={(e) =>
                    handleCreatorChange(index, "role", e.target.value)
                  }
                  className="border rounded w-1/2 p-2"
                  placeholder="Role"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCreator(index)}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCreator}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Creator
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Copyright Date</label>
            <input
              type="number"
              name="copyright_date"
              value={updatedBook.copyright_date}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Summary</label>
            <textarea
              name="summary"
              value={updatedBook.summary}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Series</label>
            <input
              type="text"
              name="series.name"
              value={updatedBook.series.name}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Series Name"
            />
            <input
              type="number"
              name="series.position"
              value={updatedBook.series.position}
              onChange={handleChange}
              className="border rounded w-full p-2 mt-2"
              placeholder="Series Position"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Genre</label>
            <input
              type="text"
              name="genre.main"
              value={updatedBook.genre.main}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="Main Genre"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Form</label>
            <input
              type="text"
              name="form"
              value={updatedBook.form}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Pages</label>
            <input
              type="number"
              name="pages"
              value={updatedBook.pages}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">ISBN</label>
            <input
              type="text"
              name="isbn.isbn13"
              value={updatedBook.isbn.isbn13}
              onChange={handleChange}
              className="border rounded w-full p-2"
              placeholder="ISBN-13"
            />
            <input
              type="text"
              name="isbn.isbn10"
              value={updatedBook.isbn.isbn10}
              onChange={handleChange}
              className="border rounded w-full p-2 mt-2"
              placeholder="ISBN-10"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Type</label>
            <input
              type="text"
              name="type"
              value={updatedBook.type}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={updatedBook.publisher}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Target Audience</label>
            <input
              type="text"
              name="target_audience"
              value={updatedBook.target_audience}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
