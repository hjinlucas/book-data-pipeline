import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Code mapping tables
const CONTRIBUTOR_ROLES = {
  A01: 'Author',
  A12: 'Illustrator',
  A07: 'Editor',
  B01: 'Translator',
  A38: 'Original Author',
  A02: 'Co-author'
};

const FORMAT_CODES = {
  PB: 'Paperback',
  BB: 'Hardback',
  BC: 'Paperback Book',
  DG: 'Electronic Book',
  AC: 'Audio CD'
};

const BISAC_TO_GENRE = {
  JNF: 'Nonfiction',
  JUV: 'Juvenile Fiction',
  JNF026: 'Educational',
  JUV030: 'Fiction',
  JNF003: 'Animals/Pets'
};

function getGenreFromBISAC(bisacCode) {
  for (let i = bisacCode.length; i > 0; i--) {
    const partialCode = bisacCode.substring(0, i);
    if (BISAC_TO_GENRE[partialCode]) {
      return BISAC_TO_GENRE[partialCode];
    }
  }
  return 'Unknown Genre';
}

async function parseOnixXML(filePath) {
  try {
    const xmlData = await fs.readFile(filePath, 'utf8');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '_text'
    });

    const result = parser.parse(xmlData);
    const products = Array.isArray(result.ONIXmessage.product)
      ? result.ONIXmessage.product
      : [result.ONIXmessage.product];

    return products.map(product => {
      const titleDetail = product.descriptivedetail?.titledetail?.titleelement || {};
      const contributors = Array.isArray(product.descriptivedetail?.contributor)
        ? product.descriptivedetail.contributor
        : product.descriptivedetail?.contributor
        ? [product.descriptivedetail.contributor]
        : [];
      const subjects = Array.isArray(product.descriptivedetail?.subject)
        ? product.descriptivedetail.subject
        : product.descriptivedetail?.subject
        ? [product.descriptivedetail.subject]
        : [];
      const textContent = Array.isArray(product.collateraldetail?.textcontent)
        ? product.collateraldetail.textcontent
        : product.collateraldetail?.textcontent
        ? [product.collateraldetail.textcontent]
        : [];
      const productIdentifiers = Array.isArray(product.productidentifier)
        ? product.productidentifier
        : product.productidentifier
        ? [product.productidentifier]
        : [];
      const extent = Array.isArray(product.descriptivedetail?.extent)
        ? product.descriptivedetail.extent
        : product.descriptivedetail?.extent
        ? [product.descriptivedetail.extent]
        : [];
      const audience = Array.isArray(product.descriptivedetail?.audience)
        ? product.descriptivedetail.audience
        : product.descriptivedetail?.audience
        ? [product.descriptivedetail.audience]
        : [];

      return {
        title: {
          main: titleDetail.b203 || 'Unknown Title',
          subtitle: titleDetail.b029 || ''
        },
        creators: contributors.map(c => ({
          name: c.b036 || 'Unknown',
          role: CONTRIBUTOR_ROLES[c.b035] || c.b035 || 'Unknown Role'
        })),
        copyright_date: product.publishingdetail?.copyrightstatement?.b087 || 'Not Specified',
        summary: textContent.find(t => t.x426 === '03')?.d104 || 'No summary available',
        series: {
          name: product.descriptivedetail?.series?.title || 'Not Specified',
          position: product.descriptivedetail?.series?.number || 'Not Specified'
        },
        genres: subjects
          .filter(s => s.b067 === '10')
          .map(s => getGenreFromBISAC(s.b069)),
        format: {
          form: FORMAT_CODES[product.descriptivedetail?.b014] || product.descriptivedetail?.b014 || 'Unknown Format',
          pages: extent.find(e => e.b218 === '00')?.b219 || 'Not Specified'
        },
        isbn: {
          isbn13: productIdentifiers.find(id => id.b221 === '15')?.b244 || 'Not Available',
          isbn10: productIdentifiers.find(id => id.b221 === '02')?.b244 || 'Not Available'
        },
        type: subjects.some(s => s.b067 === '10' && s.b069.startsWith('JNF'))
          ? 'Nonfiction'
          : 'Fiction',
        optional: {
          subgenres: subjects
            .find(s => s.b067 === '20')?.b070?.split(';')
            .map(topic => topic.trim()) || [],
          publisher: product.publishingdetail?.publisher?.b081 || 'Unknown Publisher',
          target_audience: audience.map(a => a.b206).join(', ') || 'Not Specified'
        }
      };
    });
  } catch (error) {
    console.error('Error parsing ONIX XML:', error);
    throw error;
  }
}

async function main() {
  try {
    const books = await parseOnixXML('testXML.xml');

    books.forEach((book, index) => {
      console.log('\n' + '='.repeat(80));
      console.log(`Book ${index + 1}:`);
      console.log('='.repeat(80));

      console.log(`Title: ${book.title.main}`);
      if (book.title.subtitle) {
        console.log(`Subtitle: ${book.title.subtitle}`);
      }

      console.log('\nCreators:');
      book.creators.forEach(creator => {
        console.log(`- ${creator.role}: ${creator.name}`);
      });

      console.log('\nCopyright Date:', book.copyright_date);
      console.log('Summary:', book.summary);

      console.log('\nSeries:');
      console.log(`Name: ${book.series.name}`);
      console.log(`Position: ${book.series.position}`);

      console.log('\nGenres:', book.genres.join(', '));
      console.log('Form:', book.format.form);
      console.log('Pages:', book.format.pages);

      console.log('\nISBN:');
      console.log(`ISBN-13: ${book.isbn.isbn13}`);
      console.log(`ISBN-10: ${book.isbn.isbn10}`);

      console.log('\nType of Book:', book.type);

      console.log('\nOptional Fields:');
      console.log('Subgenres:', book.optional.subgenres.join(', '));
      console.log('Publisher:', book.optional.publisher);
      console.log('Target Audience:', book.optional.target_audience);
    });
  } catch (error) {
    console.error('Error running parser:', error);
  }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  main();
}

export default parseOnixXML;
