
// ---- HERENCIA ----
// HistorialIntentos hereda de BaseStorage (la misma clase que ya
// está en storage.js con setJson/getJson). Así no repetimos código
// para guardar y leer cosas del localStorage.
class HistorialIntentos extends BaseStorage {
  // guarda un intento nuevo, sin borrar los anteriores
  guardarIntento(usuario, resultado) {
    const clave = 'historial_' + usuario;
    const historial = this.getJson(clave) || [];
 
    // ---- OBJETO / ENCAPSULAMIENTO ----
    // Este objeto junta todo lo de "un intento" en un solo lugar
    const intento = {
      fecha: resultado.fecha,
      categoriaPrincipal: resultado.categoriaPrincipal,
      categoriaSecundaria: resultado.categoriaSecundaria
    };
 
    historial.push(intento);
 
    // solo guardamos los últimos 5, para no llenar el localStorage
    const ultimosCinco = historial.slice(-5);
    this.setJson(clave, ultimosCinco);
  }
 
  // regresa todos los intentos guardados de ese usuario (o [] si no hay)
  obtenerHistorial(usuario) {
    const clave = 'historial_' + usuario;
    return this.getJson(clave) || [];
  }
}
 
// ---- CLASE BASE PARA POLIMORFISMO ----
// TarjetaIntento sabe armar el HTML común (fecha + carrera), pero
// deja el "estilo" (osea las clases CSS que le pone) vacío para
// que cada clase hija decida cómo se ve.
class TarjetaIntento {
  constructor(intento, api) {
    this.intento = intento;
    this.api = api;
  }
 
  // el texto es igual para todas las tarjetas
  textoCarrera() {
    if (!this.intento.categoriaPrincipal) return 'Sin resultado';
    return this.api.CATEGORY_LABELS[this.intento.categoriaPrincipal];
  }
 
  textoFecha() {
    const fecha = new Date(this.intento.fecha);
    return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  }
 
  // método vacío: cada clase hija lo sobreescribe
  render() {}
}
 
// ---- HERENCIA + POLIMORFISMO ----
// Esta es la tarjeta para el intento MÁS RECIENTE: se ve resaltada
class TarjetaIntentoActual extends TarjetaIntento {
  render() {
    return (
      '<div class="tarjeta-intento tarjeta-intento-actual">' +
      '<p class="small-text">Más reciente · ' + this.textoFecha() + '</p>' +
      '<h3>' + this.textoCarrera() + '</h3>' +
      '</div>'
    );
  }
}
 
// Esta es para los intentos VIEJOS: se ve más apagada/chica.
// Mismo método render(), resultado distinto: esto es polimorfismo.
class TarjetaIntentoAnterior extends TarjetaIntento {
  render() {
    return (
      '<div class="tarjeta-intento tarjeta-intento-anterior">' +
      '<p class="small-text">' + this.textoFecha() + '</p>' +
      '<p>' + this.textoCarrera() + '</p>' +
      '</div>'
    );
  }
}

// Instancia singleton para uso desde otras páginas
const historialIntentos = new HistorialIntentos();
window.HISTORIAL_INTENTOS = historialIntentos;

// Renderiza el historial de un usuario dentro de un contenedor DOM
HistorialIntentos.prototype.renderForUser = function (usuario, api, container) {
  if (!container) return;
  const historial = this.obtenerHistorial(usuario) || [];
  if (!historial.length) {
    container.innerHTML = '<p class="small-text">Aún no tienes intentos guardados.</p>';
    return;
  }

  // mostramos más reciente primero
  const items = historial.slice().reverse();
  let html = '';
  for (let i = 0; i < items.length; i += 1) {
    const intento = items[i];
    const tarjeta = i === 0 ? new TarjetaIntentoActual(intento, api) : new TarjetaIntentoAnterior(intento, api);
    html += tarjeta.render();
  }
  container.innerHTML = html;
};