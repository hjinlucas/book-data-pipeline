import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    main: {
      type: String,

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
      trim: true,
    },
    role: {
      type: String,
      trim: true
    }
  }],
  copyright_date: {

    type: Number,
    index: true,
    default: 0
  },
  summary: {

    type: String,
    trim: true,
    default: ''
  },
  series: {
    name: {
      type: String,
      trim: true,
      default: '',

    },
    position: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
      default: '',

    }
  },
  genre: {
    main: {
      type: String,
      trim: true,
      index: true,

      default: ''
    },
    subgenres: [{
      type: String,
      trim: true,
      default:'',

    }]
  },
  form: {
    type: String,
    trim: true,
    index: true,

    default: ''
  },
  pages: {
    type: Number,
    min: 0,
    default: 0
  },
  isbn: {
    isbn13: {
      type: String,
      sparse: true,
      trim: true,
      default: ''
    },
    isbn10: {
      type: String,
      sparse: true,
      trim: true,
      default: ''
    }
  },
  type: {
    type: String,

    enum: ['Fiction', 'Nonfiction'],
    index: true
  },
  publisher: {
    type: String,
    trim: true,
    index: true,
    default: ''
  },
  target_audience: {
    type: String,
    trim: true,
    index: true,
    default: ''
  }
}, {
  timestamps: true
});

BookSchema.index({ 'title.main': 1, type: 1 });
BookSchema.index({ 'genre.main': 1, 'genre.subgenres': 1 });
BookSchema.index({ publisher: 1, copyright_date: 1 });

BookSchema.statics.getAllMainGenres = async function () {
  return this.distinct('genre.main');
};

BookSchema.statics.getSubgenresByMain = async function (mainGenre) {
  return this.distinct('genre.subgenres', {
    'genre.main': mainGenre
  });
};

BookSchema.statics.findBooksByGenre = async function (genre, page = 1, limit = 10) {
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

const Book = mongoose.model('Book', BookSchema);
export default Book;