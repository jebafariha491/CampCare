/* ---------------- Supervisor: performance report (performance_report.php) ---------------- */
function renderPerformance(){
  const cards = performanceData.map(w=>`
    <div class="panel">
      <div class="panel-head"><h3>${w.name}</h3><span class="hint">${w.zone}</span></div>
      <div class="stat-row" style="margin-bottom:0;">
        <div class="stat-card"><div class="num">${w.families_registered}</div><div class="lbl">Families registered</div></div>
        <div class="stat-card"><div class="num">${w.children_registered}</div><div class="lbl">Children registered</div></div>
        <div class="stat-card"><div class="num">${w.vaccinations_given}</div><div class="lbl">Doses administered</div></div>
        <div class="stat-card"><div class="num">${w.camps_organized}</div><div class="lbl">Camps run</div></div>
      </div>
    </div>
  `).join('');
  return `
    <div class="topline">
      <div><div class="eyebrow">Per-worker detail</div><h1>Performance report</h1><div class="desc">A closer look at each health worker's field activity.</div></div>
    </div>
    ${cards || `<div class="empty-state">No worker activity yet.</div>`}
  `;
}

/* ---------------- 404 ---------------- */
