const KEY = 'finance:data';
const CAP = 1000; // Example cap for spending

// ===== Storage =====
function loadData() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ===== Regex Validators =====
function validateDescription(desc) {
  const re = /^[A-Za-z0-9\s.,'@#&()-]{3,100}$/;
  return re.test(desc.trim());
}

function validateAmount(amount) {
  const re = /^-?\d+(\.\d{1,2})?$/;
  return re.test(amount.toString());
}

function validateCategory(cat) {
  const re = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  return re.test(cat.trim());
}

function validateDate(date) {
  const re = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return re.test(date);
}

// ===== Dashboard =====
function updateDashboard(records) {
  const totalRecords = records.length;
  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0).toFixed(2);

  const categoryCount = {};
  records.forEach(r => {
    categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
  });
  const topCategory = Object.keys(categoryCount).reduce((a,b)=> categoryCount[a]>categoryCount[b]?a:b, "-");

  document.getElementById('totalRecords').textContent = totalRecords;
  document.getElementById('totalAmount').textContent = totalAmount;
  document.getElementById('topCategory').textContent = topCategory;

  const capMessage = document.getElementById('capMessage');
  if(totalAmount > CAP){
    capMessage.textContent = `!!! You exceeded your cap of ${CAP}!`;
    capMessage.setAttribute("role","alert");
  } else {
    capMessage.textContent = `You have ${CAP - totalAmount} remaining`;
    capMessage.setAttribute("role","status");
  }
}

// ===== Render Table =====
function renderTable(records) {
  const table = document.getElementById('recordsTable');
  table.innerHTML = `
    <tr>
      <th>Description</th>
      <th>Amount</th>
      <th>Category</th>
      <th>Date</th>
      <th>Actions</th>
    </tr>
    ${records.map(r => `
      <tr>
        <td>${r.description}</td>
        <td>${r.amount.toFixed(2)}</td>
        <td>${r.category}</td>
        <td>${r.date}</td>
        <td>
          <button data-id="${r.id}" class="deleteBtn">Delete</button>
        </td>
      </tr>`).join('')}
  `;

  // Delete button
  document.querySelectorAll('.deleteBtn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.target.dataset.id;
      const newData = records.filter(r=>r.id!==id);
      saveData(newData);
      renderTable(newData);
      updateDashboard(newData);
    });
  });
}

// ===== Search =====
document.getElementById('search').addEventListener('input', e=>{
  const pattern = e.target.value;
  const data = loadData();
  let re = null;
  try { re = new RegExp(pattern, 'i'); } catch { re = null; }
  const filtered = re ? data.filter(r => re.test(r.description) || re.test(r.category)) : data;
  renderTable(filtered);
});

// ===== Add Record =====
document.getElementById('recordForm').addEventListener('submit', e=>{
  e.preventDefault();
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  // Validate
  if(!validateDescription(description)){ return alert("Invalid description"); }
  if(!validateAmount(amount)){ return alert("Invalid amount"); }
  if(!validateCategory(category)){ return alert("Invalid category"); }
  if(!validateDate(date)){ return alert("Invalid date"); }

  const record = {
    id: 'rec_' + Date.now(),
    description, amount, category, date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const data = loadData();
  data.push(record);
  saveData(data);
  renderTable(data);
  updateDashboard(data);

  e.target.reset();
});

// ===== Import / Export =====
document.getElementById('exportBtn').addEventListener('click', ()=>{
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "finance_export.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importBtn').addEventListener('click', ()=>{
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    try{
      const json = JSON.parse(ev.target.result);
      if(!Array.isArray(json)) throw new Error("Invalid JSON");
      // Optional: validate each record
      const valid = json.every(r => r.description && r.amount && r.category && r.date);
      if(!valid) throw new Error("Some records are invalid");
      const data = loadData().concat(json);
      saveData(data);
      renderTable(data);
      updateDashboard(data);
      alert("Import successful");
    } catch(err){
      alert("Failed to import JSON: "+err.message);
    }
  };
  reader.readAsText(file);
});

// ===== Init =====
const data = loadData();
renderTable(data);
updateDashboard(data);