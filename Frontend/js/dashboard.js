/* ---------------- Dashboard ---------------- */
function renderDashboard(){
  const mine = children;
  const overdue = mine.reduce((s,c)=>s+overdueCount(c),0);
  const soon = mine.reduce((s,c)=>s+soonCount(c),0);
  const nextCamp = [...camps].sort((a,b)=>a.date-b.date)[0];
  return `
    <div class="topline">
      <div>
        <div class="eyebrow">Assigned area &middot; ${session.worker.zone}</div>
        <h1>Good morning, ${session.worker.name.split(' ')[0]}</h1>
        <div class="desc">Here's what your zone needs today &mdash; registrations, due vaccines, and the next camp.</div>
      </div>
      <button class="btn dark" onclick="go('register')">+ Register family &amp; child</button>
    </div>
    <div class="stat-row">
      <div class="stat-card"><div class="num">${mine.length}</div><div class="lbl">Children registered</div></div>
      <div class="stat-card warn"><div class="num">${overdue}</div><div class="lbl">Overdue vaccines</div></div>
      <div class="stat-card gold"><div class="num">${soon}</div><div class="lbl">Due this week</div></div>
      <div class="stat-card"><div class="num">${nextCamp? fmtDate(nextCamp.date).split(' ').slice(0,2).join(' ') : '—'}</div><div class="lbl">Next camp</div></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><h3>Due or overdue this week</h3><span class="hint">Tap a child to update their record</span></div>
        ${renderDueTable(mine)}
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Next camp</h3></div>
        ${nextCamp ? `
          <div style="font-size:13.5px;line-height:1.8;">
            <div><b>${nextCamp.location}</b></div>
            <div class="mono" style="color:var(--ink-soft);font-size:12.5px;">${fmtDate(nextCamp.date)}</div>
          </div>
          <button class="btn dark sm" style="margin-top:14px;" onclick="go('reminder')">Go to reminder page</button>
        ` : `<div class="empty-state">No camp scheduled for your zone yet.</div>`}
      </div>
    </div>
  `;
}
function renderDueTable(list){
  const rows = list.map(c=>{
    const od = overdueCount(c), sn = soonCount(c);
    if(od===0 && sn===0) return null;
    const badge = od>0 ? `<span class="stamp overdue">${od} overdue</span>` : `<span class="stamp soon">${sn} due soon</span>`;
    return `<tr class="clickable" onclick="go('child-detail', ${c.id})">
      <td><b>${c.name}</b><br><span style="color:var(--ink-soft);font-size:12px;">${c.guardian}</span></td>
      <td>${c.area}</td><td>${badge}</td>
    </tr>`;
  }).filter(Boolean);
  if(rows.length===0) return `<div class="empty-state">Nothing overdue &mdash; the zone is on track this week.</div>`;
  return `<table><thead><tr><th>Child</th><th>Area</th><th>Status</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

