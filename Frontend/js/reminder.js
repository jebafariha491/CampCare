/* ---------------- Telegram reminder trigger ---------------- */
function renderReminder(){
  const mine = camps;
  const options = mine.map(c=>`<option value="${c.id}">${c.location} — ${fmtDate(c.date)}</option>`).join('');
  return `
    <div class="topline">
      <div><div class="eyebrow">Telegram integration</div><h1>Send camp reminder</h1><div class="desc">Select a camp and broadcast a reminder to every registered family in that zone via Telegram.</div></div>
    </div>
    <div class="panel" style="max-width:520px;">
      <label>Select camp</label>
      <select id="r-camp">${options || '<option disabled>No camps scheduled</option>'}</select>
      <button class="btn dark" style="margin-top:20px;" onclick="submitReminder()" ${mine.length===0?'disabled':''}>Send Telegram reminder</button>
    </div>
  `;
}
async function submitReminder(){
  const campId = parseInt(document.getElementById('r-camp').value);
  const c = camps.find(x=>x.id===campId);
  if(!c) return;
  const data = await apiPost("send_reminder.php", { camp_id: campId });
  if(data.status !== "success"){ showToast(data.message || "Couldn't send the reminder."); return; }
  c.notified = true; // backend doesn't persist this flag, so it's tracked locally for this session
  showToast(data.message);
  go('reminder', undefined, true);
}


/* ---------------- SMS reminder trigger ---------------- */

function renderSMSReminder(){
  const mine = camps;
  const options = mine.map(c =>
    `<option value="${c.id}">${c.location} — ${fmtDate(c.date)}</option>`
  ).join('');

  return `
    <div class="topline">
      <div>
        <div class="eyebrow">SMS integration</div>
        <h1>Send SMS reminder</h1>
        <div class="desc">
          Select a camp and send an SMS reminder to every registered family in that zone.
        </div>
      </div>
    </div>

    <div class="panel" style="max-width:520px;">
      <label>Select camp</label>

      <select id="sms-camp">
        ${options || '<option disabled>No camps scheduled</option>'}
      </select>

      <button
        class="btn dark"
        style="margin-top:20px;"
        onclick="submitSMSReminder()"
        ${mine.length===0 ? 'disabled' : ''}
      >
        Send SMS reminder
      </button>
    </div>
  `;
}

async function submitSMSReminder(){
  const campId = parseInt(
    document.getElementById('sms-camp').value
  );

  const c = camps.find(x => x.id === campId);

  if(!c) return;

  const data = await apiPost("send_sms.php", {
    camp_id: campId
  });

  console.log("SMS RESPONSE:", data);

  if(String(data.status).trim().toLowerCase() === "completed"){

    showToast(
      `SMS sent successfully! Sent: ${data.sent_to_twilio}, Failed: ${data.failed}, Skipped: ${data.skipped}`
    );

    go('sms-reminder', undefined, true);

  } else {

    showToast("Couldn't send the SMS reminder.");

  }
}