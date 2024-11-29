import mongoose from 'mongoose';

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

BookSchema.index({ 'title.main': 1, type: 1 });
BookSchema.index({ 'genre.main': 1, 'genre.subgenres': 1 });
BookSchema.index({ publisher: 1, copyright_date: 1 });

BookSchema.statics.getAllMainGenres = async function() {
  return this.distinct('genre.main');
};

BookSchema.statics.getSubgenresByMain = async function(mainGenre) {
  return this.distinct('genre.subgenres', {
    'genre.main': mainGenre
  });
};

BookSchema.statics.findBooksByGenre = async function(genre, page = 1, limit = 10) {
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