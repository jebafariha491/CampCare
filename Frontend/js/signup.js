/* ---------------- Sign up ---------------- */
let signupRole = "worker";
function showSignup(){
  document.getElementById('login-panel').style.display = "none";
  document.getElementById('signup-panel').style.display = "block";
  document.getElementById('signup-error').style.display = "none";
}
function showLogin(){
  document.getElementById('signup-panel').style.display = "none";
  document.getElementById('login-panel').style.display = "block";
  document.getElementById('login-error').style.display = "none";
}
function setSignupRole(role){
  signupRole = role;
  document.getElementById('signup-role-worker-btn').classList.toggle('active', role==='worker');
  document.getElementById('signup-role-super-btn').classList.toggle('active', role==='supervisor');
  document.getElementById('signup-zone-field').style.display = role==='worker' ? 'block' : 'none';
}
async function submitSignup(){
  const name = document.getElementById('signup-name').value.trim();
  const phoneRaw = document.getElementById('signup-phone').value.trim();
  const phone = normalizePhone(phoneRaw);
  const zone = signupRole==='worker' ? document.getElementById('signup-zone').value : '';
  const pass = document.getElementById('signup-pass').value;
  const pass2 = document.getElementById('signup-pass2').value;
  const errBox = document.getElementById('signup-error');

  if(!name || !phoneRaw || !pass){
    errBox.textContent = "Please fill in your name, phone number, and password.";
    errBox.style.display = "block"; return;
  }
  if(phone.length < 6){
    errBox.textContent = "Please enter a valid phone number.";
    errBox.style.display = "block"; return;
  }
  if(pass !== pass2){
    errBox.textContent = "Passwords don't match.";
    errBox.style.display = "block"; return;
  }
  errBox.style.display = "none";

  let data;
  try{
    data = await apiPost("register_user.php", { name, phone: phoneRaw, password: pass, role: signupRole, zone });
  } catch(e){
    errBox.textContent = "Couldn't reach the server. Check API_BASE at the top of the script.";
    errBox.style.display = "block";
    return;
  }
  if(data.status !== "success"){
    errBox.textContent = data.message || "Sign up failed.";
    errBox.style.display = "block";
    return;
  }

  showLogin();
  setLoginRole(signupRole);
  document.getElementById('login-phone').value = phoneRaw;
  document.getElementById('login-pass').value = pass;
  showToast(`Account created for ${name} — you can log in now.`);
}
