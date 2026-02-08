(function () {
  const data =
    window.READIFY_DATA && Array.isArray(window.READIFY_DATA.books)
      ? window.READIFY_DATA.books
      : [];

  const cards = document.getElementById("cards");
  const search = document.getElementById("search");
  const genre = document.getElementById("genre");
  const count = document.getElementById("resultsCount");
  const clear = document.getElementById("clearFilters");

  // Modal elements
  const back = document.getElementById("modalBack");
  const close = document.getElementById("closeModal");
  const mTitle = document.getElementById("mTitle");
  const mMeta = document.getElementById("mMeta");
  const mSynopsis = document.getElementById("mSynopsis");
  const mSeries = document.getElementById("mSeries");
  const mReviews = document.getElementById("mReviews");
  const saveBtn = document.getElementById("saveToList");
  const saveStatus = document.getElementById("saveStatus");

  let currentBook = null;

  //Helpers
  function lengthLabel(p) {
    if (p <= 200) return "Short";
    if (p <= 400) return "Medium";
    return "Long";
  }

  function safeText(v) {
    return (v ?? "").toString();
  }

  //genre dropdown
  (function initGenres() {
    if (!genre) return;
    const genres = Array.from(new Set(data.map((b) => b.genre))).sort();
    genres.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g;
      genre.appendChild(opt);
    });
  })();

  //Render cards
  function render(list) {
    if (!cards) return;
    cards.innerHTML = "";

    list.forEach((book) => {
      const el = document.createElement("article");
      el.className = "card bookCard";
      el.tabIndex = 0;

      // Cover image
      const coverHTML = book.cover
        ? `<img src="${book.cover}" alt="${safeText(book.title)} cover" loading="lazy">`
        : `<span>${book.emoji || "📘"}</span>`;

      el.innerHTML = `
        <div class="cover" aria-hidden="true">${coverHTML}</div>
        <div class="bookMeta">
          <h3>${safeText(book.title)}</h3>
          <p>${safeText(book.author)}</p>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px">
            <span class="tag">${safeText(book.genre)}</span>
            <span class="tag">${lengthLabel(book.pages)} • ${book.pages} pages</span>
          </div>
        </div>
      `;

      // Make clicking card open modal
      el.addEventListener("click", () => openModal(book));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(book);
        }
      });

      cards.appendChild(el);
    });

    if (count) count.textContent = `${list.length} book(s) shown`;
  }

  //Filters
  function applyFilters() {
    const q = (search?.value || "").trim().toLowerCase();
    const g = genre?.value || "all";

    const filtered = data.filter((b) => {
      const matchText = `${b.title} ${b.author}`.toLowerCase().includes(q);
      const matchGenre = g === "all" ? true : b.genre === g;
      return matchText && matchGenre;
    });

    render(filtered);
  }

  //Modal logic
  function openModal(book) {
    currentBook = book;

    if (mTitle) mTitle.textContent = safeText(book.title);
    if (mMeta) mMeta.textContent = `${safeText(book.author)} • ${safeText(book.genre)} • ${book.pages} pages`;
    if (mSynopsis) mSynopsis.textContent = safeText(book.synopsis);

    // Series
    if (mSeries) {
      mSeries.innerHTML = "";
      const pre = book.series?.prequel;
      const seq = book.series?.sequel;

      if (!pre && !seq) {
        const li = document.createElement("li");
        li.textContent = "Standalone (no prequel/sequel listed).";
        mSeries.appendChild(li);
      } else {
        if (pre) {
          const li = document.createElement("li");
          li.textContent = `Prequel: ${pre}`;
          mSeries.appendChild(li);
        }
        if (seq) {
          const li = document.createElement("li");
          li.textContent = `Sequel: ${seq}`;
          mSeries.appendChild(li);
        }
      }
    }

    // Reviews
    if (mReviews) {
      mReviews.innerHTML = "";
      (book.reviews || []).forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${safeText(r.name)}</td><td>${"⭐".repeat(r.rating || 0)}</td><td>${safeText(r.comment)}</td>`;
        mReviews.appendChild(tr);
      });
    }

    // Reading list status
    if (saveStatus) saveStatus.textContent = "";

    const list = loadLS("readify_reading_list", []);
    const exists = list.some((x) => x.id === book.id);

    if (saveBtn) {
      saveBtn.disabled = exists;
      saveBtn.textContent = exists ? "Already saved ✔" : "Save to reading list";
    }

    if (back) back.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (back) back.classList.remove("open");
    document.body.style.overflow = "";
    currentBook = null;
  }

  // Save to reading list
  saveBtn?.addEventListener("click", () => {
    if (!currentBook) return;

    const list = loadLS("readify_reading_list", []);
    if (list.some((x) => x.id === currentBook.id)) {
      if (saveStatus) saveStatus.textContent = "Already saved.";
      return;
    }

    list.push({
      id: currentBook.id,
      title: currentBook.title,
      author: currentBook.author,
      pages: currentBook.pages,
      genre: currentBook.genre,
    });

    saveLS("readify_reading_list", list);

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Saved ✔";
    }
    if (saveStatus) saveStatus.textContent = "Saved to your reading list.";
    toast("Saved to reading list.");
  });

  // Modal close events
  back?.addEventListener("click", (e) => {
    if (e.target === back) closeModal();
  });
  close?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && back?.classList.contains("open")) closeModal();
  });

  // Filter listeners
  search?.addEventListener("input", applyFilters);
  genre?.addEventListener("change", applyFilters);
  clear?.addEventListener("click", () => {
    if (search) search.value = "";
    if (genre) genre.value = "all";
    applyFilters();
  });

  // Initial render
  render(data);
})();
