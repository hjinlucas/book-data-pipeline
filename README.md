# 📚 Book Data Pipeline

The Book Data Pipeline is a collaborative project developed at Northeastern University, specifically designed to enhance and streamline [ReMo](https://remo.app/)'s book metadata management system. It is a modern web application for managing and transforming book metadata, built with Next.js and MongoDB. 

## ✨ Features

- 📄 Support for multiple file formats (XML)
- 🔄 Batch processing of book metadata
- 📝 Interactive book editing interface
- 🌓 Dark mode support
- 💾 MongoDB integration for data persistence
- 📱 Responsive design for all devices

## ✨ Screenshots

<img width="1156" alt="image" src="https://github.com/user-attachments/assets/d15f4e6d-9ae3-4d5e-b868-d9c76bb80095">

<img width="1287" alt="image" src="https://github.com/user-attachments/assets/79112892-48d6-40c4-a0bc-1d2e2fa09d68">

<img width="1398" alt="image" src="https://github.com/user-attachments/assets/8681bad1-55b4-48e1-9778-d37ce43f2724">





## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or remote)
- npm or yarn package manager

### Installation & Setup

1. First, set up the backend:
```bash
cd express
npm install
npm run dev
```

2. Then, in a new terminal, set up the frontend:
```bash
# From the root directory
npm install
npm run dev
```

The application will be running at:
- Backend: http://localhost:3000
- Frontend: http://localhost:3001

## Database Schema

The application uses MongoDB with the following book schema:

```javascript
{
  title: {
    main: String,    // Main title of the book
    subtitle: String // Subtitle if any
  },
  creators: [{       // Authors, editors, etc.
    name: String,
    role: String
  }],
  copyright_date: Number,  // Publication year
  summary: String,         // Book description
  series: {
    name: String,         // Series name if part of one
    position: Mixed       // Position in series
  },
  genre: {
    main: String,        // Main genre
    subgenres: [String]  // List of subgenres
  },
  form: String,          // Book format
  pages: Number,         // Number of pages
  isbn: {
    isbn13: String,      // 13-digit ISBN
    isbn10: String       // 10-digit ISBN
  }
}
```

## API Endpoints

- `GET /api/books/all` - Get paginated list of books
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `POST /api/books/add` - Add new books

## Environment Variables

Create a `.env` file in the express directory with:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Technologies Used

- Frontend: Next.js, React, Axios, Tailwind CSS
- Backend: Express.js, MongoDB, Mongoose
- Development: Node.js
## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, please open an issue in the GitHub repository or contact the maintainers.


