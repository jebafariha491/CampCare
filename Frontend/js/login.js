async function doLogin(){
  const phone = document.getElementById('login-phone').value.trim();
  const pass = document.getElementById('login-pass').value;
  const errBox = document.getElementById('login-error');
  const btn = document.getElementById('login-submit-btn');
  if(btn){ btn.disabled = true; btn.textContent = "Logging in…"; }

  let data;
  try{
    data = await apiPost("login.php", { phone, password: pass });
  } catch(e){
    if(btn){ btn.disabled = false; btn.textContent = "Log in"; }
    errBox.textContent = "Couldn't reach the server. Check API_BASE at the top of the script and that the backend is running.";
    errBox.style.display = "block";
    return;
  }
  if(btn){ btn.disabled = false; btn.textContent = "Log in"; }

  if(data.status !== "success"){
    errBox.textContent = data.message || "Login failed.";
    errBox.style.display = "block";
    return;
  }
  if(data.user.role !== session.role){
    errBox.textContent = `This account is registered as a ${data.user.role}. Switch the role toggle above and try again.`;
    errBox.style.display = "block";
    return;
  }

  errBox.style.display = "none";
  navStack = [];
  currentView = null;
  session.loggedIn = true;

  document.getElementById('login-screen').style.display = "none";
  document.getElementById('app-shell').classList.add('active');
  document.getElementById('nav-worker').style.display = session.role==='worker' ? 'block':'none';
  document.getElementById('nav-super').style.display = session.role==='supervisor' ? 'block':'none';

  if(session.role==='worker'){
    session.worker = data.user; // {id, name, role, zone}
    document.getElementById('chip-name').textContent = session.worker.name;
    document.getElementById('chip-zone').textContent = "Zone: " + session.worker.zone;
    document.getElementById('avatar-letter').textContent = session.worker.name[0];
    await loadWorkerData();
    go('dashboard');
  } else {
    session.supervisorAcct = data.user;
    document.getElementById('chip-name').textContent = session.supervisorAcct.name;
    document.getElementById('chip-zone').textContent = "NGO Supervisor";
    document.getElementById('avatar-letter').textContent = session.supervisorAcct.name[0];
    await loadSupervisorData();
    go('supervisor');
  }
}

async function loadWorkerData(){
  const zone = session.worker.zone;
  const [dueRes, campsRes] = await Promise.all([
    apiGet("due_list.php", { zone }),
    apiGet("get_camps.php", { zone }),
  ]);

  children = (dueRes.children || []).map(c=>({
    id: c.child_id,
    name: c.child_name,
    guardian: c.guardian_name,
    area: zone,
    age_weeks: c.age_weeks,
    vaccines: c.vaccines,
    familyId: null,
  }));
  rebuildFamiliesFromChildren();

  const keepNotified = new Set(camps.filter(c=>c.notified).map(c=>c.id));
  camps = (campsRes.camps || []).map(c=>({
    id: c.id,
    area: c.zone,
    date: new Date(c.camp_date),
    location: c.location,
    notified: keepNotified.has(c.id), // backend doesn't persist this — kept in-memory for this session
    attendance: {},
  }));
}

async function loadSupervisorData(){
  const [cov, wo, perf] = await Promise.all([
    apiGet("coverage_gap.php"),
    apiGet("worker_overview.php"),
    apiGet("performance_report.php"),
  ]);
  coverageData = cov.coverage || [];
  workersOverview = wo.workers || [];
  performanceData = perf.performance || [];
}

