/* ---------------- Camp scheduling ---------------- */
function renderCampSchedule(){
  return `
    <div class="topline">
      <div><div class="eyebrow">${session.worker.zone}</div><h1>Schedule a camp</h1><div class="desc">Plan an outreach vaccination camp for your zone.</div></div>
    </div>
    <div class="panel" style="max-width:520px;">
      <label>Location</label><input type="text" id="c-loc" placeholder="e.g. Union Parishad Ground">
      <label>Date</label><input type="date" id="c-date">
      <button class="btn dark" id="camp-submit-btn" style="margin-top:20px;" onclick="submitCamp()">Add camp</button>
    </div>
  `;
}
async function submitCamp(){
  const loc = document.getElementById('c-loc').value.trim();
  const dateVal = document.getElementById('c-date').value;
  if(!loc || !dateVal){ showToast("Please enter both a location and a date."); return; }
  const btn = document.getElementById('camp-submit-btn');
  if(btn){ btn.disabled = true; btn.textContent = "Saving…"; }
  const data = await apiPost("add_camp.php", {
    zone: session.worker.zone, location: loc, camp_date: dateVal, created_by: session.worker.id
  });
  if(btn){ btn.disabled = false; btn.textContent = "Add camp"; }
  if(data.status !== "success"){ showToast(data.message || "Couldn't schedule the camp."); return; }
  showToast("Camp scheduled successfully.");
  await loadWorkerData();
  go('camps');
}

/* ---------------- Camp list ---------------- */
function renderCamps(){
  const mine = camps;
  const rows = mine.map(c=>`
    <div class="panel" style="margin-bottom:14px;">
      <div class="panel-head"><h3>${c.location}</h3><span class="mono hint">${fmtDate(c.date)}</span></div>
      <div style="font-size:13.5px;color:var(--ink-soft);margin-bottom:14px;">Zone: ${c.area} &middot; ${c.notified? 'Reminder sent to registered families.' : 'Reminder not sent yet.'}</div>
      <div style="display:flex;gap:8px;">
        <button class="btn sm" onclick="go('attendance', ${c.id})">Take attendance</button>
        <button class="btn sm ${c.notified?'':'dark'}" onclick="go('reminder')" ${c.notified?'disabled':''}>${c.notified?'✓ Reminder sent':'Send reminder'}</button>
      </div>
    </div>
  `).join('');
  return `
    <div class="topline">
      <div><div class="eyebrow">${session.worker.zone}</div><h1>Camp list</h1><div class="desc">All scheduled vaccination camps in your zone.</div></div>
      <button class="btn dark" onclick="go('camp-schedule')">+ Schedule camp</button>
    </div>
    ${rows || `<div class="empty-state">No camps scheduled yet for your zone.</div>`}
  `;
}

