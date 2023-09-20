const operationTypes = ['Income', 'Expense', 'Transfer-Out'];

const categories = {
    income: [
        { id: 1, name: 'Pensja', subcategories: [] },
        { id: 2, name: 'Odsetki', subcategories: [] },
        { id: 3, name: 'Inne', subcategories: [] },
    ],
    expense: [
        {
            id: 1, name: 'Jedzenie', subcategories: [
                { id: 1, name: 'Spożywcze' },
                { id: 2, name: 'Dostawa/bufet' },
                { id: 3, name: 'W restauracji (ze znajomymi)' },
            ],
        },
        {
            id: 2, name: 'Zakupy drogeryjne', subcategories: [
                { id: 1, name: 'Chemia domowa' },
                { id: 1, name: 'Uroda' },
                { id: 1, name: 'Seks' },
            ],
        },
        {
            id: 3, name: 'Rachunki', subcategories: [
                { id: 1, name: 'Prąd' },
                { id: 2, name: 'Miejsce parkingowe' },
                { id: 3, name: 'Czynsz i woda' },
                { id: 4, name: 'Internet' },
                { id: 5, name: 'Telefon' },
                { id: 6, name: 'Podatek' },
                { id: 7, name: 'Kredyt' },
                { id: 8, name: 'Polisa' },
            ],
        },
        {
            id: 4, name: 'Transport', subcategories: [
                { id: 1, name: 'Komunikacja miejska' },
                { id: 2, name: 'Samochód' },
                { id: 3, name: 'Taxi' },
                { id: 4, name: 'Parking' },
                { id: 5, name: 'Pociąg' },
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
                { id: 2, name: 'Muzyka' },
                { id: 3, name: 'Gry planszowe' },
                { id: 4, name: 'Gry komputerowe' },
                { id: 5, name: 'Gadżety' },
                { id: 6, name: 'Kino' },
                { id: 7, name: 'Teatr i kultura' },
                { id: 8, name: 'Koncert' },
                { id: 9, name: 'Atrakcje i obiekty rozrywkowe' },
                { id: 10, name: 'Siłownia' },
            ],
        },
        {
            id: 7, name: 'Zdrowie', subcategories: [
                { id: 1, name: 'Lekarz' },
                { id: 2, name: 'Lekarstwa' },
                { id: 3, name: 'Dieta' },
                { id: 4, name: 'Zabiegi' },
            ],
        },
        {
            id: 8, name: 'Mieszkanie', subcategories: [
                { id: 1, name: 'Wyposażenie/akcesoria' },
                { id: 2, name: 'Elektronika' },
            ],
        },
        { id: 9, name: 'Prezent', subcategories: [] },
        { id: 10, name: 'Subskrypcje', subcategories: [] },
        {
            id: 11, name: 'Podróże', subcategories: [
                { id: 1, name: 'Pamiątki' },
                { id: 2, name: 'Prezenty' },
                { id: 3, name: 'Jedzenie' },
                { id: 4, name: 'Komunikacja' },
                { id: 5, name: 'Hotel' },
                { id: 6, name: 'Atrakcje' },
                { id: 7, name: 'Wyposażenie' },
                { id: 8, name: 'Inne' },
            ],
        },
    ],
};

const accounts = ['mBank', 'Revolut', 'Gotówka', 'jakdojadę', 'Starbucks', 'skycash'];

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
