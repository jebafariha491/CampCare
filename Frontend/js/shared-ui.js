/* ---------------- Auth state ---------------- */
let session = { role:"worker", loggedIn:false, worker:null, supervisorAcct:null };
let editingId = null;
let extraChildRows = 0;
let regMode = "new";
let presetGuardianHint = null;

function setLoginRole(role){
  session.role = role;
  document.getElementById('role-worker-btn').classList.toggle('active', role==='worker');
  document.getElementById('role-super-btn').classList.toggle('active', role==='supervisor');
}

function normalizePhone(p){ const digits=(p||'').replace(/[^0-9]/g,''); return digits.slice(-10); }

const EYE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
const EYE_OFF_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.86 21.86 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.86 21.86 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
function togglePasswordVisibility(inputId, btn){
  const input = document.getElementById(inputId);
  if(input.type === 'password'){
    input.type = 'text';
    btn.innerHTML = EYE_OFF_SVG;
    btn.setAttribute('aria-label', 'Hide password');
  } else {
    input.type = 'password';
    btn.innerHTML = EYE_SVG;
    btn.setAttribute('aria-label', 'Show password');
  }
}
