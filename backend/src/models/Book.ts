import mongoose, { Document, Model } from 'mongoose';

// 定义接口
interface ICreator {
  name: string;
  role: string;
}

interface ISeries {
  name: string;
  position: string | number;
}

interface IISBN {
  isbn13?: string;
  isbn10?: string;
}

interface IBook extends Document {
  title: {
    main: string;
    subtitle: string;
  };
  creators: ICreator[];
  copyright_date: number;
  summary: string;
  series: ISeries;
  genre: {
    main: string;
    subgenres: string[];
  };
  form: string;
  pages: number;
  isbn: IISBN;
  type: 'Fiction' | 'Nonfiction';
  publisher: string;
  target_audience: string;
  createdAt: Date;
  updatedAt: Date;
}

// 定义静态方法接口
interface BookModel extends Model<IBook> {
  getAllMainGenres(): Promise<string[]>;
  getSubgenresByMain(mainGenre: string): Promise<string[]>;
  findBooksByGenre(
    genre: string,
    page?: number,
    limit?: number
  ): Promise<{
    books: IBook[];
    total: number;
    pages: number;
  }>;
}

// Schema 定义
const BookSchema = new mongoose.Schema({
  title: {
    main: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    }
  },
  creators: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ['Author', 'Illustrator', 'Editor', 'Translator', 'Original Author', 'Co-author']
    }
  }],
  copyright_date: {
    type: Number,
    index: true
  },
  summary: {
    type: String,
    trim: true
  },
  series: {
    name: {
      type: String,

    },
    position: {
      type: mongoose.Schema.Types.Mixed,

    }
  },
  genre: {
    main: {
      type: String,
      trim: true,
      index: true
    },
    subgenres: [{
      type: String,
      trim: true
    }]
  },
  form: {
    type: String,
    trim: true,
    index: true
  },
  pages: {
    type: Number,
    min: 0
  },
  isbn: {
    isbn13: {
      type: String,
      sparse: true,
      trim: true
    },
    isbn10: {
      type: String,
      sparse: true,
      trim: true
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['Fiction', 'Nonfiction'],
    index: true
  },
  publisher: {
    type: String,
    trim: true,
    index: true
  },
  target_audience: {
    type: String,
    trim: true,
    index: true
  }
}, {
  timestamps: true
});

// 添加索引
BookSchema.index({ 'title.main': 1, type: 1 });
BookSchema.index({ 'genre.main': 1, 'genre.subgenres': 1 });
BookSchema.index({ publisher: 1, copyright_date: 1 });

// 添加静态方法
BookSchema.statics.getAllMainGenres = async function(): Promise<string[]> {
  return this.distinct('genre.main');
};

BookSchema.statics.getSubgenresByMain = async function(mainGenre: string): Promise<string[]> {
  return this.distinct('genre.subgenres', {
    'genre.main': mainGenre
  });
};

BookSchema.statics.findBooksByGenre = async function(
  genre: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  books: IBook[];
  total: number;
  pages: number;
}> {
  const query = {
    $or: [
      { 'genre.main': genre },
      { 'genre.subgenres': genre }
    ]
  };

  const [books, total] = await Promise.all([
    this.find(query)
      .sort({ 'title.main': 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    this.countDocuments(query)
  ]);

  return {
    books,
    total,
    pages: Math.ceil(total / limit)
  };
};

// 导出模型
const Book = mongoose.model<IBook, BookModel>('Book', BookSchema);
export default Book;