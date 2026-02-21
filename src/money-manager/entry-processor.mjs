import chalk from 'chalk';
import { categorizeEntry, parseCategoryIdToCategory } from './entry-categorize.mjs';
import { initData, saveSuggestedData, suggestData } from './suggestor.mjs';
import { saveParsedEntry } from './file-saving.mjs';
import { getEntryOperation } from './entry-operations.mjs';

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
 * @param {ParsedEntry} entry
 */
const describeEntry = (entry) => {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    const truncatedSummary = entry.summary.substring(0, 150);
    const amount = entry.amount > 0 ? chalk.green.bold(`${entry.amount.toFixed(2)}PLN `) : chalk.red.bold(`${entry.amount.toFixed(2)}PLN `);
    console.log(chalk.bold(`Kategoryzowanie wpisu z dnia: ${entry.date}`));
    console.log(amount +
        chalk.blue(`${truncatedSummary}${truncatedSummary.length < entry.summary.length ? '...' : ''}`));
};

/**
 * Describes the entry for list's sake.
 * @param {ParsedEntry} entry
 */
const describeEntryInList = (entry) => {
    const truncatedSummary = entry.summary.substring(0, 150);
    const date = chalk.bold(`${entry.date}`);
    const amount = entry.amount > 0 ? chalk.green.bold(`${entry.amount.toFixed(2)}PLN`) : chalk.red.bold(`${entry.amount.toFixed(2)}PLN`);
    const description = chalk.blue(`${truncatedSummary}${truncatedSummary.length < entry.summary.length ? '...' : ''}`);
    console.log(`${date}\t\t${amount}\t\t${description}`);
};

/**
 * Describes the parsed entry list.
 * @param {ParsedEntry[]} entries
 */
const describeEntryList = (entries) => {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    entries.forEach(describeEntryInList);
};

/**
 * Returns the categorized entry.
 * @param {ParsedEntry} entry - The entry to categorize
 * @param {string} bank - The bank name, one of the banks from the list of banks
 * @param {Object[]} dataToSuggest - The data from the CSV file with all the matches
 * @returns {Promise<MMEntry|null>}
 */
const createMMEntry = async (entry, bank, dataToSuggest) => {
    const suggestedData = suggestData(dataToSuggest, entry.summary, entry.category);
    const suggestedSummary = suggestedData.length > 0 ? suggestedData[0].summary : '';
    const suggestedCategory = suggestedData.length > 0 ? suggestedData[0].category : '';

    const categorizedEntry = await categorizeEntry(entry.amount > 0, bank, suggestedCategory, suggestedSummary);
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
            amount: Math.abs(entry.amount),
            summary,
            account,
            operationType,
            categoryId,
            category,
        };
    }
};

/**
 * Returns the categorized entries.
 * @param {string} bank - The bank name, one of the banks from the list of banks
 * @param {ParsedEntry[]} entries - The entries from the CSV file
 */
const processEntries = async (bank, entries) => {
    describeEntryList(entries.toReversed());
    for (const [index, entry] of entries.entries()) {
        describeEntry(entry);
        const entryOperation = await getEntryOperation();
        if (entryOperation.action === 'skip') {
            console.log(chalk.bold('Pominięto wpis.'));
            continue;
        } else if (entryOperation.action === 'divide') {
            entry.amount /= 2;
            console.log(chalk.bold('Podzielono sumę:'));
            describeEntry(entry);
        } else if (entryOperation.action === 'split') {
            const newEntryAmount = parseFloat(entryOperation.newAmount);
            entry.amount -= newEntryAmount;
            const newEntry = { ...entry, amount: newEntryAmount };
            entries.splice(index + 1, 0, newEntry);
            console.log(chalk.bold('Dodano nowy wpis i zmodyfikowano aktualny:'));
            describeEntry(entry);
        } else if (entryOperation.action === 'edit') {
            entry.amount = parseFloat(entryOperation.editedAmount);
            console.log(chalk.bold('Zmodyfikowano aktualny wpis:'));
            describeEntry(entry);
        }
        const dataToSuggest = initData();
        const entryToSave = await createMMEntry(entry, bank, dataToSuggest);
        if (!entryToSave) {
            continue;
        }
        await saveSuggestedData(entryToSave);
        await saveParsedEntry(entryToSave);
        process.stdout.write('\x1Bc');
        describeEntryList(entries.slice(index + 1).toReversed());
    }
};

export {
    processEntries,
};
