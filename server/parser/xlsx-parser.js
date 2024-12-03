import xlsx from 'xlsx';

function cleanString(str) {
  return str ? str.trim().replace(/\s+/g, ' ') : undefined;
}

function splitTitle(text) {
  if (!text) return { title_main: undefined, title_subtitle: undefined };
  const parts = text.split(':').map(part => part.trim());
  return {
    title_main: parts[0],
    title_subtitle: parts.length > 1 ? parts.slice(1).join(': ') : undefined
  };
}

function splitSubjects(subject) {
  if (!subject) return { subject_main: undefined, subject_other: [] };
  const subjects = subject.split(';').map(s => s.trim());
  return {
    subject_main: subjects[0],
    subject_other: subjects.slice(1)
  };
}

export async function parseXLSX(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet);

    return rawData.map(row => {
      const titleInfo = splitTitle(cleanString(row['Title/Subtitle']));
      const subjectInfo = splitSubjects(cleanString(row['Subject']));

      return {
        ...titleInfo,
        series_title: cleanString(row['Series Title']),
        author: cleanString(row['Author']),
        publication_year: row['Publication Year'],
        publisher: cleanString(row['Publisher'])?.replace(/,\s*$/, ''),
        material_type: cleanString(row['Material Type']),
        lexile: cleanString(row['Lexile']),
        ...subjectInfo,
        isbn: cleanString(row['ISBN']),
        issn: cleanString(row['ISSN'])
      };
    });
  } catch (error) {
    console.error('Error parsing XLSX:', error);
    throw error;
  }
}

export default parseXLSX;
