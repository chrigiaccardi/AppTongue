// Funzione Generica per creare un elemento
function creaElemento(tag, options = {}) {
  const elemento = document.createElement(tag);
  if (options.padre) {
    options.padre.appendChild(elemento);
  }
  if (options.text !== undefined) {
    elemento.textContent = options.text;
  }
  if (options.classi) {
    elemento.classList.add(...options.classi);
  }
  if (options.attributi) {
    for (const [chiave, valore] of Object.entries(options.attributi)) {
      elemento.setAttribute(chiave, valore);
    }
  }
  return elemento;
}
