import fs from 'fs';

const getSuggestionsFilePath = () => {
    return `${process.cwd()}/parsed-files/matches.csv`;
}

const ROW_SEPARATOR = '\n';
const COLUMN_SEPARATOR = ';';

const initData = () => {
    const csvFilePath = getSuggestionsFilePath();
    if (fs.existsSync(csvFilePath) === false) {
        return null;
    }
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const lines = [...csvData.split(ROW_SEPARATOR)].slice(1).map((line) => line.split(COLUMN_SEPARATOR));
    return lines.map((line) => {
        return {
            originalSummary: line[0],
            originalCategory: line[1],
            summary: line[2],
            category: line[3],
        };
    });
};

/**
 * Returns the suggested data for the given summary and category.
 * @param data - The data from the CSV file with all the matches
 * @param originalSummary - The original operation summary
 * @param originalCategory - The original operation category
 * @returns {summary: string, category: string}[]} - The suggested data
 */
const suggestData = (data, originalSummary, originalCategory) => {
    if (!data) {
        return [];
    }
    return data.filter((entry) => {
        return entry.originalSummary === originalSummary && entry.originalCategory === originalCategory;
    })
        .map((entry) => {
            return {
                summary: entry.summary,
                category: entry.category,
            };
        });
};

/**
 * Returns the categorized entries.
 * @param {MMEntry} entry - The entry parsed from the CSV file
 * @returns {Promise<void>}
 */
const saveSuggestedData = async (entry) => {
    const outputFile = getSuggestionsFilePath();
    const columns = ['Oryginalny opis', 'Oryginalna kategoria', 'Nadany opis', 'Nadana kategoria'];
    const content = [];
    if (fs.existsSync(outputFile) === false) {
        content.push(columns.join(COLUMN_SEPARATOR));
    }
    const toSave = [
        entry.originalSummary,
        entry.originalCategory,
        entry.summary,
        entry.categoryId,
    ]
    content.push(toSave.join(COLUMN_SEPARATOR));

    const stream = fs.createWriteStream(outputFile, { flags: 'a' });
    stream.write(`${content.join(ROW_SEPARATOR)}${ROW_SEPARATOR}`);
    stream.close();

    console.log(`✅ Przypisane kategorie zapisano w pliku ${outputFile}.`);
};

export {
    initData,
    suggestData,
    saveSuggestedData
}
