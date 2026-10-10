const vaccineSchedule = [
  {name:"BCG", ageWeeks:0},
  {name:"OPV-0", ageWeeks:0},
  {name:"Penta-1 / PCV-1 / OPV-1", ageWeeks:6},
  {name:"Penta-2 / PCV-2 / OPV-2", ageWeeks:10},
  {name:"Penta-3 / PCV-3 / OPV-3 / IPV", ageWeeks:14},
  {name:"MR-1 (Measles-Rubella)", ageWeeks:39},
  {name:"MR-2", ageWeeks:65}
];

function fmtDate(d){ return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
function fmtDateTime(d){ return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}) + ", " + d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }
function todayStr(){ return new Date().toISOString().slice(0,10); }

/* ---------------- Live data (populated from the backend after login) ---------------- */
let families = [];      // pseudo-families grouped from due_list.php by guardian name (see loadWorkerData)
let children = [];      // { id, familyId, name, guardian, area, age_weeks, vaccines:[{vaccine_name,due_week,status}] }
let camps = [];         // { id, area, date, location, notified }  (notified is local-only — backend doesn't persist it)
let workersOverview = [];   // from worker_overview.php
let performanceData = [];   // from performance_report.php
let coverageData = [];      // from coverage_gap.php
let historyLog = [];    // local-only running log — backend has no "get history" endpoint

function familyOf(child){ return families.find(fam=>fam.id===child.familyId) || {guardian:child.guardian, phone:"—", area:child.area}; }
function childrenOf(familyId){ return children.filter(c=>c.familyId===familyId); }

/* A child's vaccine status now comes straight from due_list.php (server-computed) */
function overdueCount(c){ return (c.vaccines||[]).filter(v=>v.status==="overdue").length; }
function soonCount(c){ return (c.vaccines||[]).filter(v=>v.status==="due_soon").length; }

/* Build the pseudo-family list the family/child list page groups by.
   NOTE: get_children.php / due_list.php don't return family_id or phone,
   so families here are grouped by (guardian_name + zone) text match —
   good enough for display, but not a true foreign-key relationship. */
function rebuildFamiliesFromChildren(){
  const map = new Map();
  children.forEach(c=>{
    const key = c.guardian + "|" + c.area;
    if(!map.has(key)) map.set(key, {id: map.size+1, guardian:c.guardian, phone:"—", area:c.area});
    c.familyId = map.get(key).id;
  });
  families = [...map.values()];
}

