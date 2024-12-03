function cleanString(str) {
  return str ? str.trim().replace(/\s+/g, ' ') : undefined;
}

export function transformXLSXToDBSchema(xlsxData) {
  return xlsxData.map(row => {
    // Ensure required fields have default values
    const transformedData = {
      title: {
        main: row.title_main || 'Untitled',
        subtitle: cleanString(row.title_subtitle)
      },
      creators: row.author ? [{
        name: cleanString(row.author),
        role: 'Author'
      }] : [],
      copyright_date: row.publication_year ? parseInt(row.publication_year) : undefined,
      summary: cleanString(row.summary) || 'No summary available', // Required field
      series: {
        name: cleanString(row.series_title),
        position: undefined
      },
      genre: {
        main: cleanString(row.subject_main),
        subgenres: row.subject_other || []
      },
      form: cleanString(row.material_type),
      pages: undefined,
      isbn: {
        isbn13: cleanString(row.isbn) || '0000000000000', // Required field
        isbn10: undefined
      },
      type: row.material_type?.toLowerCase().includes('book') ? 'Book' : 'Other',
      publisher: cleanString(row.publisher),
      target_audience: undefined,
      lexile: cleanString(row.lexile),
      issn: cleanString(row.issn)
    };

    console.log('Transformed row:', transformedData);
    return transformedData;
  });
}

export function transformONIXToDBSchema(onixData) {
  return onixData.map(product => ({
    title: {
      main: product.title?.main,
      subtitle: product.title?.subtitle
    },
    creators: product.contributors?.map(c => ({
      name: c.name,
      role: c.role
    })) || [],
    copyright_date: product.copyright_year,
    summary: product.description,
    series: {
      name: product.series?.name,
      position: product.series?.number
    },
    genre: {
      main: product.subject_main,
      subgenres: product.subjects || []
    },
    form: product.product_form,
    pages: product.extent,
    isbn: {
      isbn13: product.isbn13,
      isbn10: product.isbn10
    },
    type: product.product_type,
    publisher: product.publisher_name
  }));
}
