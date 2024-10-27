import { parseMBankCSV } from './mbank-parser.mjs';
import { parseRevolutCSV } from './revolut-parser.mjs';
import path from 'path';
import { createParsedCSV, isFileParsed, readParsedCSV } from './parsed-file-managing.mjs';
import { parseSkycashCSV } from './skycash-parser.mjs';

/**
 * @typedef {Object} ParsedEntry
 * @property {string} id - ID of the data row
 * @property {string} date - The operation date
 * @property {number} amount - The operation amount
 * @property {string} summary - The operation summary
 * @property {string?} category - The operation category assigned by bank, optional
 */

/**
 * Parses the CSV file.
 * @param csvFilePath - The path to the CSV file
 * @param bank - The bank type, available values: 'mBank', 'Revolut'
 * @returns {{ entries: ParsedEntry[], filePath: string }}
 */
const parseFile = (csvFilePath, bank) => {
    let parsedCsv;

    if (isFileParsed(csvFilePath)) {
        console.log(`✅ Wczytano z pliku ${path.basename(csvFilePath, '.csv')}-parsed.csv.`);
        return { entries: readParsedCSV(csvFilePath) };
    }

    if (bank === 'mBank') {
        parsedCsv = parseMBankCSV(csvFilePath);
    } else if (bank === 'Revolut') {
        parsedCsv = parseRevolutCSV(csvFilePath);
    } else if (bank === 'skycash') {
        parsedCsv = parseSkycashCSV(csvFilePath);
    } else {
        throw new Error('Nieobsługiwany typ banku.');
    }

    const createdFilePath = createParsedCSV(csvFilePath, parsedCsv);
    console.log(`✅ Utworzono plik ${path.basename(createdFilePath, '.csv')}`);

    return { entries: parsedCsv, filePath: createdFilePath };
};

export {
    parseFile,
};
