/* ---------------- Family/Child list (grouped by guardian, search/filter) ---------------- */
function goAddChildToFamily(familyId){
  const fam = families.find(f=>f.id===familyId);
  presetGuardianHint = fam ? {guardian: fam.guardian} : null;
  go('register');
}
function childrenResultsHTML(filterText, filterArea, sortOrder){
  filterText = (filterText||'').toLowerCase();
  filterArea = filterArea || 'all';
  sortOrder = sortOrder || 'none';

  let fams = families;

  if(filterArea!=='all')
    fams = fams.filter(f=>f.area===filterArea);

  if(filterText)
    fams = fams.filter(fam=>{
      const kids = childrenOf(fam.id);
      return fam.guardian.toLowerCase().includes(filterText) ||
             kids.some(k=>k.name.toLowerCase().includes(filterText));
    });

  // Sort families/children by child age
if(sortOrder !== 'none'){
  fams = [...fams].sort((a,b)=>{
    const ageA = childrenOf(a.id)[0]?.age_weeks || 0;
    const ageB = childrenOf(b.id)[0]?.age_weeks || 0;

    return sortOrder === 'asc'
      ? ageA - ageB
      : ageB - ageA;
  });
}

  if(fams.length===0)
    return `<div class="empty-state">No matching families found.</div>`;

  return fams.map(fam=>{
    let kids = childrenOf(fam.id);

  // Sort children inside each family by age
if(sortOrder !== 'none'){
  kids = [...kids].sort((a,b)=>{
    return sortOrder === 'asc'
      ? a.age_weeks - b.age_weeks
      : b.age_weeks - a.age_weeks;
  });
}


    const kidRows = kids.map(k=>{
      const od = overdueCount(k), sn = soonCount(k);
      let cls='given', label='up to date';

      if(od>0){
        cls='overdue';
        label=`${od} overdue`;
      }
      else if(sn>0){
        cls='soon';
        label=`${sn} due soon`;
      }

      return `<div class="family-child-row" onclick="go('child-detail', ${k.id})">
        <div>
          <b>${k.name}</b>
          <span style="color:var(--ink-soft);font-size:12px;">
            &middot; ${Math.round(k.age_weeks)} wks
          </span>
        </div>

        <div style="display:flex;align-items:center;gap:8px;">
          <span class="stamp ${cls}">${label}</span>
        </div>
      </div>`;
    }).join('');

    return `<div class="family-card">
      <div class="family-card-head">
        <div>
          <b>${fam.guardian}</b>
          <div style="font-size:12px;color:var(--ink-soft);margin-top:2px;">
            ${fam.area} &middot; ${kids.length} ${kids.length===1?'child':'children'} on file
          </div>
        </div>

        <button class="btn sm" onclick="goAddChildToFamily(${fam.id})">
          + Add child
        </button>
      </div>

      ${kidRows ||
        `<div class="empty-state" style="padding:10px 0;">
          No children yet under this family.
        </div>`
      }
    </div>`;
  }).join('');
}
function renderChildren(){
  return `
    <div class="topline">
      <div><div class="eyebrow">${session.worker.zone}</div><h1>Family / child list</h1><div class="desc">Grouped by guardian name &mdash; every child under them listed below.</div></div>
      <button class="btn dark" onclick="go('register')">+ Register family &amp; child</button>
    </div>
    <div class="panel">
      <div class="search-bar">
    <input
        type="search"
        id="search-input"
        placeholder="Search by child or guardian..."
        oninput="liveFilterChildren()"
    >

<select id="child-sort" onchange="liveFilterChildren()">
    <option value="none">Sort children</option>
    <option value="asc">Age: Young → Old</option>
    <option value="desc">Age: Old → Young</option>
</select>

    <select id="area-filter" onchange="liveFilterChildren()">
        <option value="all">All areas</option>
        <option>Char Aicha</option>
        <option>Boalmari</option>
        <option>Sonargaon</option>
        <option>Bhanga</option>
        <option>Shantipur</option>
        <option>Saltha</option>
        <option>Sandeep</option>
    </select>
</div>
      </div>
      <div id="children-results">${childrenResultsHTML('', 'all')}</div>
    </div>
  `;
}
function liveFilterChildren(){
  const text = document.getElementById('search-input').value;
  const area = document.getElementById('area-filter').value;
  const sort = document.getElementById('child-sort').value;

  document.getElementById('children-results').innerHTML =
    childrenResultsHTML(text, area, sort);
}

