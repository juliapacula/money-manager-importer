import inquirer from 'inquirer';

/**
 * @typedef {Object} OperationAnswer
 * @property {string} action - The action to perform on entry, one of: continue, skip, split
 * @property {string} newAmount - The new amount for the split entry, only when action is split
 */

/**
 * Returns the answers what to do with entry.
 * @returns {Promise<OperationAnswer>}
 */
const getEntryOperation = async () => {
    return await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Co zrobić z wpisem:',
            choices: [
                { name: 'Kontynuuj', value: 'continue' },
                { name: 'Pomiń', value: 'skip' },
                { name: 'Rozdziel', value: 'split' },
            ],
            default: 'continue',
        },
        {
            type: 'input',
            name: 'newAmount',
            message: 'Podaj wartość w [PLN] nowego wpisu (np. 21.15):',
            when: (answers) => answers.action === 'split',
            validate: (value) => {
                return !isNaN(parseFloat(value)) ? true : 'Podaj liczbę oddzieloną kropką.';
            }
        },
    ]);
};

export {
    getEntryOperation,
};

