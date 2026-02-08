(function () {
  const books = (window.READIFY_DATA && window.READIFY_DATA.books) ? window.READIFY_DATA.books : [];
  const gSel = document.getElementById("rGenre");
  const lSel = document.getElementById("rLen");
  const pickBtn = document.getElementById("pickBtn");
  const againBtn = document.getElementById("againBtn");

  const box = document.getElementById("suggestion");
  const sTitle = document.getElementById("sTitle");
  const sMeta = document.getElementById("sMeta");
  const sSynopsis = document.getElementById("sSynopsis");
  const saveRec = document.getElementById("saveRec");
  const recStatus = document.getElementById("recStatus");

  const listWrap = document.getElementById("list");
  const KEY = "readify_reading_list";

  let current = null;

  const genres = Array.from(new Set(books.map(b => b.genre))).sort();
  genres.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    gSel.appendChild(opt);
  });

  function lenType(p) {
    if (p <= 200) return "short";
    if (p <= 400) return "medium";
    return "long";
  }

  function pick() {
    const g = gSel.value;
    const l = lSel.value;

    const pool = books.filter(b => {
      const okG = (g === "all") ? true : (b.genre === g);
      const okL = (l === "all") ? true : (lenType(b.pages) === l);
      return okG && okL;
    });

    if (pool.length === 0) {
      toast("No books match that combo. Try different filters.");
      return null;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function show(book) {
    if (!book) return;
    current = book;
    sTitle.textContent = book.title;
    sMeta.textContent = `${book.author} • ${book.genre} • ${book.pages} pages`;
    sSynopsis.textContent = book.synopsis;

    box.classList.remove("pulse"); void box.offsetWidth; box.classList.add("pulse");

    recStatus.textContent = "";
    const list = loadLS(KEY, []);
    const exists = list.some(x => x.id === book.id);
    saveRec.disabled = exists;
    saveRec.textContent = exists ? "Already saved" : "Save to reading list";
  }

  function renderList() {
    const list = loadLS(KEY, []);
    listWrap.innerHTML = "";
    if (list.length === 0) {
      listWrap.innerHTML = `<div class="card" style="padding:14px">Your reading list is empty. Save a recommendation to start.</div>`;
      return;
    }
    list.forEach(item => {
      const el = document.createElement("article");
      el.className = "card bookCard";
      el.innerHTML = `
        <div class="bookMeta" style="padding:14px">
          <h3>${item.title}</h3>
          <p>${item.author}</p>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px">
            <span class="tag">${item.genre}</span>
            <span class="tag">${item.pages} pages</span>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px">
            <button class="btn danger" type="button">Remove</button>
          </div>
        </div>
      `;
      el.querySelector("button").addEventListener("click", () => {
        const next = loadLS(KEY, []).filter(x => x.id !== item.id);
        saveLS(KEY, next);
        toast("Removed from reading list.");
        renderList();
      });
      listWrap.appendChild(el);
    });
  }

  pickBtn.addEventListener("click", () => {
    const b = pick();
    show(b);
  });

  againBtn.addEventListener("click", () => {
    const b = pick();
    show(b);
  });

  saveRec.addEventListener("click", () => {
    if (!current) { toast("Pick a book first."); return; }
    const list = loadLS(KEY, []);
    if (list.some(x => x.id === current.id)) {
      recStatus.textContent = "Already saved.";
      return;
    }
    list.push({ id: current.id, title: current.title, author: current.author, pages: current.pages, genre: current.genre });
    saveLS(KEY, list);
    saveRec.disabled = true;
    saveRec.textContent = "Saved";
    recStatus.textContent = "Saved to your reading list.";
    toast("Saved to reading list.");
    renderList();
  });

  renderList();
})();
