function askLogout(){ document.getElementById('logout-modal').classList.add('show'); }
function closeLogoutModal(){ document.getElementById('logout-modal').classList.remove('show'); }
async function doLogout(){
  closeLogoutModal();
  try{ await apiGet("logout.php"); }catch(e){}
  document.getElementById('app-shell').classList.remove('active');
  document.getElementById('login-screen').style.display = "flex";
  document.getElementById('login-phone').value = "";
  document.getElementById('login-pass').value = "";
  document.getElementById('login-error').style.display = "none";
  navStack = [];
  currentView = null;
  session = { role:"worker", loggedIn:false, worker:null, supervisorAcct:null };
  showLogin();
}
