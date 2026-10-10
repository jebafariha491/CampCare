/* ---------------- Vaccination history ----------------
   Local-only for now: the backend has no "get history" endpoint,
   so this only shows what you've recorded in this browser session. */
function renderHistory(){
  const rows = historyLog.map(h=>`<tr><td>${h.child}</td><td>${h.vaccine}</td><td class="mono">${fmtDateTime(h.date)}</td></tr>`).join('');
  return `
    <div class="topline">
      <div><div class="eyebrow">Activity log</div><h1>Vaccination history</h1><div class="desc">A running log of every dose recorded by you this session.</div></div>
    </div>
    <div class="panel">
      ${rows ? `<table><thead><tr><th>Child</th><th>Vaccine</th><th>Recorded at</th></tr></thead><tbody>${rows}</tbody></table>` : `<div class="empty-state">No vaccinations recorded yet this session. Mark a dose as given from a child's record to see it here.</div>`}
    </div>
  `;
}

