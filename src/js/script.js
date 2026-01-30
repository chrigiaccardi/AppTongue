// Import SCSS e Bootstrap
import "../scss/style.scss";

// Inizializzazione
const CONFIG = {
  NEWS_PER_PAGINA: 10,
  MOLTIPLICATORE_MS: 1000,
  API_BASE: process.env.API_BASE
};

let stato = {
  listaIdNews :[],
  indiceCorrente: 0,
};

// Riferimenti DOM
const CONTENITORE_NEWS = document.querySelector(".contenitoreNews");
const BOTTONE_LOAD_MORE = document.querySelector(".btn");

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
};

function skeletons() {
    const SK_WRAPPER = creaElemento("div", { padre: CONTENITORE_NEWS });
  for (let i = 0; i < CONFIG.NEWS_PER_PAGINA; i++) {
    creaElemento("div", {
      classi: ["nuovo-item"],
      padre: SK_WRAPPER,
      innerHTML: `<h2 class="titoloSkeleton"></h2>
        <p class="paragrafoSkeleton"></p>`,
    })
  };
  return SK_WRAPPER;
};
const SKW = skeletons();  



// Funzioni Caricamento News API
async function caricaNewsSuccessive() {
  const ID_NEWS_SUCCESSIVE = stato.listaIdNews.slice(
    stato.indiceCorrente, stato.indiceCorrente + CONFIG.NEWS_PER_PAGINA
  );
  // Await promise.all garantisce che le chiamate siano fatte tutte in parallelo
  await Promise.all(ID_NEWS_SUCCESSIVE.map(id => dettagliNews(id)))
  // stato.indiceCorrente si aggiorna per tenere traccia di quali news visualizzare
  stato.indiceCorrente += CONFIG.NEWS_PER_PAGINA;
  if (stato.indiceCorrente >= stato.listaIdNews.length) {
    BOTTONE_LOAD_MORE.remove();
  }
}




async function listaNews() {
  try {
    const RESPONSE = await fetch(`${CONFIG.API_BASE}/newstories.json`);
    if (!RESPONSE.ok) {
      throw new Error("Fetch Lista news fallito");
    }
    stato.listaIdNews = await RESPONSE.json();
    caricaNewsSuccessive();
  } catch (error) {
    console.error("Errore Caricamento News", error);
    SKW.remove();
    // Viene creato un div per segnalare all'utente che c'è un problema nel caricamento delle news
    const ERRORE_LISTA_NEWS = creaElemento("div", {
      text: "⚠️ Si è verificato un errore nel caricamento della lista delle News! ⚠️",
      classi: ["nuovo-item", "text-center"],
      padre: CONTENITORE_NEWS
    });
    // Visto che c'è errore il bottone viene eliminato
    BOTTONE_LOAD_MORE.remove();

  }
}

async function dettagliNews(id) {
  try {
    const RESPONSE = await fetch(`${CONFIG.API_BASE}/item/${id}.json`);
    if (!RESPONSE.ok) {
      throw new Error("Fetch dettagli news Fallito");
    }
    const NEWS = await RESPONSE.json();
    // Se una News è difettosa o mancano dei dati non vengono visualizzate nell'elenco
    if (!NEWS || typeof NEWS !== "object") {
      console.warn("News Difettosa: " + id)
     return 
    };
    if (!NEWS.title || !NEWS.url || !NEWS.time) {
      console.warn("Dati news incompleti: " + id + NEWS.title);
      return
    }
    SKW.remove();
    const DATA = new Date(NEWS.time * CONFIG.MOLTIPLICATORE_MS);
    const STRINGA_DATA = DATA.toLocaleString("it-IT");
    const NUOVO_ITEM = creaElemento("div", {
      classi: ["nuovo-item"],
      padre: CONTENITORE_NEWS,
      innerHTML: `<h2><a class="text-decoration-none" href="${NEWS.url}" target="_blank">${NEWS.title}</a></h2>
        <p class="data">Pubblicato il: ${STRINGA_DATA}</p>`,
    });
    
  } catch (error) {
    console.error("Errore Caricamento Dettagli News" + error);
      SKW.remove();
    const ERRORE_DETTAGLI_NEWS = creaElemento("div", {
      text: "⚠️ Si è verificato un errore nel caricamento dei dettagli delle News!! ⚠️",
      classi: ["nuovo-item", "text-center"],
      padre: CONTENITORE_NEWS
    });
    BOTTONE_LOAD_MORE.remove();
    return
  };
}
// Event Listener sul click che avvia la funzione caricaNewsSuccessive
BOTTONE_LOAD_MORE.addEventListener("click", async () => {
  const SKW = skeletons();
  await caricaNewsSuccessive();
  SKW.remove();
})

// Richiamo Funzione API
listaNews();
