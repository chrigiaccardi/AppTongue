// Import SCSS e Bootstrap
import "../scss/style.scss";

// Inizializzazione
let listaIdNews = [];
let indiceCorrente = 0;
const NEWS_PER_PAGINA = 10;
const MOLTIPLICATORE_SECONDI = 1000;


const CONTENITORE_NEWS = document.querySelector(".contenitoreNews")
const BOTTONE_LOAD_MORE = document.querySelector(".btn")

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
  const ID_NEWS_SUCCESSIVE = listaIdNews.slice(
    indiceCorrente, indiceCorrente + NEWS_PER_PAGINA
  );
  // Await promise.all garantisce che le chiamate siano fatte tutte in parallelo
  await Promise.all(ID_NEWS_SUCCESSIVE.map(id => dettagliNews(id)))

  indiceCorrente += NEWS_PER_PAGINA;
  if (indiceCorrente >= listaIdNews.length) {
    BOTTONE_LOAD_MORE.remove();
  }
}

async function listaNews() {
  try {
    const RESPONSE = await fetch(`${API_BASE}/newstories.json`);
    if (!RESPONSE.ok) {
      throw new Error("Fetch Lista news fallito");
    }
    listaIdNews = await RESPONSE.json();
    caricaNewsSuccessive();
  } catch (error) {
    console.error("Errore Caricamento News", error);
    const ERRORE_LISTA_NEWS = creaElemento("div", {
      text: "⚠️ Si è verificato un errore nel caricamento della lista delle News! ⚠️",
      classi: ["nuovo-item", "text-center"],
      padre: CONTENITORE_NEWS
    });
    BOTTONE_LOAD_MORE.remove();

  }
}

async function dettagliNews(id) {
  try {
    const RESPONSE = await fetch(`${API_BASE}/item/${id}.json`);
    if (!RESPONSE.ok) {
      throw new Error("Fetch dettagli news Fallito");
    }
    const NEWS = await RESPONSE.json();
    if (!NEWS || typeof NEWS !== "object") {
      console.warn("News Difettosa: " + id)
     return 
    };
    if (!NEWS.title || !NEWS.url || !NEWS.time) {
      console.warn("Dati news incompleti: " + id + NEWS.title);
      return
    }
    const DATA = new Date(NEWS.time * MOLTIPLICATORE_SECONDI);
    const STRINGA_DATA = DATA.toLocaleString("it-IT");
    const NUOVO_ITEM = creaElemento("div", {
      classi: ["nuovo-item"],
      padre: CONTENITORE_NEWS,
      innerHTML: `<h2><a class="text-decoration-none" href="${NEWS.url || "#"
        }" target="_blank">${NEWS.title}</a></h2>
        <p class="data">Pubblicato il: ${STRINGA_DATA}</p>`,
    });
  } catch (error) {
    console.error("Errore Caricamento Dettagli News" + error);
    const ERRORE_DETTAGLI_NEWS = creaElemento("div", {
      text: "⚠️ Si è verificato un errore nel caricamento dei dettagli delle News!! ⚠️",
      classi: ["nuovo-item", "text-center"],
      padre: CONTENITORE_NEWS
    });
    BOTTONE_LOAD_MORE.remove();
    return
  };
}

BOTTONE_LOAD_MORE.addEventListener("click", caricaNewsSuccessive)


// Richiamo Funzione API
listaNews();
