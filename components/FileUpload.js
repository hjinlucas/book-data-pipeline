import { useState } from 'react';
import axios from 'axios';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'application/xml', 
      'text/xml',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (selectedFile && (allowedTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select an XML or XLSX file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5050/api/upload/parse', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setParsedData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveToDb = async () => {
    if (!parsedData) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const BATCH_SIZE = 20; // Reduced from 50 to 20 books at a time
    const batches = [];
    
    // Split books into batches
    for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
      batches.push(parsedData.slice(i, i + BATCH_SIZE));
    }

    try {
      let successCount = 0;
      
      // Process batches sequentially
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        try {
          await axios.post('http://localhost:5050/api/books/batch', { books: batch });
          successCount += batch.length;
          
          // Update progress
          const progress = Math.round((successCount / parsedData.length) * 100);
          setUploadProgress(progress);
        } catch (err) {
          console.error(`Error saving batch ${i}:`, err);
          setError(`Error saving batch ${i + 1} of ${batches.length}: ${err.response?.data?.message || err.message}`);
          // Continue with next batch despite error
        }
      }

      if (successCount === parsedData.length) {
        setParsedData(null);
        setFile(null);
        alert('Successfully saved all books to database!');
      } else {
        alert(`Saved ${successCount} out of ${parsedData.length} books. Check console for details.`);
      }
    } catch (err) {
      setError('Error saving to database: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload ONIX XML File
        </label>
        <input
          type="file"
          accept=".xml, .xlsx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isUploading}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {uploadProgress}% Complete
          </p>
        </div>
      )}

      {parsedData && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <p className="text-green-700">
            Successfully parsed {parsedData.length} books!
          </p>
          <button
            onClick={handleSaveToDb}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            disabled={isUploading}
          >
            Save to Database
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isUploading ? 'Processing...' : 'Upload and Parse'}
      </button>
    </div>
  );
}
