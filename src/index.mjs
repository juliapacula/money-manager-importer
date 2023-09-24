import { categorizeMBankEntries, parseMBankCSV } from './banks/mbank.mjs';
import yargs from 'yargs';
import fs from 'fs';
import path from 'path';

// Parsowanie argumentów z użyciem yargs
const argv = yargs(process.argv.slice(2))
    .option('input', {
        alias: 'i',
        description: 'Ścieżka do pliku CSV z banku',
        demandOption: true,
    })
    .option('bank', {
        alias: 'b',
        description: 'Typ banku, z którego pochodzi plik CSV',
        default: 'mBank',
    })
    .help()
    .argv;

const csvFilePath = argv.input;
if (fs.existsSync(csvFilePath) === false || path.extname(csvFilePath) !== '.csv') {
    throw new Error('Nie znaleziono pliku CSV.');
}

let parsedCsv;

if (argv.bank === 'mBank') {
    parsedCsv = parseMBankCSV(csvFilePath);
    categorizeMBankEntries(parsedCsv).then();
} else {
    throw new Error('Nieobsługiwany typ banku.');
}
