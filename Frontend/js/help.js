/* ---------------- Help / How to use ---------------- */
function helpCard(num, title, shotLabel, shotFile, description, steps){
  const stepsHtml = steps.map((s,i)=>`<li><span class="step-dot">${i+1}</span><span>${s}</span></li>`).join('');
  return `
    <div class="panel help-card">
      <div class="help-card-head">
        <div class="help-card-num">${num}</div>
        <h3 style="font-size:16px;">${title}</h3>
      </div>
      <div class="help-shot">
        <span class="ic">&#128247;</span>
        <div class="cap">Screenshot: ${shotLabel}</div>
        <div class="path mono">Frontend/images/help/${shotFile}</div>
      </div>
      <p style="font-size:13.5px;color:var(--ink-soft);margin:0 0 12px;">${description}</p>
      <ul class="help-steps">${stepsHtml}</ul>
    </div>
  `;
}
function renderHelp(){
  return `
    <div class="topline">
      <div><div class="eyebrow">Support</div><h1>Help / How to use CampCare</h1><div class="desc">A quick, step-by-step guide to every part of CampCare &mdash; for health workers and supervisors.</div></div>
    </div>

    <div class="help-group-label">For health workers</div>
    ${helpCard(1, "Registering a Family &amp; Child", "Register family & child page", "register-family.png",
      "Add a guardian and one or more children during a home visit. If the family already has a child on file, use \"Existing family\" instead so you don't have to re-type the guardian's details.",
      ["Click <b>'Register family &amp; child'</b> in the sidebar.",
       "For a new family, enter the guardian's name, phone number, and area. If the family is already registered, switch to <b>'Existing family'</b> and select them from the list.",
       "Enter the child's name and date of birth. Click <b>'+ Add another child'</b> to register more than one child at once.",
       "Click <b>'Save &amp; generate schedule'</b> and the vaccination schedule is created automatically."])}

    ${helpCard(2, "Checking Who's Due for a Vaccine", "Due / overdue list page", "due-overdue-list.png",
      "See every child in your zone with a color-coded status &mdash; at a glance you'll know who needs a visit this week.",
      ["Click <b>'Due / overdue list'</b> in the sidebar.",
       "<span class=\"stamp given\" style=\"vertical-align:middle;\">Green</span> means the child is up to date.",
       "<span class=\"stamp soon\" style=\"vertical-align:middle;\">Gold</span> means a vaccine is due soon.",
       "<span class=\"stamp overdue\" style=\"vertical-align:middle;\">Red</span> means overdue &mdash; visit this family as soon as possible.",
       "Click on a child's name to open their full vaccination record."])}

    ${helpCard(3, "Scheduling a Camp", "Schedule camp page", "schedule-camp.png",
      "Plan an outreach vaccination camp for your zone so families know where and when to come.",
      ["Click <b>'Schedule camp'</b> in the sidebar.",
       "Enter the location and date (e.g. a union parishad ground or school field).",
       "Click <b>'Add camp'</b> and it will appear in <b>'Camp list'</b>.",
       "On the day of the camp, go to <b>'Camp attendance'</b> to check families in."])}

    ${helpCard(4, "Sending Reminders", "Send reminder page", "send-reminder.png",
      "Broadcast a Telegram reminder to every registered family in a zone ahead of a camp date.",
      ["Click <b>'Send reminder'</b> in the sidebar.",
       "From the dropdown, select the camp you want to send a reminder for.",
       "Click <b>'Send Telegram reminder'</b> to message every registered family at once."])}

    <div class="help-group-label">For supervisors</div>
    ${helpCard(5, "Supervisor Dashboard", "Coverage-gap dashboard page", "supervisor-dashboard.png",
      "Get a bird's-eye view of vaccination coverage across every health worker's zone, and spot which areas need more outreach.",
      ["Log in as a supervisor and the <b>'Coverage-gap dashboard'</b> opens automatically.",
       "Coverage bars are shown per zone &mdash; red or gold bars mean that zone needs more attention.",
       "Open <b>'Multi-worker overview'</b> to see each health worker's registration and vaccination counts.",
       "Open <b>'Performance report'</b> for a closer look at each worker's families, doses given, coverage rate, and camps run."])}
  `;
}


/* ---------------- 404 ---------------- */
function render404(view){
  return `
    <div class="panel empty-state">
      That page doesn't exist or hasn't been built yet.<br><br>
      <button class="btn dark" onclick="go(session.role==='worker'?'dashboard':'supervisor')">Back to home</button>
    </div>
  `;
}
