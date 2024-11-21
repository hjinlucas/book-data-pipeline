# Book Data Pipeline

Book Data Pipeline is an open-source application for managing, parsing, and storing book metadata from various sources. Built with **Next.js** (App Router) and **TypeScript**, it allows you to ingest book data from APIs or files, validate it, and make it accessible through a clean and user-friendly interface.

<br/>

For [ReMo App](https://remo.app/how-remo-works)

---

## Features

- Parse and store book metadata (e.g., Title, Author, ISBN, etc.)
- API integration for managing book data (GET, POST support)
- Frontend interface for viewing and adding books
- Type-safe implementation with TypeScript
- Built-in MongoDB support for storing metadata

---

## Getting Started

### Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **MongoDB** (running locally or accessible via URI)

---

### Installation

1.  Clone the repository:

    ```
    git clone https://github.com/your-username/book-data-pipeline.git
    cd book-data-pipeline
    ```

2.  Install dependencies:

    ```
    npm install
    ```

3.  Set up your environment variables:
    a. Create a .env file in the root directory:
    plaintext
    `   MONGODB_URI=mongodb://localhost:27017`

         b. Replace mongodb://localhost:27017 with your MongoDB connection string if necessary.

4.  Run the development server:
    ```
    npm run dev
    ```

### Running the Application

1. Start your MongoDB instance:

   ```
   mongod
   ```

2. Start the development server:

   ```
   npm run dev
   ```

3. Open your browser and navigate to:

   - Home Page (Book List): http://localhost:3000

   - Add Book Page: http://localhost:3000/add-book

### Testing APIs

1. Ensure File Placement:
   - CSV: app/data/CRWReportJob148737.csv
   - XML: app/data/LEEANDLOW_20210707.xml

Start the Server:
`    npm run dev
   `
Test with Postman or Browser:

URL:

```
http://localhost:3000/api/testParsing
```

Expected Response:

```
{
    "csvRecords": [
        {
            "isbn": "978-3-16-148410-0",
           ...
        }
    ],
    "xmlRecords": [
        {
            "isbn": "9781643790664",
            ...
        }
    ]
}
```
