# 📚 Book Data Pipeline

The Book Data Pipeline is a collaborative project developed at Northeastern University, specifically designed to enhance and streamline [ReMo](https://remo.app/)'s book metadata management system. It is a modern web application for managing and transforming book metadata, built with Next.js and MongoDB. 

## ✨ Features

- 📄 Support for multiple file formats (XML, Excel)
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

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hjinlucas/book-data-pipeline.git
cd book-data-pipeline
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. We sugguest test directly since we have db running(till Dec.12)

You can set up your own environment variables(mongodb):
Create a `.env.local` file in the root directory with:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🔧 Usage

### File Upload
1. Click the "Upload File" button
2. Select your XML or Excel file
3. The system will automatically process and validate the data
4. View the results in the book grid

### Book Management
- **View Books**: All books are displayed in a responsive grid
- **Edit Books**: Click the edit button on any book card to modify its details
- **Dark Mode**: System automatically adapts to your device's theme preference

## 🛠 Technical Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, MongoDB
- **File Processing**: Custom XML and Excel parsers
- **Styling**: Modern UI with dark mode support

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
