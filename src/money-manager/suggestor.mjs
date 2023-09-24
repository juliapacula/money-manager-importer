import fs from 'fs';

const initData = () => {
    const csvFilePath = `${process.cwd()}/parsed-files/matches.csv`;
    if (fs.existsSync(csvFilePath) === false) {
        return null;
    }
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvData.split('\n').map((line) => line.split(','));
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

export {
    initData,
    suggestData,
}
