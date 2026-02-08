(function(){
  const rainBtn = document.getElementById("rainBtn");
  const fireBtn = document.getElementById("fireBtn");
  const stopAll = document.getElementById("stopAll");

  const pick = document.getElementById("pickComplete");
  const mark = document.getElementById("markComplete");
  const clear = document.getElementById("clearCompleted");
  const ul = document.getElementById("completedList");

  const LIST_KEY = "readify_reading_list";
  const DONE_KEY = "readify_completed_books";

  //Completed books 
  function loadList(){
    return loadLS(LIST_KEY, []);
  }
  function loadDone(){
    return loadLS(DONE_KEY, []);
  }
  function renderPick(){
    const list = loadList();
    pick.innerHTML = "";
    if(list.length === 0){
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No reading list found — save books first.";
      pick.appendChild(opt);
      pick.disabled = true;
      mark.disabled = true;
      return;
    }
    pick.disabled = false;
    mark.disabled = false;

    list.forEach(b=>{
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = `${b.title} — ${b.author}`;
      pick.appendChild(opt);
    });
  }
  function renderDone(){
    const done = loadDone();
    ul.innerHTML = "";
    if(done.length === 0){
      ul.innerHTML = "<li>Nothing completed yet. Go read, legend.</li>";
      return;
    }
    done.forEach(x=>{
      const li = document.createElement("li");
      li.textContent = `${x.title} (${x.when})`;
      ul.appendChild(li);
    });
  }

  mark.addEventListener("click", ()=>{
    const id = pick.value;
    if(!id){ toast("Pick a book first."); return; }
    const list = loadList();
    const item = list.find(x=>x.id === id);
    if(!item){ toast("Book not found in reading list."); return; }

    const done = loadDone();
    if(done.some(x=>x.id === id)){
      toast("Already marked completed.");
      return;
    }
    const when = new Date().toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"});
    done.push({ id, title: item.title, when });
    saveLS(DONE_KEY, done);
    toast("Marked as completed 🎉");
    renderDone();
  });

  clear.addEventListener("click", ()=>{
    localStorage.removeItem(DONE_KEY);
    toast("Completed list cleared.");
    renderDone();
  });

  //  Cozy sounds
  const rainAudio = new Audio("./assets/audio/rain.mp3");
  const fireAudio = new Audio("./assets/audio/fire.mp3");

  rainAudio.loop = true;
  fireAudio.loop = true;

  rainAudio.volume = 0.6;
  fireAudio.volume = 0.6;

  function setBtn(btn, name, on){
    btn.textContent = on ? `${name}: On` : `${name}: Off`;
    btn.classList.toggle("primary", on);
  }

  async function playAudio(audio){
    try{
      await audio.play();
    }catch(e){
      toast("Tap the button again to allow audio playback.");
      console.warn("Audio play blocked:", e);
    }
  }

  rainBtn.addEventListener("click", async ()=>{
    if(!rainAudio.paused){
      rainAudio.pause();
      rainAudio.currentTime = 0;
      setBtn(rainBtn, "🌧️ Rain", false);
      toast("Rain off.");
    }else{
      await playAudio(rainAudio);
      setBtn(rainBtn, "🌧️ Rain", true);
      toast("Rain on.");
    }
  });

  fireBtn.addEventListener("click", async ()=>{
    if(!fireAudio.paused){
      fireAudio.pause();
      fireAudio.currentTime = 0;
      setBtn(fireBtn, "🔥 Fireplace", false);
      toast("Fireplace off.");
    }else{
      await playAudio(fireAudio);
      setBtn(fireBtn, "🔥 Fireplace", true);
      toast("Fireplace on.");
    }
  });

  stopAll.addEventListener("click", ()=>{
    rainAudio.pause();
    rainAudio.currentTime = 0;

    fireAudio.pause();
    fireAudio.currentTime = 0;

    setBtn(rainBtn, "🌧️ Rain", false);
    setBtn(fireBtn, "🔥 Fireplace", false);
    toast("All sounds stopped.");
  });

 
  renderPick();
  renderDone();
})();
