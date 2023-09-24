import fs from 'fs';

/**
 * Returns the categorized entries.
 * @param {MMEntry[]} entries - The entries parsed from the CSV file
 * @returns {Promise<void>}
 */
const saveCategorizedEntries = async (entries) => {
    const outputFile = `${process.cwd()}/parsed-files/matches.csv`;
    const content = [];

    if (fs.existsSync(outputFile) === false) {
        content.push('Oryginalny opis,Oryginalna kategoria,Nadany opis,Nadana kategoria\n');
    }
    content.push(entries.map((entry) => `${entry.originalSummary},${entry.originalCategory},${entry.summary},${entry.categoryId}\n`));

    const stream = fs.createWriteStream(outputFile, { flags: 'a' });
    stream.write(content.join(''));
    console.log(`✅ Przypisane kategorie zapisano w pliku ${outputFile}.`);
    stream.close();
};

/**
 * Returns the categorized entries.
 * @param {MMEntry[]} entries - The entries parsed from the CSV file
 * @returns {Promise<void>}
 */
const saveParsedEntries = async (entries) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const outputFile = `${process.cwd()}/parsed-files/${currentDate}.tsv`;

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

    if (fs.existsSync(outputFile) === false) {
        csvContent.push(`${finalColumns.join('\t')}\n`);
    }

    entries.forEach((entry) => {
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

        csvContent.push(`${finalEntry.join('\t')}\n`);
    });
    if (fs.existsSync(outputFile) === false) {
        fs.writeFileSync(outputFile, csvContent.join(''));
        console.log(`✅ Utworzono plik ${outputFile}`);
    } else {
        fs.appendFileSync(outputFile, csvContent.join(''));
        console.log(`✅ Zapisano w pliku ${outputFile}`);
    }
};

export {
    saveParsedEntries,
    saveCategorizedEntries,
};
