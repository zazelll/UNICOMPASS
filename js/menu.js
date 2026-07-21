//esto sirve para inicializar la pagina de menu cuando se carga el DOM
//usa classes de storage.js para manejar la comunicación con Google Sheets 
// y enviar acciones como registrar, login, editarPerfil
//aqui es el funcionamiento para ver menu.html y mostrar los datos del usuario actual
//  y el mapa de Google Maps
class PaginaMenu extends PageBase {
  constructor(api) {
    super(api);//dice api para poder acceder a los datos del usuario actual y actualizar 
    //su perfil en el exel de gpoogle q es url de la api sinseramente es como una pagina web que se conecta con el google sheet y permite guardar los datos del registro
    this.api = api;
    this.user = api.getCurrentUser();
  }
//es para inicializar la pagina de menu cuando se carga el DOM
  mostrarDatosDelUsuario() {
    var nombreCompleto = this.get('nombreCompleto');
    var usuarioActual = this.get('usuarioActual');
    var direccionActual = this.get('direccionActual');
    var estatusActual = this.get('estatusActual');
    var escuelasSeleccionadas = this.get('escuelasSeleccionadas') || this.get('seleccionadasList');
//sirve para obtener la direccion completa del usuario actual y mostrarla en la pagina de menu
    var direccion = this.api.getDireccionCompleta(this.user);
    if (nombreCompleto) {
      nombreCompleto.textContent = (this.user.nombre || '') + ' ' + (this.user.apellido || '');
    }//es para mostrar el nombre completo del usuario actual en la pagina de menu
    if (usuarioActual) {
      usuarioActual.textContent = this.user.usuario || '';
    }//aqui es para mostrar el nombre de usuario del usuario actual en la pagina de menu
    if (direccionActual) {
      direccionActual.textContent = direccion || 'no registrado aún porfa ve a tu perfil y registrala';
    }

    if (estatusActual) {
      var resultado = this.user.vocacionalResultado;
      if (resultado && resultado.categoriaPrincipal) {
        estatusActual.textContent = 'Tu área vocacional es: ' + this.api.CATEGORY_LABELS[resultado.categoriaPrincipal];
      } else {//si no hay resultado de la encuesta vocacional, se muestra un mensaje indicando que aún no se ha completado
        estatusActual.textContent = 'Aún no has completado la encuesta vocacional ve a completarla!!!.';
      }
    }

    if (escuelasSeleccionadas) {
      escuelasSeleccionadas.innerHTML = '';
    }
  }
//muestra el mapa de Google Maps con la ubicación del usuario y las escuelas recomendadas según su resultado de la encuesta vocacional
  mostrarMapa() {
    var mapFrame = this.get('mapFrame');
    var mapCaption = this.get('mapCaption');
    var mapNote = this.get('mapNote');
    if (!mapFrame) return;
//sirve para obtener la direccion completa del usuario actual y mostrarla en el mapa de Google Maps
    var direccion = this.api.getDireccionCompleta(this.user);
    var resultado = this.user.vocacionalResultado;
    var tieneResultado = resultado && resultado.categoriaPrincipal;
    var query = '';
    var nota = '';
//aqui es para mostrar el mapa de Google Maps con la ubicación del usuario y 
// las escuelas recomendadas según su resultado de la encuesta vocacional
    if (tieneResultado) {
      var principal = this.api.CAREERS[resultado.categoriaPrincipal];
      if (direccion) {
        query = principal.escuela + ' cerca de ' + direccion;
        if (mapCaption) {//aqui es para mostrar el mapa de Google Maps con la ubicación del usuario y las escuelas recomendadas según su resultado de la encuesta vocacional
          mapCaption.textContent = 'Escuelas cerca de ti según tus resultados:';
        }//aqui envestiga para mostrar el mapa de Google Maps con la ubicación del usuario y las escuelas recomendadas según su resultado de la encuesta vocacional
        nota = 'Mostrando "' + principal.escuela + '" cerca de "' + direccion + '".';
      } else {
        query = principal.escuela;
        if (mapCaption) {
          mapCaption.textContent = 'Escuelas cerca de ti según tu encuesta:';
        }//esto es por si aun no registras tu dirección, se muestra un mensaje indicando que aún no se ha registrado la dirección y se sugiere agregarla en el perfil para ver escuelas más cercanas
        nota = 'Aún no registras tu dirección. Agrégala en tu perfil para ver escuelas más cercanas a ti porfa.';
      }
    } else if (direccion) {
      query = direccion;
      if (mapCaption) {//esto es parte de la funcion mostrarMapa() que sirve para mostrar el mapa de Google Maps con la ubicación del usuario y las escuelas recomendadas según su resultado de la encuesta vocacional
        mapCaption.textContent = 'Tu ubicación es:';
      }
      nota = 'Completa la encuesta vocacional para ver aquí las escuelas recomendadas para ti.';
    } else {
      query = 'Ciudad de México';
      if (mapCaption) {
        mapCaption.textContent = 'Mapa de Google:';
      }
      nota = 'Agrega tu dirección en tu perfil y completa la encuesta para ver un mapa personalizado.';
    }
//aqui es para q la url del mapa de Google Maps se genere dinámicamente según la ubicación del usuario 
// y las escuelas recomendadas según su resultado de la encuesta vocacional
    mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
    if (mapNote) {
      mapNote.textContent = nota;
    }
  }
//sirve para inicializar la pagina de menu cuando se carga el DOM
  iniciar() {
    if (!this.user) {
      this.redirect('secion.html');
      return;
    }
    this.mostrarDatosDelUsuario();
    this.mostrarMapa();
  }
}
//sirve para inicializar la pagina de menu cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function () {
  var api = window.UNICOMPASS;//dice api para poder acceder a los datos del usuario
  if (!api) return;
  var page = new PaginaMenu(api);
  page.iniciar();
});