export interface BookMetadata {
  isbn?: string;
  title: string;
  subtitle?: string;
  author: string;
  publicationYear?: string;
  publisher?: string;
  materialType?: string;
  subject?: string;
}

export interface XMLBook {
  isbn?: string;
  title: string;
  author: string;
  publicationYear?: string;
  publisher?: string;
  materialType?: string;
  subject?: string;
}

export interface CSVBookRecord {
  ISBN?: string;
  "Title/Subtitle"?: string;
  Author?: string;
  "Publication Year"?: string;
  Publisher?: string;
  "Material Type"?: string;
  Subject?: string;
}
