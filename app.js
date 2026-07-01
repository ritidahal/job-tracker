let jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
let editId = null;

function save() {
  localStorage.setItem('jobs', JSON.stringify(jobs));
}

function statusClass(s) {
  return 's-' + s.replace(' ', '-');
}

function render() {
  const q = document.getElementById('search').value.toLowerCase();
  const fs = document.getElementById('filterStatus').value;
  const ft = document.getElementById('filterType').value;

  const filtered = jobs.filter(j =>
    (!q || j.company.toLowerCase().includes(q) || j.position.toLowerCase().includes(q)) &&
    (!fs || j.status === fs) &&
    (!ft || j.type === ft)
  );

  const tbody = document.getElementById('tbody');

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty">${jobs.length === 0 ? 'No applications yet. Click "Add job" to get started!' : 'No results match your filters.'}</td></tr>`;
  } else {
    tbody.innerHTML = filtered.map(j => `
      <tr>
        <td title="${j.company}"><strong>${j.company}</strong></td>
        <td title="${j.position}">${j.position}</td>
        <td>${j.date ? formatDate(j.date) : '—'}</td>
        <td><span class="badge ${statusClass(j.status)}">${j.status}</span></td>
        <td>${j.type}</td>
        <td title="${j.location}">${j.location || '—'}</td>
        <td>${j.salary || '—'}</td>
        <td>
          <div class="actions">
            <button class="icon-btn" aria-label="Edit" onclick="openModal(${j.id})">✏️</button>
            <button class="icon-btn" aria-label="Delete" onclick="deleteJob(${j.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderStats();
}

function formatDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m)-1]} ${parseInt(day)}, ${y}`;
}

function renderStats() {
  const counts = { Applied: 0, Screening: 0, Interview: 0, Rejected: 0, 'On Hold': 0 };
  jobs.forEach(j => { if (counts[j.status] !== undefined) counts[j.status]++; });

  document.getElementById('stats').innerHTML = `
    <div class="stat"><div class="stat-label">Total</div><div class="stat-val">${jobs.length}</div></div>
    <div class="stat"><div class="stat-label">Applied</div><div class="stat-val">${counts['Applied']}</div></div>
    <div class="stat"><div class="stat-label">Screening</div><div class="stat-val">${counts['Screening']}</div></div>
    <div class="stat"><div class="stat-label">Interview</div><div class="stat-val">${counts['Interview']}</div></div>
    <div class="stat"><div class="stat-label">Rejected</div><div class="stat-val">${counts['Rejected']}</div></div>
    <div class="stat"><div class="stat-label">On hold</div><div class="stat-val">${counts['On Hold']}</div></div>
  `;
}

function openModal(id) {
  editId = id || null;
  document.getElementById('modalTitle').textContent = id ? 'Edit job' : 'Add job';

  if (id) {
    const j = jobs.find(x => x.id === id);
    document.getElementById('fCompany').value = j.company;
    document.getElementById('fPosition').value = j.position;
    document.getElementById('fDate').value = j.date || '';
    document.getElementById('fStatus').value = j.status;
    document.getElementById('fType').value = j.type;
    document.getElementById('fLocation').value = j.location || '';
    document.getElementById('fSalary').value = j.salary || '';
  } else {
    ['fCompany', 'fPosition', 'fDate', 'fLocation', 'fSalary'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('fStatus').value = 'Applied';
    document.getElementById('fType').value = 'Full Time';
  }

  document.getElementById('modalBg').classList.add('open');
  document.getElementById('fCompany').focus();
}

function closeModal() {
  document.getElementById('modalBg').classList.remove('open');
  editId = null;
}

function saveJob() {
  const company = document.getElementById('fCompany').value.trim();
  const position = document.getElementById('fPosition').value.trim();

  if (!company || !position) {
    alert('Please fill in company name and position.');
    return;
  }

  const data = {
    company,
    position,
    date: document.getElementById('fDate').value,
    status: document.getElementById('fStatus').value,
    type: document.getElementById('fType').value,
    location: document.getElementById('fLocation').value.trim(),
    salary: document.getElementById('fSalary').value.trim(),
  };

  if (editId) {
    const idx = jobs.findIndex(j => j.id === editId);
    jobs[idx] = { ...jobs[idx], ...data };
  } else {
    jobs.push({ id: Date.now(), ...data });
  }

  save();
  closeModal();
  render();
}

function deleteJob(id) {
  if (confirm('Remove this application?')) {
    jobs = jobs.filter(j => j.id !== id);
    save();
    render();
  }
}

document.getElementById('modalBg').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

render();
