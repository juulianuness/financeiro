const categories = JSON.parse(localStorage.getItem('categories')) || [
  { name: 'Aluguel' },
  { name: 'Luz' },
  { name: 'Água' },
  { name: 'Internet' }
];

const expenses = JSON.parse(localStorage.getItem('expenses')) || {};

const monthSelect = document.getElementById('monthSelect');
const grid = document.getElementById('expensesGrid');

const totalExpensesEl = document.getElementById('totalExpenses');
const totalPaidEl = document.getElementById('totalPaid');
const totalPendingEl = document.getElementById('totalPending');

/* Meses */
const months = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

months.forEach((m, i) => {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = m;
  monthSelect.appendChild(opt);
});

monthSelect.value = new Date().getMonth();

function save() {
  localStorage.setItem('categories', JSON.stringify(categories));
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getMonth() {
  return monthSelect.value;
}

function updateSummary() {
  const data = expenses[getMonth()] || {};
  let total = 0, paid = 0, pending = 0;

  categories.forEach(c => {
    const item = data[c.name];
    if (item) {
      total += item.value;
      item.paid ? paid += item.value : pending += item.value;
    }
  });

  totalExpensesEl.textContent = currency(total);
  totalPaidEl.textContent = currency(paid);
  totalPendingEl.textContent = currency(pending);
}

function render() {
  grid.innerHTML = '';
  expenses[getMonth()] ||= {};

  categories.forEach(c => {
    const item = expenses[getMonth()][c.name] || { value: 0, paid: false };

    const card = document.createElement('div');
    card.className = 'expense-card';

    card.innerHTML = `
      <strong>${c.name}</strong>
      <input type="number" value="${item.value || ''}"
        onchange="updateValue('${c.name}', this.value)">
      <button onclick="togglePaid('${c.name}')">
        ${item.paid ? 'Pago' : 'Pagar'}
      </button>
      <button class="clear-btn" onclick="clearValue('${c.name}')">
        Limpar
      </button>
    `;

    grid.appendChild(card);
  });

  updateSummary();
}

function updateValue(cat, value) {
  expenses[getMonth()][cat] = expenses[getMonth()][cat] || { paid: false };
  expenses[getMonth()][cat].value = Number(value);
  save();
  updateSummary();
}

function togglePaid(cat) {
  expenses[getMonth()][cat].paid = !expenses[getMonth()][cat].paid;
  save();
  render();
}

function clearValue(cat) {
  expenses[getMonth()][cat].value = 0;
  expenses[getMonth()][cat].paid = false;
  save();
  render();
}

document.getElementById('addCategoryBtn').onclick = () => {
  const input = document.getElementById('newCategoryName');
  if (!input.value.trim()) return;

  categories.push({ name: input.value });
  input.value = '';
  save();
  render();
};

monthSelect.onchange = render;

render();
