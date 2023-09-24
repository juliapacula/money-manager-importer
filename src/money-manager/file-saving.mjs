import fs from 'fs';

const COLUMN_SEPARATOR = '\t';
const ROW_SEPARATOR = '\n';

/**
 * Returns the categorized entries.
 * @param {MMEntry} entry - The entry parsed from the CSV file
 * @returns {Promise<void>}
 */
const saveParsedEntry = async (entry) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const outputFilePath = `${process.cwd()}/parsed-files/${currentDate}.tsv`;

    const finalColumns = [
        'Date',
        'Account',
        'Main Cat.',
        'Sub Cat.',
        'Contents',
        'Amount',
        'Inc./Exp.',
        'Details',
    ];

    const csvContent = [];

    if (fs.existsSync(outputFilePath) === false) {
        csvContent.push(`${finalColumns.join(COLUMN_SEPARATOR)}${ROW_SEPARATOR}`);
    }

    const finalEntry = [
        entry.date,
        entry.account,
        entry.category.mainCategory,
        entry.category.subCategory ? entry.category.subCategory : '',
        entry.summary,
        entry.amount.toFixed(2),
        entry.operationType,
        '',
    ];
    csvContent.push(`${finalEntry.join(COLUMN_SEPARATOR)}${ROW_SEPARATOR}`);

    if (fs.existsSync(outputFilePath) === false) {
        fs.writeFileSync(outputFilePath, csvContent.join(''));
        console.log(`✅ Utworzono plik ${outputFilePath}`);
    } else {
        fs.appendFileSync(outputFilePath, csvContent.join(''));
        console.log(`✅ Zapisano w pliku ${outputFilePath}`);
    }
};

export {
    saveParsedEntry,
};
