/* ============================================================
   CampCare — now wired to the PHP/MySQL backend.
   Adjust API_BASE below to match where Backend/*.php actually
   lives relative to this HTML file (see the note at the end of
   this file for details on folder layout & PHP sessions/CORS).
   ============================================================ */
const API_BASE = "../Backend/"; // <-- change this if your folder layout differs

async function apiPost(file, data){
  const body = new URLSearchParams();
  Object.keys(data).forEach(k=>{
    const v = data[k];
    if(Array.isArray(v)) v.forEach(item=>body.append(k+"[]", item));
    else body.append(k, v);
  });
  const res = await fetch(API_BASE + file, {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type":"application/x-www-form-urlencoded"},
    body
  });
  return res.json();
}
async function apiGet(file, params){
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(API_BASE + file + qs, { credentials: "include" });
  return res.json();
}

