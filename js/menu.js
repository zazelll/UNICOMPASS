class PaginaMenu extends PageBase {
  constructor(api) {
    super(api);
    this.api = api;
    this.user = api.getCurrentUser();
  }

  mostrarDatosDelUsuario() {
    var nombreCompleto = this.get('nombreCompleto');
    var usuarioActual = this.get('usuarioActual');
    var direccionActual = this.get('direccionActual');
    var estatusActual = this.get('estatusActual');
    var escuelasSeleccionadas = this.get('escuelasSeleccionadas') || this.get('seleccionadasList');

    var direccion = this.api.getDireccionCompleta(this.user);
    if (nombreCompleto) {
      nombreCompleto.textContent = (this.user.nombre || '') + ' ' + (this.user.apellido || '');
    }
    if (usuarioActual) {
      usuarioActual.textContent = this.user.usuario || '';
    }
    if (direccionActual) {
      direccionActual.textContent = direccion || 'no registrado aún';
    }

    if (estatusActual) {
      var resultado = this.user.vocacionalResultado;
      if (resultado && resultado.categoriaPrincipal) {
        estatusActual.textContent = 'Tu área vocacional: ' + this.api.CATEGORY_LABELS[resultado.categoriaPrincipal];
      } else {
        estatusActual.textContent = 'Aún no has completado la encuesta vocacional.';
      }
    }

    if (escuelasSeleccionadas) {
      escuelasSeleccionadas.innerHTML = '';
    }
  }

  mostrarMapa() {
    var mapFrame = this.get('mapFrame');
    var mapCaption = this.get('mapCaption');
    var mapNote = this.get('mapNote');
    if (!mapFrame) return;

    var direccion = this.api.getDireccionCompleta(this.user);
    var resultado = this.user.vocacionalResultado;
    var tieneResultado = resultado && resultado.categoriaPrincipal;
    var query = '';
    var nota = '';

    if (tieneResultado) {
      var principal = this.api.CAREERS[resultado.categoriaPrincipal];
      if (direccion) {
        query = principal.escuela + ' cerca de ' + direccion;
        if (mapCaption) {
          mapCaption.textContent = 'Escuelas cerca de ti según tu encuesta:';
        }
        nota = 'Mostrando "' + principal.escuela + '" cerca de "' + direccion + '".';
      } else {
        query = principal.escuela;
        if (mapCaption) {
          mapCaption.textContent = 'Escuelas cerca de ti según tu encuesta:';
        }
        nota = 'Aún no registras tu dirección. Agrégala en tu perfil para ver escuelas más cercanas a ti.';
      }
    } else if (direccion) {
      query = direccion;
      if (mapCaption) {
        mapCaption.textContent = 'Tu ubicación:';
      }
      nota = 'Completa la encuesta vocacional para ver aquí las escuelas recomendadas para ti.';
    } else {
      query = 'Ciudad de México';
      if (mapCaption) {
        mapCaption.textContent = 'Mapa de Google:';
      }
      nota = 'Agrega tu dirección en tu perfil y completa la encuesta para ver un mapa personalizado.';
    }

    mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
    if (mapNote) {
      mapNote.textContent = nota;
    }
  }

  iniciar() {
    if (!this.user) {
      this.redirect('secion.html');
      return;
    }
    this.mostrarDatosDelUsuario();
    this.mostrarMapa();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var api = window.UNICOMPASS;
  if (!api) return;
  var page = new PaginaMenu(api);
  page.iniciar();
});