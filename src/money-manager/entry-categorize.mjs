import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import { accounts, categories, operationTypes } from './configuration.mjs';

/**
 * Returns the category choices from the list of categories.
 * @param category - The category from the list of categories
 * @returns {{name: string, value: string}[]}
 */
const parseCategoryToChoices = (category) => {
    if (category.subcategories.length === 0) {
        return [{ name: category.name, value: category.id.toString() }];
    }
    return category.subcategories.map((subcategory) => ({
        name: `${category.name}/${subcategory.name}`,
        value: `${category.id}.${subcategory.id}`,
    }));
};

/**
 * Returns the category name from the list of categories.
 * @param categoryType - The operation type from the list of operation types (Income, Expense, Transfer-Out)
 * @param categoryIdentification - The category identification in form of 'mainCategoryId.subCategoryId'
 * @returns {{mainCategory: string, subCategory: string}|null}
 */
const parseCategoryIdToCategory = (categoryType, categoryIdentification) => {
    if (categoryType.toLowerCase() === 'Transfer-Out'.toLowerCase()) {
        return {
            mainCategory: accounts.find((account) => account === categoryIdentification),
            subCategory: '',
        };
    }
    const categoriesToChoose = categories[categoryType.toLowerCase()];
    const [categoryId, subcategoryId] = categoryIdentification.split('.');
    const mainCategory = categoriesToChoose.find((c) => c.id.toString() === categoryId);
    if (!mainCategory) {
        return null;
    }
    const subCategory = mainCategory.subcategories.find((c) => c.id.toString() === subcategoryId);

    return {
        mainCategory: mainCategory.name,
        subCategory: subCategory ? subCategory.name : '',
    };
};

const parseCategoryIdToCategoryString = (categoryType, categoryIdentification) => {
    if (!categoryIdentification) {
        return '';
    }
    const suggested = parseCategoryIdToCategory(categoryType, categoryIdentification);

    return suggested ? `${suggested.mainCategory}${suggested.subCategory ? '/' + suggested.subCategory : ''}` : null;
};

/**
 * @typedef {Object} Answer
 * @property {string} account - The account name from the list of accounts
 * @property {string} summary - The operation summary
 * @property {string} operationType - The operation type from the list of operation types
 * @property {string} category - The operation category from the list of categories in form of 'mainCategoryId.subCategoryId'
 */

/**
 * Returns the answers from the user about entry.
 * @returns {Promise<Answer>}
 */
const categorizeEntry = (isIncome, suggestedBank, suggestedCategory, suggestedSummary) => {
    inquirer.registerPrompt('search-list', inquirerSearchList);
    return inquirer.prompt([
        {
            type: 'list',
            name: 'account',
            message: 'Wybierz konto:',
            choices: accounts.map((account) => ({
                name: account,
                value: account,
            })),
            default: suggestedBank,
        },
        {
            type: 'input',
            name: 'summary',
            message: 'Opis operacji:',
            default: suggestedSummary,
        },
        {
            type: 'list',
            name: 'operationType',
            message: 'Wybierz typ operacji:',
            choices: operationTypes,
            default: isIncome ? 'Income' : 'Expense',
        },
        {
            type: 'search-list',
            name: 'category',
            message: 'Wybierz typ operacji:',
            when: (answers) => answers.operationType === 'Income',
            choices: categories.income.map((c) => parseCategoryToChoices(c)).flat(),
            default: parseCategoryIdToCategoryString('income', suggestedCategory),
        },
        {
            type: 'search-list',
            name: 'category',
            message: 'Wybierz typ operacji:',
            when: (answers) => answers.operationType === 'Expense',
            choices: categories.expense.map((c) => parseCategoryToChoices(c)).flat(),
            default: parseCategoryIdToCategoryString('expense', suggestedCategory),
        },
        {
            type: 'list',
            name: 'category',
            message: 'Wybierz konto, na które dokonano transfer:',
            when: (answers) => answers.operationType === 'Transfer-Out',
            default: parseCategoryIdToCategoryString('transfer-out', suggestedCategory),
            choices: accounts.map((account) => ({
                name: account,
                value: account,
            })),
        },
    ]);
};

export {
    categorizeEntry,
    parseCategoryIdToCategory,
};

