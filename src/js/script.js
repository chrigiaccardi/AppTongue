// Import SCSS e Bootstrap
import "../scss/style.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Inizializzazione
let listaIdNews = [];
let indiceCorrente = 0;
const newsPerPagina = 10;

// API tramite Environment Variables
const API_BASE = process.env.API_BASE;

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

// Funzioni Caricamento News API
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
    const data = new Date(news.time * 1000);
    const dateString = data.toLocaleString("it-IT");
    const nuovoItem = creaElemento("div", {
      classi: ["nuovo-item"],
      padre: contenitoreNews,
      innerHTML: `<h2><a class="text-decoration-none" href="${
        news.url || "#"
      }" target="_blank">${news.title}</a></h2>
        <p class="data">Pubblicato il: ${dateString}</p>`,
    });
  } catch (error) {}
}

// Creazione DOM
const hero = creaElemento("hero", {
  classi: ["hero", "text-center"],
  padre: document.body,
});

const contenitoreApp = creaElemento("main", {
  classi: ["container", "contenitoreApp"],
  padre: document.body,
});

const contenitoreNews = creaElemento("div", {
  classi: ["contenitoreNews"],
  padre: contenitoreApp,
});

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
  classi: ["btn", "btn-primary", "d-block", "mx-auto"],
  padre: document.body,
  eventi: { click: caricaNewsSuccessive },
});

const footer = creaElemento("footer", {
  classi: ["footer", "text-center"],
  padre: document.body,
  innerHTML: `<p class="mb-0">&copy; 2026 Tongue | Creato con Hacker News API</p>
    <p class="mb-0">Sviluppato da Giaccardi Christian</p>
    <a href="https://github.com/chrigiaccardi" target="_blank" rel="noopener noreferrer" class="mx-2">
      <img class="logo-footer" src="./src/img/github-mark.png" alt="Logo GitHub">
    </a>
    <a href="https://www.linkedin.com/in/christian-giaccardi-753085180/" target="_blank" rel="noopener noreferrer" class="mx-2">
      <img class="logo-footer" src="./src/img/LinkedIn-Logo.svg" alt="Logo LinkedIn">
    </a>`,
  attributi: {
    id: "contatti",
  },
});

// Richiamo Funzione API
listaNews();
