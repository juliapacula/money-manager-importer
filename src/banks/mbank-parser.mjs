import { readFileSync } from 'fs';

const mBankHeaders = ['#Data operacji', '#Opis operacji', '#Kwota', '#Kategoria', '#Rachunek'];

/**
 * Prepares the CSV data.
 * @param csvData
 * @returns {string[][]} - The cleaned CSV data
 */
const clearMBankCSV = (csvData) => {
    const ROW_SEPARATOR = '\r\n';
    const COLUMN_SEPARATOR = ';';
    const data = csvData.substring(csvData.indexOf(mBankHeaders[0]));
    const NUMBER_OF_COLUMNS = mBankHeaders.length;
    // TODO: problem z wpisami, które mają średniki w summary

    return data.split(ROW_SEPARATOR)
        .map((row) => {
            return row.split(COLUMN_SEPARATOR)
                .splice(0, NUMBER_OF_COLUMNS)
                .map((column) => {
                    return column.trim()
                        .replaceAll('"', '')
                        .replaceAll(/\s\s+/g, ' ');
                });
        });
};

/**
 * Returns the parsed CSV data.
 * @param csvFilePath - The path to the CSV file
 * @returns {ParsedEntry[]} - The parsed CSV data ordered from the oldest to the newest
 */
const parseMBankCSV = (csvFilePath) => {
    const csvData = readFileSync(csvFilePath, 'utf8');
    const lines = clearMBankCSV(csvData);
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
                case mBankHeaders[0]:
                    entry.date = currentLine;
                    break;
                case mBankHeaders[1]:
                    entry.summary = currentLine;
                    break;
                case mBankHeaders[2]:
                    entry.amount = parseFloat(currentLine.replaceAll(' PLN', '').replaceAll(',', '.'));
                    break;
                case mBankHeaders[3]:
                    entry.category = currentLine;
                    break;
                case mBankHeaders[4]:
                default:
                    break;
            }
        });
        return entry;
    })
        .filter((entry) => Object.keys(entry).length > 0);
};

export {
    parseMBankCSV,
};
