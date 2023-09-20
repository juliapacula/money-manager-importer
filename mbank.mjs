import chalk from 'chalk';

import { categorizeEntry, parseCategoryIdToCategory } from './categorizing.mjs';
import { initData, suggestData } from './suggestor.mjs';
import { saveCategorizedEntries, saveParsedEntries } from './file-saving.mjs';
import { getEntryOperation } from './entry-operations.mjs';

/**
 * @typedef {Object} MBankEntry
 * @property {string} date - The operation date
 * @property {string} summary - The operation summary
 * @property {string} category - The operation category assigned by mBank
 * @property {float} amount - The operation amount
 */

/**
 * Returns the parsed CSV data.
 * @param csvData
 * @returns {MBankEntry[]} - The parsed CSV data
 */
const parseMBankCSV = (csvData) => {
    const lines = csvData.split('\n').map((line) => line.split(';'));
    const headers = lines[0]
        .map((header) => header.trim().replaceAll('\r', '').replaceAll('\n', ''))
        .filter((header) => header !== '');
    const data = lines.slice(1);

    return data.map((line) => {
        const entry = {};
        headers.forEach((header, index) => {
            if (!line[index]) {
                return;
            }
            const currentLine = line[index].replaceAll('\r', '').replaceAll('\n', '').replaceAll('"', '').replaceAll(/\s\s+/g, ' ');
            if (currentLine === '') {
                return;
            }
            switch (header) {
                case '#Data operacji':
                    entry.date = currentLine;
                    break;
                case '#Opis operacji':
                    entry.summary = currentLine;
                    break;
                case '#Kwota':
                    entry.amount = parseFloat(currentLine.replaceAll(' PLN', '').replaceAll(',', '.'));
                    break;
                case '#Kategoria':
                    entry.category = currentLine;
                    break;
                case '#Rachunek':
                default:
                    break;
            }
        });
        return entry;
    })
        .filter((entry) => Object.keys(entry).length > 0)
        .reverse();
};

/**
 * @typedef {Object} MMEntry
 * @property {string} originalSummary - The original operation summary
 * @property {string} originalCategory - The original operation category
 * @property {string} date - The operation date
 * @property {float} amount - The operation amount
 * @property {string} summary - The operation summary
 * @property {string} account - The account name from the list of accounts
 * @property {string} operationType - The operation type from the list of operation types
 * @property {string} categoryId - The operation category from the list of categories in form of 'mainCategoryId.subCategoryId'
 * @property {mainCategory: string, subCategory: string} category - The operation category from the list of categories
 */

/**
 * Describes the entry.
 * @param {MBankEntry} entry
 */
const describeMBankEntry = (entry) => {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    const truncatedSummary = entry.summary.substring(0, 150);
    console.log(chalk.bold(`Kategoryzowanie wpisu z dnia: ${entry.date}`));
    console.log(chalk.red.bold(`${entry.amount.toFixed(2)}PLN `) +
        chalk.blue(`${truncatedSummary}${truncatedSummary.length < entry.summary.length ? '...' : ''}`));
}

/**
 * Returns the categorized entry.
 * @param {MBankEntry} entry - The entry to categorize
 * @param {Object[]} dataToSuggest - The data from the CSV file with all the matches
 * @returns {Promise<MMEntry|null>}
 */
const categorizeMBankEntry = async (entry, dataToSuggest) => {
    const suggestedData = suggestData(dataToSuggest, entry.summary, entry.category);
    const suggestedSummary = suggestedData.length > 0 ? suggestedData[0].summary : '';
    const suggestedCategory = suggestedData.length > 0 ? suggestedData[0].category : '';

    const categorizedEntry = await categorizeEntry(entry.amount > 0, 'mBank' , suggestedCategory, suggestedSummary);
    const account = categorizedEntry.account;
    const summary = categorizedEntry.summary;
    const operationType = categorizedEntry.operationType;
    const categoryId = categorizedEntry.category;
    const category = parseCategoryIdToCategory(operationType, categoryId);

    if (!category) {
        console.log('Nieprawidłowy numer kategorii. Ignorowanie operacji.');
        return null;
    } else {
        return {
            originalSummary: entry.summary,
            originalCategory: entry.category,
            date: entry.date.replaceAll('-', '.'),
            amount: entry.amount,
            summary,
            account,
            operationType,
            categoryId,
            category,
        };
    }
}

/**
 * Returns the categorized entries.
 * @param {MBankEntry[]} csvEntries - The entries from the CSV file
 */
const categorizeMBankEntries = async (csvEntries) => {
    const dataToSuggest = initData();

    for (const [index, entry] of csvEntries.entries()) {
        describeMBankEntry(entry);
        const entryOperation = await getEntryOperation();
        if (entryOperation.action === 'skip') {
            console.log(chalk.bold('Pominięto wpis.'));
            continue;
        } else if (entryOperation.action === 'split') {
            const newEntryAmount = parseFloat(entryOperation.newAmount);
            entry.amount -= newEntryAmount;
            const newEntry = {...entry, amount: newEntryAmount};
            csvEntries.splice(index + 1, 0, newEntry);
            console.log(chalk.bold('Dodano nowy wpis i zmodyfikowano aktualny:'));
            describeMBankEntry(entry);
        }

        const entryToSave = await categorizeMBankEntry(entry, dataToSuggest);
        if (!entryToSave) {
            continue;
        }
        await saveCategorizedEntries([entryToSave]);
        await saveParsedEntries([entryToSave]);
    }
};

export {
    parseMBankCSV,
    describeMBankEntry,
    categorizeMBankEntries,
};
