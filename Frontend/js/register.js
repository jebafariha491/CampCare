/* ---------------- Register (family + child) ----------------
   register_family_child.php auto-detects an existing family by
   matching (phone + guardian name), so "existing family" mode just
   re-collects those same two fields instead of picking from a list
   (get_children.php doesn't return phone or a family id to select by). */
function renderRegister(){
  extraChildRows = 0;
  return `
    <div class="topline">
      <div>
        <div class="eyebrow">Field visit</div>
        <h1>Register family &amp; child</h1>
        <div class="desc">Add a guardian and one or more children during a home visit. If this guardian + phone number is already on file, the same family record is reused automatically &mdash; nothing gets duplicated.</div>
      </div>
    </div>
    <div class="panel" style="max-width:680px;">
      <label>Guardian's name</label><input type="text" id="f-guardian" placeholder="e.g. Rehana Begum" value="${presetGuardianHint ? presetGuardianHint.guardian : ''}">
      <div class="field-row">
        <div><label>Phone number</label><input type="tel" id="f-phone" placeholder="017XX-XXXXXX"></div>
        <div><label>Area / zone</label><select id="f-area">
          <option ${session.worker.zone==='Char Aicha'?'selected':''}>Char Aicha</option>
          <option ${session.worker.zone==='Boalmari'?'selected':''}>Boalmari</option>
          <option ${session.worker.zone==='Sonargaon'?'selected':''}>Sonargaon</option>
           <option ${session.worker.zone==='Bhanga'?'selected':''}>Bhanga</option>
          <option ${session.worker.zone==='Shantipur'?'selected':''}>Shantipur</option>
          <option ${session.worker.zone==='Saltha'?'selected':''}>Saltha</option>
          <option ${session.worker.zone==='Sandeep'?'selected':''}>Sandeep</option>
        </select></div>
      </div>
      <div id="children-rows">
        <div class="child-row" style="margin-top:18px;padding-top:14px;border-top:1px solid var(--paper-2);">
          <label>Child's name</label>
          <input type="text" class="child-name" placeholder="e.g. Mim Akter">
          <label>Date of birth</label>
          <input type="date" class="child-dob">
        </div>
      </div>
      <button class="btn sm ghost" style="margin-top:14px;" onclick="addChildRow()">+ Add another child</button>
      <div><button class="btn dark" id="register-submit-btn" style="margin-top:20px;" onclick="submitRegister()">Save &amp; generate schedule</button></div>
    </div>
  `;
}
function addChildRow(){
  extraChildRows++;
  const wrap = document.getElementById('children-rows');
  const div = document.createElement('div');
  div.className = 'child-row';
  div.style.marginTop = '14px'; div.style.paddingTop='14px'; div.style.borderTop='1px solid var(--paper-2)';
  div.innerHTML = `<label>Child's name</label><input type="text" class="child-name" placeholder="Child ${extraChildRows+1} name">
                    <label>Date of birth</label><input type="date" class="child-dob">`;
  wrap.appendChild(div);
}
async function submitRegister(){
  const names = [...document.querySelectorAll('.child-name')].map(i=>i.value.trim());
  const dobs = [...document.querySelectorAll('.child-dob')].map(i=>i.value);
  if(!names[0] || !dobs[0]){ showToast("Please fill in at least one child's name and date of birth."); return; }

  const guardian_name = document.getElementById('f-guardian').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const zone = document.getElementById('f-area').value;
  if(!guardian_name || !phone){ showToast("Please enter the guardian's name and phone number."); return; }

  const child_name = [], child_dob = [];
  names.forEach((n,i)=>{ if(n && dobs[i]){ child_name.push(n); child_dob.push(dobs[i]); } });

  const btn = document.getElementById('register-submit-btn');
  if(btn){ btn.disabled = true; btn.textContent = "Saving…"; }
  let data;
  try{
    data = await apiPost("register_family_child.php", {
      guardian_name, phone, zone, worker_id: session.worker.id, child_name, child_dob
    });
  } catch(e){
    if(btn){ btn.disabled = false; btn.textContent = "Save & generate schedule"; }
    showToast("Couldn't reach the server. Check API_BASE at the top of the script.");
    return;
  }
  if(btn){ btn.disabled = false; btn.textContent = "Save & generate schedule"; }

  if(data.status !== "success"){
    showToast(data.message || "Registration failed.");
    return;
  }
  showToast(data.message);
  presetGuardianHint = null;
  await loadWorkerData();
  go('children');
}

