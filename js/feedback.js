(function(){
  const form = document.getElementById("fbForm");
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("msg");
  const status = document.getElementById("fbStatus");
  const clearBtn = document.getElementById("clearFb");
  const table = document.getElementById("fbTable");
  const faqWrap = document.getElementById("faq");

  const KEY = "readify_feedback";

  const faqs = [
    { q: "Is Readify a real company?", a: "Nope. This is a front-end assignment site to demonstrate HTML, CSS, and JavaScript features." },
    { q: "Where is my data stored?", a: "In your browser using localStorage. It stays after refresh, but only on this device/browser." },
    { q: "Why does the site work offline?", a: "It includes a simple service worker and offline page, so core pages can be cached." },
    { q: "Can I delete everything?", a: "Yes. Use the clear buttons on pages, or clear your browser storage." }
  ];

  function validEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function renderFAQ(){
    faqWrap.innerHTML = "";
    faqs.forEach((item, idx)=>{
      const box = document.createElement("div");
      box.className = "card q";
      box.innerHTML = `
        <button type="button" aria-expanded="false">
          <span>${item.q}</span>
          <span aria-hidden="true">▾</span>
        </button>
        <div class="a">
          <p style="margin:10px 0 0">${item.a}</p>
        </div>
      `;
      const btn = box.querySelector("button");
      btn.addEventListener("click", ()=>{
        const open = box.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      faqWrap.appendChild(box);
    });
  }

  function renderTable(){
    const rows = loadLS(KEY, []);
    table.innerHTML = "";
    if(rows.length === 0){
      table.innerHTML = `<tr><td colspan="4">No feedback stored yet.</td></tr>`;
      return;
    }
    rows.slice().reverse().slice(0, 8).forEach(r=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.date}</td><td>${r.name}</td><td>${r.email}</td><td>${r.message}</td>`;
      table.appendChild(tr);
    });
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    status.textContent = "";

    const name = (nameEl.value || "").trim();
    const email = (emailEl.value || "").trim();
    const message = (msgEl.value || "").trim();

    // Custom validation messages
    if(name.length < 2){ toast("Name must be at least 2 characters."); return; }
    if(!validEmail(email)){ toast("Enter a valid email address."); return; }
    if(message.length < 10){ toast("Message must be at least 10 characters."); return; }

    const date = new Date().toLocaleString();
    const rows = loadLS(KEY, []);
    rows.push({ name, email, message, date });
    saveLS(KEY, rows);

    status.textContent = "Submitted ✔ Thanks!";
    toast("Feedback saved locally.");
    form.reset();
    renderTable();
  });

  clearBtn.addEventListener("click", ()=>{
    localStorage.removeItem(KEY);
    status.textContent = "Cleared.";
    toast("Stored feedback cleared.");
    renderTable();
  });

  renderFAQ();
  renderTable();
})();