/* ---------------- Child detail / vaccination record update ---------------- */
function renderChildDetail(id){
  const c = children.find(x=>x.id===id);
  if(!c) return render404('child-detail');
  const siblings = childrenOf(c.familyId).filter(x=>x.id!==c.id);
  const items = (c.vaccines||[]).map(v=>{
    let stampHtml;
    if(v.status==='given') stampHtml = `<span class="stamp given">&#10003; given</span>`;
    else if(v.status==='overdue') stampHtml = `<span class="stamp overdue">overdue</span>`;
    else if(v.status==='due_soon') stampHtml = `<span class="stamp soon">due soon</span>`;
    else stampHtml = `<span class="mono" style="font-size:11.5px;color:var(--ink-soft);">not yet due</span>`;
    const action = v.status!=='given' ? `<button class="btn sm" onclick="markGiven(${c.id},'${v.vaccine_name.replace(/'/g,"\\'")}')">Mark given</button>` : '';
    return `<div class="vax-item">
      <div><div class="vname">${v.vaccine_name}</div><div class="vage">Due at ${v.due_week===0?'birth':v.due_week+' weeks'}</div></div>
      <div style="display:flex;align-items:center;gap:10px;">${stampHtml} ${action}</div>
    </div>`;
  }).join('');

  return `
    <div class="topline">
      <div><div class="breadcrumb-note">Vaccination record update</div><h1>${c.name}</h1></div>
      <div style="display:flex;gap:8px;">
        <button class="btn ghost" onclick="go('children')">&larr; Back to list</button>
      </div>
    </div>
    <div class="panel">
      <div class="child-detail-card">
        <div class="info">
          <div><b>Guardian:</b> ${c.guardian}</div>
          <div><b>Area:</b> ${c.area}</div>
          <div><b>Age:</b> ${Math.round(c.age_weeks)} weeks</div>
        </div>
      </div>
      ${siblings.length ? `<div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:16px;">Other children in this family: ${siblings.map(s=>`<a href="#" onclick="event.preventDefault(); go('child-detail', ${s.id})" style="color:var(--pine);text-decoration:underline;">${s.name}</a>`).join(', ')}</div>` : ''}
      <h3 style="font-size:14px;margin-bottom:8px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.05em;">Vaccination schedule</h3>
      ${items}
    </div>
  `;
}
async function markGiven(id, vname){
  const data = await apiPost("add_vaccination.php", {
    child_id: id, vaccine_name: vname, date_given: todayStr()
  });
  if(data.status !== "success"){ showToast(data.message || "Couldn't record that vaccination."); return; }
  const c = children.find(x=>x.id===id);
  if(c) historyLog.unshift({child:c.name, vaccine:vname, date:new Date()});
  showToast(`Recorded: ${vname} marked as given.`);
  await loadWorkerData();
  go('child-detail', id, true);
}

/* Editing guardian/child details isn't wired up: the backend has no
   update_family.php / update_child.php endpoint to call. */
function renderEditChild(id){ return render404('edit-child'); }

