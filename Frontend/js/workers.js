/* ---------------- Supervisor: multi-worker overview (worker_overview.php) ---------------- */
function renderWorkers(){
  const rows = workersOverview.map(w=>`
    <tr><td><b>${w.name}</b></td><td>${w.zone}</td><td>${w.families_registered}</td><td>${w.children_registered}</td></tr>
  `).join('');
  return `
    <div class="topline">
      <div><div class="eyebrow">Team</div><h1>Multi-worker overview</h1><div class="desc">Registration activity across every health worker.</div></div>
    </div>
    <div class="panel">
      <table><thead><tr><th>Name</th><th>Zone</th><th>Families registered</th><th>Children registered</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
  `;
}

