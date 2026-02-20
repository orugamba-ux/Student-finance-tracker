const KEY = "finance:data";
let records = loadData();
let sortDirection = 1;
let spendingCap = 500;

function loadData() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function validateInputs(record) {
  const descriptionRegex = /^\S(?:.*\S)?$/;
  const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

  if (!descriptionRegex.test(record.description)) return false;
  if (!amountRegex.test(record.amount.toString())) return false;
  if (!dateRegex.test(record.date)) return false;
  if (!categoryRegex.test(record.category)) return false;

  return true;
}

function renderTable(data = records) {
  const tbody = document.querySelector("#recordsTable tbody");
  tbody.innerHTML = "";

  data.forEach(r => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${highlight(r.description)}</td>
      <td>${r.amount.toFixed(2)}</td>
      <td>${highlight(r.category)}</td>
      <td>${r.date}</td>
      <td><button onclick="deleteRecord('${r.id}')">X</button></td>
    `;

    tbody.appendChild(row);
  });

  updateStats();
}

function highlight(text) {
  const pattern = document.getElementById("searchInput").value;
  if (!pattern) return text;

  try {
    const regex = new RegExp(pattern, "gi");
    return text.replace(regex, m => `<mark>${m}</mark>`);
  } catch {
    return text;
  }
}

function updateStats() {
  const total = records.length;
  const sum = records.reduce((acc, r) => acc + r.amount, 0);

  document.getElementById("stats").innerHTML = `
    <p>Total Transactions: ${total}</p>
    <p>Total Spending: $${sum.toFixed(2)}</p>
  `;

  const capStatus = document.getElementById("capStatus");
  if (sum > spendingCap) {
    capStatus.setAttribute("aria-live", "assertive");
    capStatus.textContent = "⚠ Spending cap exceeded!";
  } else {
    capStatus.setAttribute("aria-live", "polite");
    capStatus.textContent = "Within budget.";
  }
}

function deleteRecord(id) {
  records = records.filter(r => r.id !== id);
  saveData(records);
  renderTable();
}

document.getElementById("recordForm").addEventListener("submit", e => {
  e.preventDefault();

  const record = {
    id: "rec_" + Date.now(),
    description: document.getElementById("description").value.trim(),
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value.trim(),
    date: document.getElementById("date").value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!validateInputs(record)) {
    alert("Invalid input format.");
    return;
  }

  records.push(record);
  saveData(records);
  renderTable();
  e.target.reset();
});

document.getElementById("searchInput").addEventListener("input", () => {
  renderTable(records);
});

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const field = th.dataset.sort;

    records.sort((a, b) => {
      if (a[field] > b[field]) return 1 * sortDirection;
      if (a[field] < b[field]) return -1 * sortDirection;
      return 0;
    });

    sortDirection *= -1;
    renderTable();
  });
});

renderTable();