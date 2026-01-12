import"../scss/style.scss"

let listaIdNews = [];
  let indiceCorrente = 0;
  const newsPerPagina = 10;
  const API_BASE = "https://hacker-news.firebaseio.com/v0";

  // Funzione creaElemento
  function creaElemento(tag, options = {}) {
    const element = document.createElement(tag);
    if (options.padre) {
      options.padre.appendChild(element);
    }
    if (options.text !== undefined) {
      element.textContent = options.text;
    }
    if (options.classi) {
      element.classList.add(...options.classi);
    }
    if (options.attributi) {
      for (const [chiave, valore] of Object.entries(options.attributi)) {
        element.setAttribute(chiave, valore);
      }
    }
    if (options.eventi) {
      for (const [event, handler] of Object.entries(options.eventi)) {
        element.addEventListener(event, handler);
      }
    }
    return element
  }

  const contenitoreApp = document.querySelector(".contenitoreApp");
  const contenitoreNews = creaElemento("div", {
    classi: ["contenitoreNews"],
    padre: contenitoreApp,
  });
  const titolo = creaElemento("h1", {
    text: "News in tempo Reale",
    classi: ["titolo"],
    padre: contenitoreApp,
  });
  const bottoneLoadMore = creaElemento("button", {
    text: "Carica più News",
    classi: ["bottoneLoadMore", "btn-primary"],
    padre: contenitoreApp,
  });

bottoneLoadMore.addEventListener("click", caricaNewsSuccessive);
  
// Funzione Caricamento Lista News
  
  async function caricaNewsSuccessive() {
    const idNewsSuccessive = listaIdNews.slice(
      indiceCorrente,
      indiceCorrente + newsPerPagina
    );
    for (let id of idNewsSuccessive) {
      await dettagliNews(id);
    }
    indiceCorrente += newsPerPagina;
    if (indiceCorrente >= listaIdNews.length) {
      bottoneLoadMore.style.display = "none";
    }
  }

  async function listaNews() {
    try {
      const response = await fetch(`${API_BASE}/newstories.json`);
      if (!response.ok) {
        throw new Error("Fetch Lista news fallito");
      }
      listaIdNews = await response.json();
      console.log(listaIdNews)
      caricaNewsSuccessive();
    } catch (error) {
      console.error("Errore Caricamento News", error);
    }
  }

  async function dettagliNews(id) {
    try {
      const response = await fetch(`${API_BASE}/item/${id}.json`);
      if (!response.ok) {
        throw new Error("Fetch dettagli news Fallito");
      }
      const news = await response.json();
      if (!news) return;
      console.log(news);
      const data = new Date(news.time * 1000);
      const dateString = data.toLocaleString("it-IT");
      const nuovoItem = creaElemento("div", {
        classi: ["nuovo-item"],
        padre: contenitoreNews,
      });
      nuovoItem.innerHTML = `<h2><a href="${news.url || "#"}" target="_blank">${
        news.title
      }</a></h2>
        <p class="data">Pubblicato il: ${dateString}</p>`;
    } catch (error) {}
  }

  listaNews();


