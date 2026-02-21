const operationTypes = ['Income', 'Expense', 'Transfer-Out'];

const categories = {
    income: [
        { id: 1, name: 'Pensja', subcategories: [] },
        { id: 2, name: 'Odsetki', subcategories: [] },
        { id: 3, name: 'Inne', subcategories: [] },
        { id: 4, name: 'Najem', subcategories: [] },
    ],
    expense: [
        {
            id: 1, name: 'Jedzenie', subcategories: [
                { id: 1, name: 'Spożywcze' },
                { id: 2, name: 'Dostawa' },
                { id: 3, name: 'Restauracje (wspólnie)' },
                { id: 4, name: 'Restauracje (ze znajomymi)' },
            ],
        },
        {
            id: 2, name: 'Zakupy drogeryjne', subcategories: [
                { id: 1, name: 'Chemia domowa' },
                { id: 2, name: 'Kosmetyki' },
                { id: 3, name: 'Inne' },
            ],
        },
        {
            id: 3, name: 'Rachunki', subcategories: [
                { id: 1, name: 'Prąd' },
                { id: 2, name: 'Czynsz i woda' },
                { id: 3, name: 'Internet' },
                { id: 4, name: 'Telefon' },
                { id: 5, name: 'Inne' },
                { id: 6, name: 'Kredyt' },
            ],
        },
        {
            id: 4, name: 'Transport', subcategories: [
                { id: 1, name: 'Komunikacja miejska' },
                { id: 2, name: 'Samochód' },
                { id: 3, name: 'Taxi' },
                { id: 4, name: 'Parking' },
                { id: 4, name: 'Wspólny transport' },
            ],
        },
        {
            id: 5, name: 'Wygląd', subcategories: [
                { id: 1, name: 'Ubrania' },
                { id: 2, name: 'Makijaż' },
                { id: 3, name: 'Buty' },
                { id: 4, name: 'Perfumy' },
            ],
        },
        {
            id: 6, name: 'Rozrywka', subcategories: [
                { id: 1, name: 'Książki' },
                { id: 2, name: 'Wspólne' },
                { id: 3, name: 'Digimony' },
                { id: 4, name: 'Gry planszowe' },
                { id: 5, name: 'Gry komputerowe' },
                { id: 6, name: 'Gadżety' },
                { id: 7, name: 'Koncert' },
                { id: 8, name: 'Inne' },
            ],
        },
        {
            id: 7, name: 'Zdrowie', subcategories: [
                { id: 1, name: 'Lekarz' },
                { id: 2, name: 'Lekarstwa' },
                { id: 3, name: 'Inne' },
                { id: 4, name: 'Siłownia' },
            ],
        },
        {
            id: 8, name: 'Mieszkanie', subcategories: [
                { id: 1, name: 'Wyposażenie/akcesoria' },
                { id: 2, name: 'Elektronika' },
                { id: 3, name: 'Meble' },
                { id: 4, name: 'Kupno' },
            ],
        },
        { id: 9, name: 'Prezent', subcategories: [] },
        { id: 10, name: 'Subskrypcje', subcategories: [] },
        { id: 11, name: 'Za pieska', subcategories: [] },
        {
            id: 12, name: 'Leszczynowa', subcategories: [
                { id: 1, name: 'Rachunki' },
                { id: 2, name: 'Podatek' },
            ],
        },
        {
            id: 13, name: 'Podróże', subcategories: [
                { id: 1, name: 'Pamiątki' },
                { id: 2, name: 'Prezenty' },
                { id: 3, name: 'Jedzenie' },
                { id: 4, name: 'Komunikacja' },
                { id: 5, name: 'Hotel' },
                { id: 6, name: 'Atrakcje' },
                { id: 7, name: 'Inne' },
            ],
        },
    ],
};

const accounts = ['mBank', 'BNP', 'Revolut', 'Pluxee', 'Gotówka', 'jakdojadę', 'skycash'];

const incomeColumns = [
    '#Data operacji',
    '#Opis operacji',
    '#Rachunek',
    '#Kategoria',
    '#Kwota',
];

const outputColumns = [
    'Date',
    'Account',
    'Main Cat.',
    'Sub Cat.',
    'Contents',
    'Amount',
    'Inc./Exp.',
    'Details',
];

export {
    operationTypes,
    categories,
    accounts,
    incomeColumns,
    outputColumns,
};
