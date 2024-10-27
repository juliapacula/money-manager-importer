import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import { parseFile } from './banks/index.mjs';
import { processEntries } from './money-manager/index.mjs';

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

const parsedCsv = parseFile(csvFilePath, argv.bank);
processEntries(argv.bank, parsedCsv.entries).then();
