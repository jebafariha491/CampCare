/* ---------------- Router ---------------- */
let navStack = [];
let currentView = null;
let currentParam = undefined;

function go(view, param, _fromBack){
  if(!_fromBack && currentView !== null){
    navStack.push({view: currentView, param: currentParam});
  }
  currentView = view;
  currentParam = param;

  document.querySelectorAll('.side-link').forEach(el=>el.classList.toggle('active', el.dataset.view===view));
  const main = document.getElementById('main-content');
  const views = {
    dashboard: renderDashboard,
    register: renderRegister,
    children: renderChildren,
    'child-detail': renderChildDetail,
    'edit-child': renderEditChild,
    due: renderDue,
    history: renderHistory,
    'camp-schedule': renderCampSchedule,
    camps: renderCamps,
    attendance: renderAttendance,
    reminder: renderReminder,
    'sms-reminder': renderSMSReminder,
    supervisor: renderSupervisor,
    workers: renderWorkers,
    performance: renderPerformance,
    help: renderHelp,
  };
  const backBtn = navStack.length > 0
    ? `<button class="back-btn" onclick="goBack()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg> Back</button>`
    : '';
  if(views[view]) main.innerHTML = backBtn + views[view](param);
  else main.innerHTML = backBtn + render404(view);
  window.scrollTo(0,0);
}
function goBack(){
  if(navStack.length === 0) return;
  const prev = navStack.pop();
  go(prev.view, prev.param, true);
}

