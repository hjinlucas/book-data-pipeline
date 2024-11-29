import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTRIBUTOR_ROLES = {
  A01: 'Author',
  A12: 'Illustrator',
  A07: 'Editor',
  B01: 'Translator',
  A38: 'Original Author',
  A02: 'Co-author',
  A13: 'Photographor'
};

const FORMAT_CODES = {
  PB: 'Paperback',
  BB: 'Hardback',
  BC: 'Paperback Book',
  DG: 'Electronic Book',
  AC: 'Audio CD',
  TH: 'Thesis',
  LB: 'Library binding',
  AA: 'Audio',
  BA: 'Book',
  BD: 'Book and DVD package',
  BE: 'Book and CD package',
  BH: 'Leather / fine binding',
  BI: 'Book Illustrated',
  BJ: 'Book and Audio package',
  BK: 'Book and Disk package',
  BL: 'Book and CD-ROM package',
  BM: 'Book and Cassette package',
  BP: 'Plastic / vinyl bound book',
  BZ: 'Other book format',
  CA: 'Sheet map',
  CB: 'Sheet map folded',
  CD: 'Digital Audio',
  DA: 'Digital content',
  DB: 'Digital textbook',
  DC: 'Digital container format',
  DD: 'Digital document',
  DE: 'Digital edition',
  DF: 'Digital format',
  VA: 'Video',
  VF: 'DVD Video',
  VI: 'DVD Interactive',
  VJ: 'VHS PAL',
  VZ: 'VOD'
};

function stripHTML(htmlContent) {
  if (!htmlContent) return '';

  if (typeof htmlContent === 'object') {
    if (htmlContent._text) {
      htmlContent = htmlContent._text;
    } else if (htmlContent.p) {
      htmlContent = Array.isArray(htmlContent.p)
        ? htmlContent.p.map(p => typeof p === 'object' ? p._text || '' : p).join(' ')
        : htmlContent.p;
    }
  }

  const dom = new JSDOM(htmlContent);
  return dom.window.document.body.textContent?.trim() || '';
}

function extractGenres(subjects) {
  // 查找第一个包含 b070 的 subject
  const subjectWithGenre = subjects.find(s => s.b070);

  if (!subjectWithGenre) {
    return {
      main: 'Not Specified',
      subgenres: []
    };
  }

  const genreString = subjectWithGenre.b070;
  // 按斜线分割并去除空白
  const genreParts = genreString.split('/').map(part => part.trim());

  return {
    main: genreParts[0],
    subgenres: genreParts.slice(1).filter(Boolean) // 过滤掉空字符串
  };
}
function parseAudienceRange(audienceRanges) {
  if (!Array.isArray(audienceRanges)) {
    audienceRanges = audienceRanges ? [audienceRanges] : [];
  }

  // 寻找美国年级范围 (b074 = 17)
  const gradeRange = audienceRanges.find(range => range.b074 == '17');
  
  if (gradeRange) {
    // 找到起始和结束年级
    const startValues = [];
    const endValues = [];
    
    // 遍历所有的 b075 和 b076
    const b075Array = Array.isArray(gradeRange.b075) ? gradeRange.b075 : [gradeRange.b075];
    const b076Array = Array.isArray(gradeRange.b076) ? gradeRange.b076 : [gradeRange.b076];
    
    b075Array.forEach((type, index) => {
      if (type == '03') {
        startValues.push(b076Array[index]);
      } else if (type == '04') {
        endValues.push(b076Array[index]);
      }
    });

    const startGrade = startValues[0] || 'Unknown';
    const endGrade = endValues[0] || 'Unknown';
    
    return `Grade ${startGrade}-${endGrade}`;
  }
  
  return 'Grade range not specified';
}
async function parseOnixXML(filePath) {
  try {
    const xmlData = await fs.readFile(filePath, 'utf8');
    const fileSizeInBytes = Buffer.byteLength(xmlData, 'utf8');
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

    console.log(`File Size: ${fileSizeInMB} MB`);
    console.log('XML Data Length:', xmlData.length);

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '_text',
      isEmptyNode: () => true
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
     

      const collection = product.descriptivedetail?.collection || {};
      const seriesName = collection.titledetail?.titleelement?.b203 || 'Not Specified';
      const seriesPosition = collection.collectionsequence
        ? parseInt(collection.collectionsequence.x481, 10) || 'Not Specified'
        : 'Not Specified';

      const rawSummaries = textContent
        .filter(t => t.d104)
        .map(t => {
          if (typeof t.d104 === 'string') {
            return t.d104;
          } else if (typeof t.d104 === 'object') {
            if (Array.isArray(t.d104.p)) {
              return t.d104.p
                .map(p => typeof p === 'object' ? p._text || '' : p)
                .join(' ');
            } else if (t.d104.p) {
              return typeof t.d104.p === 'object' ? t.d104.p._text || '' : t.d104.p;
            } else if (t.d104._text) {
              return t.d104._text;
            }
          }
          return '';
        })
        .filter(Boolean);

      const summary = rawSummaries.length
        ? rawSummaries.map(stripHTML).join(' ').trim()
        : 'No summary available';

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
        summary: summary,
        series: {
          name: seriesName,
          position: seriesPosition
        },
        genre: extractGenres(subjects),  // 修改这里，直接使用新的 extractGenres 函数返回的对象

        form: FORMAT_CODES[product.descriptivedetail?.b014] || product.descriptivedetail?.b014 || 'Unknown Format',
        pages: extent.find(e => e.b218 == '00')?.b219 || 'Not Specified',

        isbn: {
          isbn13: productIdentifiers.find(id => id.b221 == '15')?.b244 || 'Not Available',
          isbn10: productIdentifiers.find(id => id.b221 == '02')?.b244 || 'Not Available'
        },
        type: subjects.some(s => s.b067 == '10' && s.b069.startsWith('JNF'))
          ? 'Nonfiction'
          : 'Fiction',
        publisher: product.publishingdetail?.publisher?.b081 || 'Unknown Publisher',
        target_audience: parseAudienceRange(product.descriptivedetail?.audiencerange) || 'Not Specified'
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
    const outputFilePath = path.join(__dirname, 'parsed_books.json');
    await fs.writeFile(outputFilePath, JSON.stringify(books, null, 2), 'utf8');
    console.log(`Parsed results saved to: ${outputFilePath}`);
  } catch (error) {
    console.error('Error running parser:', error);
  }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  main();
}

export default parseOnixXML;