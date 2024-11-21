import { XMLParser } from "fast-xml-parser";
import Papa from "papaparse";
import { BookMetadata, CSVBookRecord } from "../types/books";
import { ONIXMessage, Product } from "../types/onix";

export interface MARCRecord {
  leader: string;
  controlFields: { [key: string]: string };
  dataFields: { [key: string]: { [subField: string]: string } };
}

export function parseONIXXML(xmlString: string): BookMetadata[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
  });

  // Parse the XML string
  const parsedData = parser.parse(xmlString) as { ONIXMessage: ONIXMessage };

  if (!parsedData.ONIXMessage || !parsedData.ONIXMessage.Product) {
    throw new Error("Invalid ONIX XML structure.");
  }

  const products = Array.isArray(parsedData.ONIXMessage.Product)
    ? parsedData.ONIXMessage.Product
    : [parsedData.ONIXMessage.Product];

  // Map Products to BookMetadata
  return products.map(mapProductToMetadata);
}

// Map Product to BookMetadata
function mapProductToMetadata(product: Product): BookMetadata {
  const identifiers = Array.isArray(product.ProductIdentifier)
    ? product.ProductIdentifier
    : [product.ProductIdentifier];

  // Extract ISBN (ProductIDType 15)
  const isbn =
    identifiers.find((id) => id.ProductIDType === "15")?.IDValue ||
    "Unknown ISBN";

  return {
    isbn,
    title: product.RecordReference || "Unknown Title",
    author: "Unknown Author", // Placeholder until parsing contributors
    publisher: "Unknown Publisher", // Placeholder, depends on ONIX structure
    materialType: "Book",
    subject: "General",
  };
}

export function parseCSV(csvString: string): BookMetadata[] {
  const parsedData = Papa.parse<CSVBookRecord>(csvString, {
    header: true,
  }).data;

  return parsedData.map((record) => ({
    isbn: record.ISBN || undefined,
    title: record["Title/Subtitle"] || "",
    author: record.Author || "",
    publicationYear: record["Publication Year"] || undefined,
    publisher: record.Publisher || undefined,
    materialType: record["Material Type"] || undefined,
    subject: record.Subject || undefined,
  }));
}
