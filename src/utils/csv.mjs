const parseCsvRow = (row, separator = ',') => {
    const columns = [];
    let currentValue = '';

    for (let i = 0; i < row.length; i++) {
        const currentChar = row[i];
        if (currentChar === separator || i === row.length - 1) {
            columns.push(currentValue.trim().replaceAll('"', '').replaceAll(/\s\s+/g, ' '));
            currentValue = '';
        } else if (currentChar === '"') {
            i++;
            while (row[i] !== '"') {
                currentValue += row[i];
                i++;
                if (i === row.length - 1) {
                    columns.push(currentValue.trim().replaceAll('"', '').replaceAll(/\s\s+/g, ' '));
                    currentValue = '';
                }
            }
        } else {
            currentValue += currentChar;
        }
    }

    return columns;
};

export {
    parseCsvRow,
};
