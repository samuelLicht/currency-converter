// ── API Key ──
const API_KEY = '3bf658367de5182c1400cf5f';

// ── Monedas disponibles ──
const CURRENCIES = [
  { code: 'USD', name: 'Dólar estadounidense' },
  { code: 'EUR', name: 'Euro' },
  { code: 'COP', name: 'Peso colombiano' },
  { code: 'GBP', name: 'Libra esterlina' },
  { code: 'MXN', name: 'Peso mexicano' },
  { code: 'ARS', name: 'Peso argentino' },
  { code: 'BRL', name: 'Real brasileño' },
  { code: 'JPY', name: 'Yen japonés' },
  { code: 'CAD', name: 'Dólar canadiense' },
  { code: 'AUD', name: 'Dólar australiano' },
  { code: 'CHF', name: 'Franco suizo' },
  { code: 'CNY', name: 'Yuan chino' },
  { code: 'INR', name: 'Rupia india' },
  { code: 'KRW', name: 'Won surcoreano' },
  { code: 'PEN', name: 'Sol peruano' },
  { code: 'CLP', name: 'Peso chileno' },
];

// ── Elementos ──
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-btn');
const resultCard = document.getElementById('result-card');
const resultText = document.getElementById('result-text');
const rateText = document.getElementById('rate-text');
const errorMsg = document.getElementById('error-msg');

// ── Llenar selects ──
function populateSelects() {
  CURRENCIES.forEach(currency => {
    const optionFrom = document.createElement('option');
    optionFrom.value = currency.code;
    optionFrom.textContent = `${currency.code} — ${currency.name}`;
    fromSelect.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = currency.code;
    optionTo.textContent = `${currency.code} — ${currency.name}`;
    toSelect.appendChild(optionTo);
  });

  fromSelect.value = 'USD';
  toSelect.value = 'COP';
}

// ── Convertir ──
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    showError();
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.result !== 'success') {
      showError();
      return;
    }

    showResult(data, amount, from, to);

  } catch (error) {
    showError();
  }
}

// ── Mostrar resultado ──
function showResult(data, amount, from, to) {
  errorMsg.classList.add('hidden');
  resultCard.classList.remove('hidden');

  const converted = data.conversion_result.toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const rate = data.conversion_rate.toLocaleString('es-CO', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });

  resultText.textContent = `${amount.toLocaleString()} ${from} = ${converted} ${to}`;
  rateText.textContent = `1 ${from} = ${rate} ${to}`;
}

// ── Mostrar error ──
function showError() {
  resultCard.classList.add('hidden');
  errorMsg.classList.remove('hidden');
}

// ── Intercambiar monedas ──
function swapCurrencies() {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  if (!resultCard.classList.contains('hidden')) {
    convertCurrency();
  }
}

// ── Eventos ──
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

amountInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') convertCurrency();
});

// ── Iniciar ──
populateSelects();