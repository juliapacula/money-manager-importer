import { readFileSync } from 'fs';
import { parseCsvRow } from '../utils/csv.mjs';

const revolutHeaders = ['Type', 'Product', 'Started Date', 'Completed Date', 'Description', 'Amount', 'Fee', 'Currency', 'State', 'Balance'];

/**
 * Prepares the CSV data.
 * @param csvData
 * @returns {string[][]} - The cleaned CSV data
 */
const clearRevolutCSV = (csvData) => {
    const ROW_SEPARATOR = '\n';
    const COLUMN_SEPARATOR = ',';
    const data = csvData;
    const NUMBER_OF_COLUMNS = revolutHeaders.length;

    return data.split(ROW_SEPARATOR)
        .map((row) => parseCsvRow(row, COLUMN_SEPARATOR))
        .filter((row) => row.length === NUMBER_OF_COLUMNS);
};

/**
 * Returns the parsed CSV data.
 * @param csvFilePath - The path to the CSV file
 * @returns {ParsedEntry[]} - The parsed CSV data ordered from the oldest to the newest
 */
const parseRevolutCSV = (csvFilePath) => {
    const csvData = readFileSync(csvFilePath, 'utf8');
    const lines = clearRevolutCSV(csvData);
    const headers = lines[0];
    const data = [...lines].slice(1);

    return data.map((line, lineIndex) => {
        const entry = {};
        entry.id = `${lineIndex}`;
        entry.category = null;
        headers.forEach((header, index) => {
            const currentLine = line[index];
            if (!currentLine || currentLine === '') {
                return;
            }
            switch (header) {
                case revolutHeaders[2]:
                    entry.date = currentLine.substring(0, 10);
                    break;
                case revolutHeaders[4]:
                    entry.summary = currentLine;
                    break;
                case revolutHeaders[5]:
                    entry.amount = parseFloat(currentLine);
                    break;
                case revolutHeaders[0]:
                case revolutHeaders[1]:
                case revolutHeaders[3]:
                case revolutHeaders[6]:
                case revolutHeaders[7]:
                case revolutHeaders[8]:
                case revolutHeaders[9]:
                default:
                    break;
            }
        });
        return entry;
    })
        .filter((entry) => Object.keys(entry).length > 0);
};

export {
    parseRevolutCSV,
};
