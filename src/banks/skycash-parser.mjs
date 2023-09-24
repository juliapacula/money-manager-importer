import { readFileSync } from 'fs';
import { parseCsvRow } from '../utils/csv.mjs';

const skycashHeaders = ['data', 'identyfikator transakcji', 'opis operacji', 'wiadomość', 'kwota', 'saldo'];

/**
 * Prepares the CSV data.
 * @param csvData
 * @returns {string[][]} - The cleaned CSV data
 */
const clearSkycashCSV = (csvData) => {
    const ROW_SEPARATOR = '\r\n';
    const COLUMN_SEPARATOR = ',';
    const data = csvData;
    const NUMBER_OF_COLUMNS = skycashHeaders.length;

    return data.split(ROW_SEPARATOR)
        .map((row) => parseCsvRow(row, COLUMN_SEPARATOR).splice(0, NUMBER_OF_COLUMNS))
        .filter((row) => row.length === NUMBER_OF_COLUMNS);
};

/**
 * Returns the parsed CSV data.
 * @param csvFilePath - The path to the CSV file
 * @returns {ParsedEntry[]} - The parsed CSV data ordered from the oldest to the newest
 */
const parseSkycashCSV = (csvFilePath) => {
    const csvData = readFileSync(csvFilePath, 'utf8');
    const lines = clearSkycashCSV(csvData);
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
                case skycashHeaders[0]:
                    const [day, month, year] = currentLine.substring(0, 10).split('.');
                    entry.date = `${year}-${month}-${day}`;
                    break;
                case skycashHeaders[2]:
                    entry.summary = currentLine;
                    break;
                case skycashHeaders[4]:
                    entry.amount = parseFloat(currentLine.replaceAll('"','').replaceAll(',', '.').replace(' zł', ''));
                    break;
                case skycashHeaders[1]:
                case skycashHeaders[3]:
                case skycashHeaders[5]:
                default:
                    break;
            }
        });
        return entry;
    })
        .filter((entry) => Object.keys(entry).length > 0);
};

export {
    parseSkycashCSV,
};
