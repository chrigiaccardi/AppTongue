import "../scss/style.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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
  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
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
  return element;
}
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
    console.log(listaIdNews);
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
      classi: ["nuovo-item",],
      padre: contenitoreNews,
      innerHTML: `<h2><a class="link" href="${news.url || "#"}" target="_blank">${
      news.title
    }</a></h2>
        <p class="data">Pubblicato il: ${dateString}</p>`,
    });
  } catch (error) {}
}

// Creazione DOM

const hero = creaElemento("hero", {
  classi: ["hero", "text-center"],
  padre: document.body,
})
const contenitoreApp = creaElemento("main", {
  classi: ["container","contenitoreApp"],
  padre: document.body,
})
const contenitoreNews = creaElemento("div", {
  classi: ["contenitoreNews"],
  padre: contenitoreApp,
});

const footer = creaElemento("footer", {
  classi: ["footer"],
  padre: document.body,
})
const titolo = creaElemento("h1", {
  text: "News in tempo Reale",
  classi: ["titolo"],
  padre: hero,
});
const titolo2 = creaElemento("h3", {
  text: "Le ultime notizie dal mondo, aggiornate in tempo reale",
  classi: ["titolo"],
  padre: hero,
});
const bottoneLoadMore = creaElemento("button", {
  text: "Carica più News",
  classi: ["bottoneLoadMore", "btn-primary"],
  padre: contenitoreNews,
});


bottoneLoadMore.addEventListener("click", caricaNewsSuccessive);
listaNews();
