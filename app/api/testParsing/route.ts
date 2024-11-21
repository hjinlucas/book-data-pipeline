import fs from "fs";
import path from "path";
import { parseCSV, parseONIXXML } from "../../utils/parseFiles";

export async function GET() {
  try {
    // File paths
    const csvPath = path.join(process.cwd(), "app/data/CRWReportJob148737.csv");
    const xmlPath = path.join(process.cwd(), "app/data/LEEANDLOW_20210707.xml");

    // Read files
    const csvString = fs.readFileSync(csvPath, "utf8");
    const xmlString = fs.readFileSync(xmlPath, "utf8");

    // Parse files
    const csvRecords = parseCSV(csvString);
    const xmlRecords = parseONIXXML(xmlString);

    // Return combined parsed data
    return new Response(JSON.stringify({ csvRecords, xmlRecords }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    let errorMessage = "An unknown error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
