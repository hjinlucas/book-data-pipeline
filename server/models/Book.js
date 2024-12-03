import mongoose from "mongoose";

const CreatorSchema = new mongoose.Schema({
  name: String,
  role: String,
});

const BookSchema = new mongoose.Schema(
  {
    title: {
      main: { type: String, required: true },
      subtitle: { type: String, required: false },
    },
    creators: [CreatorSchema],
    copyright_date: { type: Number, required: false },
    summary: { type: String, required: true },
    series: {
      name: { type: String, required: false },
      position: { type: Number, required: false },
    },
    genre: {
      main: { type: String, required: false },
      subgenres: { type: [String], required: false },
    },
    form: { type: String, required: false },
    pages: { type: Number, required: false },
    isbn: {
      isbn13: { type: String, required: true },
      isbn10: { type: String, required: false },
    },
    type: { type: String, required: false },
    publisher: { type: String, required: false },
    target_audience: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
