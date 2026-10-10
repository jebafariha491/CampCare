/* ---------------- Supervisor: coverage-gap dashboard (zone-level, from coverage_gap.php) ---------------- */
function renderSupervisor(){
  const zones = [...coverageData];
const zoneSort = window.supervisorZoneSort || 'none';

if(zoneSort === 'high'){
  zones.sort((a,b) =>
    Number(b.average_progress_percent) - Number(a.average_progress_percent)
  );
}

if(zoneSort === 'low'){
  zones.sort((a,b) =>
    Number(a.average_progress_percent) - Number(b.average_progress_percent)
  );
}


  const totalChildren = zones.reduce((s,z)=>s+Number(z.total_children),0);
  const avgCov = zones.length ? Math.round(zones.reduce((s,z)=>s+Number(z.average_progress_percent),0)/zones.length) : 0;
  const lowest = zones.length ? [...zones].sort((a,b)=>a.average_progress_percent-b.average_progress_percent)[0] : null;
  return `
    <div class="topline">
      <div><div class="eyebrow">All zones</div><h1>Coverage-gap dashboard</h1><div class="desc">Vaccination coverage across all zones — spot which ones need more outreach.</div></div>
    </div>
    <div class="stat-row">
      <div class="stat-card"><div class="num">${zones.length}</div><div class="lbl">Zones covered</div></div>
      <div class="stat-card"><div class="num">${totalChildren}</div><div class="lbl">Children registered</div></div>
      <div class="stat-card gold"><div class="num">${avgCov}%</div><div class="lbl">Average coverage</div></div>
      <div class="stat-card warn"><div class="num">${lowest ? lowest.zone : '—'}</div><div class="lbl">Needs attention</div></div>
    </div>
    <div class="panel">
      <div class="panel-head">
  <h3>Coverage gap by zone</h3>

<select id="supervisor-zone-sort" onchange="sortSupervisorZones(this.value)"> 
  <option value="none">Sort by Performance</option> 
  <option value="high">Performance: High → Low</option> 
  <option value="low">Performance: Low → High</option> 
</select>

  <span class="hint">Average progress toward full EPI schedule completion</span>
</div>
      ${zones.length ? zones.map(z=>`
        <div class="coverage-row">
          <div class="area-name">${z.zone}</div>
          <div class="coverage-bar-track"><div class="coverage-bar-fill" style="width:${z.average_progress_percent}%; background:${z.average_progress_percent<70?'var(--brick)':z.average_progress_percent<85?'var(--ochre)':'var(--pine)'}"></div></div>
          <div class="pct">${z.average_progress_percent}%</div>
        </div>`).join('') : `<div class="empty-state">No zones with registered children yet.</div>`}
    </div>
  `;
}

function sortSupervisorZones(value){
  window.supervisorZoneSort = value;
  go('supervisor');
}
