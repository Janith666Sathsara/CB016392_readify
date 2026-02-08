(function(){
  const form = document.getElementById("progressForm");
  const total = document.getElementById("totalPages");
  const read = document.getElementById("pagesRead");
  const speed = document.getElementById("speed");
  const book = document.getElementById("bookName");

  const pctEl = document.getElementById("pct");
  const bar = document.getElementById("bar");
  const finish = document.getElementById("finish");

  const saveBtn = document.getElementById("saveProgress");
  const loadBtn = document.getElementById("loadSaved");
  const clearBtn = document.getElementById("clearSaved");
  const savedInfo = document.getElementById("savedInfo");

  const KEY = "readify_progress";

  function animateNumber(targetPct){
    const start = 0;
    const end = targetPct;
    const duration = 520;
    const t0 = performance.now();
    function step(t){
      const k = clamp((t - t0) / duration, 0, 1);
      const val = Math.round(start + (end-start)*k);
      pctEl.textContent = `${val}%`;
      if(k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function calc(){
    const t = Number(total.value);
    const r = Number(read.value);
    const s = Number(speed.value);

    if(!t || t <= 0){ toast("Total pages must be greater than 0."); return null; }
    if(r < 0){ toast("Pages read can't be negative."); return null; }
    if(r > t){ toast("Pages read can't be more than total pages."); return null; }
    if(!s || s <= 0){ toast("Speed must be at least 1 page/day."); return null; }

    const pct = Math.round((r / t) * 100);
    const remaining = t - r;
    const days = Math.ceil(remaining / s);
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + days);

    return {
      book: (book.value || "").trim(),
      total: t,
      read: r,
      speed: s,
      pct,
      remaining,
      days,
      finishISO: finishDate.toISOString()
    };
  }

  function show(result){
    if(!result) return;
    bar.style.width = result.pct + "%";
    animateNumber(result.pct);

    const niceDate = new Date(result.finishISO).toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"});
    finish.innerHTML = `Remaining: <b>${result.remaining}</b> pages • Est. finish in <b>${result.days}</b> day(s) → <b>${niceDate}</b>`;
  }

  function refreshSavedPanel(){
    const saved = loadLS(KEY, null);
    if(!saved){
      savedInfo.textContent = "Nothing saved yet.";
      return;
    }
    const niceDate = new Date(saved.finishISO).toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"});
    savedInfo.innerHTML = `Book: <b>${saved.book || "—"}</b><br>Total: <b>${saved.total}</b>, Read: <b>${saved.read}</b>, Speed: <b>${saved.speed}/day</b><br>Finish: <b>${niceDate}</b>`;
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const result = calc();
    show(result);
  });

  saveBtn.addEventListener("click", ()=>{
    const result = calc();
    if(!result) return;
    saveLS(KEY, result);
    toast("Progress saved.");
    refreshSavedPanel();
  });

  loadBtn.addEventListener("click", ()=>{
    const saved = loadLS(KEY, null);
    if(!saved){ toast("No saved progress found."); return; }
    total.value = saved.total;
    read.value = saved.read;
    speed.value = saved.speed;
    book.value = saved.book || "";
    show(saved);
    toast("Loaded saved progress.");
  });

  clearBtn.addEventListener("click", ()=>{
    localStorage.removeItem(KEY);
    refreshSavedPanel();
    toast("Saved progress cleared.");
  });

  // Load saved preview on open
  refreshSavedPanel();
})();