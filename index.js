// получаем данные с сервера
function getRates() {
    const loadingElement = document.querySelector('.loading');
    loadingElement.classList.remove('hidden');
    fetch(`https://api.ratesapi.io/api/latest?base=${usedCurrency.base}&symbols=${usedCurrency.symbols}`)
        .then(
            (response) => {
                return response.json();
            },
            (error) => {
                alert('произошла ошибка на сервере');
                console.log(error);
                return (error);
            }
        )
        .then(
            (response) => {
                currency = response.rates[usedCurrency.symbols];
                loadingElement.classList.add('hidden');
                showCurrency();
                inputBaseElement.value = (inputSymbolElement.value / currency);
            },
            (error) => {
                alert('произошла ошибка на сервере');
                console.log(error);
                return (error);
            }
        )
}

// показываем курс 
function showCurrency() {
    // курс вводимого
    const showSymbolElement = document.querySelector('#show-symbol');
    showSymbolElement.innerText = `1 ${usedCurrency.symbols} = ${(1 / currency).toFixed(6)} ${usedCurrency.base}`;
    // курс желаемого
    const showBaseElement = document.querySelector('#show-base');
    showBaseElement.innerText = `1 ${usedCurrency.base} = ${currency.toFixed(6)} ${usedCurrency.symbols}`;
}

function verufyInput(input) {
    let newValue = '';
    for (let i = 0; i < input.length; i++) {
        newValue += (input[i] == ',') ?
            '.' : (isNaN(input[i])) ?
                '' :
                input[i];
    }

    if (isNaN(newValue)) {
        return ''
    } else {
        return newValue
    }
}
// класс кнопок выбора валюты
class selectButton {
    constructor(id, type) {
        this.button = document.querySelector(`.select-${type} .btn-select-currency:nth-child(${id})`);
        if (id == 5) {
            this.button.addEventListener('change', (e) => this.handlerSelectButton(e, type));
        } else {
            this.button.addEventListener('click', (e) => this.handlerSelectButton(e, type));
        }
    }
    handlerSelectButton(e, type) {
        const parentElement = this.button.parentElement;
        const allButtons = parentElement.querySelectorAll('.btn-select-currency');
        allButtons.forEach((item) => item.classList.remove('active'));
        this.button.classList.add('active');

        usedCurrency[type] = e.target.value;

        if (usedCurrency.symbols === usedCurrency.base) {
            currency = 1;
            showCurrency();
            inputBaseElement.value = (inputSymbolElement.value / currency);
        } else {
            getRates();
        }
    }
}

// Инициализация проекта
let currency;
let usedCurrency = {
    symbols: 'RUB',
    base: 'USD'
};
const inputSymbolElement = document.querySelector('#inputSymbol');
const inputBaseElement = document.querySelector('#inputBase');
getRates();

// вешаем обработчики события выбора вводимой валюты
const symbolRubButton = new selectButton(1, 'symbols');
const symbolUsdButton = new selectButton(2, 'symbols');
const symbolEurButton = new selectButton(3, 'symbols');
const symbolGbpButton = new selectButton(4, 'symbols');
const symbolOtherButton = new selectButton(5, 'symbols');

// вешаем обработчики события выбора получаемой валюты
const baseRubButton = new selectButton(1, 'base');
const baseUsdButton = new selectButton(2, 'base');
const baseEurButton = new selectButton(3, 'base');
const baseGbpButton = new selectButton(4, 'base');
const baseOtherButton = new selectButton(5, 'base');

// вешаем обработчики нажатия кнопки смены валюты
const changeButton = document.querySelector(`#change-button`);
changeButton.addEventListener('click', () => {
    // меняем местами названия и курс валют
    let buffer = usedCurrency.base;
    usedCurrency.base = usedCurrency.symbols;
    usedCurrency.symbols = buffer;
    currency = 1 / currency;
    // меняем отображение выбранной валюты слева
    const allSelectButtons = document.querySelectorAll('.btn-select-currency');
    allSelectButtons.forEach((item) => item.classList.remove('active'));

    const allSymbolButtons = document.querySelectorAll('.select-symbols .btn-select-currency');
    let flag = 0;
    allSymbolButtons.forEach((item) => {
        if (item.value === usedCurrency.symbols) {
            item.classList.add('active');
            flag = 1;
        }
    });
    // отдельно проверяем последнюю кнопку выбора
    const selectSymbolButton = document.querySelector('.select-symbols .btn-select-currency:last-child');
    if (flag === 0) {
        selectSymbolButton.classList.add('active');
        selectSymbolButton.value = usedCurrency.symbols;
    }

    // меняем отображение выбранной валюты справа
    const allBaseButtons = document.querySelectorAll('.select-base .btn-select-currency');
    flag = 0;
    allBaseButtons.forEach((item) => {
        if (item.value === usedCurrency.base) {
            item.classList.add('active');
            flag = 1;
        }
    });
    // отдельно проверяем последнюю кнопку выбора
    const selectBaseButton = document.querySelector('.select-base .btn-select-currency:last-child');
    if (flag === 0) {
        selectBaseButton.classList.add('active');
        selectBaseButton.value = usedCurrency.base;
    }

    // меняем местами количество денег
    buffer = inputBaseElement.value;
    inputBaseElement.value = inputSymbolElement.value;
    inputSymbolElement.value = buffer;

    showCurrency();
})

// Обработка ввода значения слева
inputSymbolElement.addEventListener('change', () => {
    inputSymbolElement.value = verufyInput(inputSymbolElement.value);
    inputBaseElement.value = (inputSymbolElement.value / currency);
});

// Обработка ввода значения справа
inputBaseElement.addEventListener('change', () => {
    inputBaseElement.value = verufyInput(inputBaseElement.value);
    inputSymbolElement.value = (inputBaseElement.value / currency);
});
