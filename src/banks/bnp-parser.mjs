import { readFileSync } from 'fs';
import { parseCsvRow } from '../utils/csv.mjs';

const bnpHeaders = ['Data transakcji', 'Data zaksięgowania', 'Data odrzucenia', 'Kwota', 'Waluta', 'Nadawca', 'Odbiorca', 'Opis', 'Produkt', 'Typ transakcji', 'Kwota zlecenia', 'Waluta zlecenia', 'Status', 'Saldo po transakcji'];

/**
 * Prepares the CSV data.
 * @param csvData
 * @returns {string[][]} - The cleaned CSV data
 */
const clearBNPCSV = (csvData) => {
    const ROW_SEPARATOR = '\r\n';
    const COLUMN_SEPARATOR = ';';
    const data = csvData.substring(csvData.indexOf(bnpHeaders[0]));
    const NUMBER_OF_COLUMNS = bnpHeaders.length;

    return data.split(ROW_SEPARATOR)
        .map((row) => {
            return parseCsvRow(row, COLUMN_SEPARATOR)
                .map((column) => {
                    return column.replaceAll(COLUMN_SEPARATOR, '');
                });
        })
        .filter((row) => { return row.length === NUMBER_OF_COLUMNS; });
};

/**
 * Returns the parsed CSV data.
 * @param csvFilePath - The path to the CSV file
 * @returns {ParsedEntry[]} - The parsed CSV data ordered from the oldest to the newest
 */
const parseBnpCSV = (csvFilePath) => {
    const csvData = readFileSync(csvFilePath, 'utf8');
    const lines = clearBNPCSV(csvData);
    const headers = lines[0];
    const data = [...lines].slice(1);

    return data.reverse().map((line, lineIndex) => {
        const entry = {};
        headers.forEach((header, index) => {
            const currentLine = line[index];
            if (!currentLine || currentLine === '') {
                return;
            }
            entry.id = `${lineIndex}`;
            switch (header) {
                case bnpHeaders[0]:
                    entry.date = currentLine;
                    break;
                case bnpHeaders[7]:
                    entry.summary = currentLine ? currentLine : null;
                    break;
                case bnpHeaders[9]:
                    entry.summary = `${currentLine} ${entry.summary}`;
                    break;
                case bnpHeaders[3]:
                    entry.amount = parseFloat(currentLine.replaceAll(' PLN', '').replaceAll(' ', '').replaceAll(',', '.'));
                    break;
                default:
                    break;
            }
        });
        return entry;
    })
        .filter((entry) => Object.keys(entry).length > 0);
};

export {
    parseBnpCSV,
};
