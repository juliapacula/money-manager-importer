import path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const ROW_SEPARATOR = '\r\n';
const COLUMN_SEPARATOR = ';';

const getParsedFilePath = (originalFilePath) => {
    return `${process.cwd()}/parsed-files/${path.basename(originalFilePath, '.csv')}-parsed.csv`;
};

const isFileParsed = (originalFilePath) => {
    return existsSync(getParsedFilePath(originalFilePath));
};

/**
 * Creates the parsed CSV file.
 * @param {string} filePath - The path to the original CSV file
 * @param {ParsedEntry[]} data - The data to save
 */
const createParsedCSV = (filePath, data) => {
    const parsedFilePath = getParsedFilePath(filePath);
    const fileHeaders = ['id', 'date', 'summary', 'amount', 'category'];
    const dataToSave = [...data].map((row) => {
        const rowDataInOrder = [row.id, row.date, row.summary, row.amount.toFixed(2), row.category ? row.category : ''];
        return `${rowDataInOrder.join(COLUMN_SEPARATOR)}`;
    })
        .join(ROW_SEPARATOR);
    writeFileSync(parsedFilePath, `${fileHeaders.join(COLUMN_SEPARATOR)}${ROW_SEPARATOR}${dataToSave}`);
    console.log(`✅ Utworzono plik ${parsedFilePath}.`);
};

/**
 * Returns the parsed CSV data.
 * @param {string} filePath - The path to the original CSV file
 * @returns {ParsedEntry[]}
 */
const readParsedCSV = (filePath) => {
    const csvData = readFileSync(getParsedFilePath(filePath), 'utf8');
    return [...csvData.split(ROW_SEPARATOR)]
        .slice(1)
        .filter((line) => !!line)
        .map((line) => line.split(COLUMN_SEPARATOR))
        .map((line) => {
            return {
                id: line[0],
                date: line[1],
                summary: line[2],
                amount: parseFloat(line[3]),
                category: line[4] ? line[4] : null
            };
        });
}

export {
    isFileParsed,
    createParsedCSV,
    readParsedCSV,
}
