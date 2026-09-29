/* ---------------- Camp attendance ----------------
   mark_attendance.php only ever sets attended = TRUE (no "unmark"
   endpoint exists), so once checked a row can't be unchecked here. */
function renderAttendance(campId){
  const mine = camps;
  const c = campId ? camps.find(x=>x.id===campId) : mine[0];
  if(!c) return `<div class="topline"><div><h1>Camp attendance</h1></div></div><div class="empty-state">No camps scheduled for your zone yet.</div>`;
  const kidsHere = children;
  const rows = kidsHere.map(k=>{
    const checked = !!c.attendance[k.id];
    return `<div class="attend-row">
      <input type="checkbox" ${checked?'checked disabled':''} onchange="toggleAttendance(${c.id},${k.id})">
      <div class="who">${k.name} <small>${k.guardian}</small></div>
    </div>`;
  }).join('');
  const attendedCount = Object.values(c.attendance).filter(Boolean).length;
  return `
    <div class="topline">
      <div><div class="eyebrow">${c.location}</div><h1>Camp attendance</h1><div class="desc">${fmtDate(c.date)} &middot; mark who showed up.</div></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>Attendance checklist</h3><span class="hint">${attendedCount} / ${kidsHere.length} attended</span></div>
      ${rows || `<div class="empty-state">No registered children in this zone yet.</div>`}
    </div>
  `;
}
async function toggleAttendance(campId, childId){
  const c = camps.find(x=>x.id===campId);
  if(c.attendance[childId]) return; // already marked, and can't be un-marked server-side
  const data = await apiPost("mark_attendance.php", { camp_id: campId, child_id: childId });
  if(data.status === "success") c.attendance[childId] = true;
  else showToast(data.message || "Couldn't mark attendance.");
  go('attendance', campId, true);
}

