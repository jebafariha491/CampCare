/* ---------------- Due/overdue list (color-coded, all children) ---------------- */
function renderDue(){
  const rows = children.map(c=>{
    const od = overdueCount(c), sn = soonCount(c);
    let status = 'On track', cls='given';
    if(od>0){status=`${od} overdue`; cls='overdue';}
    else if(sn>0){status=`${sn} due soon`; cls='soon';}
    return `<tr class="clickable" onclick="go('child-detail', ${c.id})">
      <td><b>${c.name}</b></td><td>${c.guardian}</td>
      <td><span class="stamp ${cls}">${status}</span></td>
    </tr>`;
  }).join('');
  return `
    <div class="topline">
      <div><div class="eyebrow">${session.worker.zone}</div><h1>Due / overdue list</h1><div class="desc">Color-coded status for every child in your zone &mdash; green is on track, gold is due soon, red is overdue.</div></div>
    </div>
    <div class="panel">
      <table><thead><tr><th>Child</th><th>Guardian</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
  `;
}

