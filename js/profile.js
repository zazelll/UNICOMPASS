function llenarEstadosYMunicipiosParaEditar(estadoSelect, municipioSelect, estadoActual, municipioActual) {
  const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};

  for (const estado in catalogo) {
    const opcion = document.createElement('option');
    opcion.value = estado;
    opcion.textContent = estado;
    estadoSelect.appendChild(opcion);
  }

  function llenarMunicipios(estado, municipioSeleccionado) {
    municipioSelect.innerHTML = '';
    if (!estado) {
      municipioSelect.disabled = true;
      return;
    }
    municipioSelect.disabled = false;
    const lista = catalogo[estado] || [];
    for (let i = 0; i < lista.length; i += 1) {
      const municipio = lista[i];
      const opcion = document.createElement('option');
      opcion.value = municipio;
      opcion.textContent = municipio;
      if (municipio === municipioSeleccionado) {
        opcion.selected = true;
      }
      municipioSelect.appendChild(opcion);
    }
  }

  estadoSelect.addEventListener('change', function () {
    llenarMunicipios(estadoSelect.value, '');
  });

  if (estadoActual) {
    estadoSelect.value = estadoActual;
    llenarMunicipios(estadoActual, municipioActual);
  }
}

class PerfilPage extends PageBase {
  constructor(api) {
    super(api);
    this.user = api.getCurrentUser();
  }

  init() {
    if (!this.user) {
      this.redirect('secion.html');
      return;
    }

    if (this.get('nombreCompleto')) {
      this.mostrarDatosDelPerfil();
    }

    const guardarButton = this.get('guardarButton');
    if (guardarButton) {
      this.llenarFormularioDeEdicion();
      guardarButton.addEventListener('click', this.guardarCambiosDePerfil.bind(this));
    }
  }

  mostrarDatosDelPerfil() {
    this.setText('nombreCompleto', this.user.nombre + ' ' + this.user.apellido);
    this.setText('usuarioActual', this.user.usuario);
    this.setText('emailActual', this.user.email);
    this.setText('estadoActual', this.user.estado);
    this.setText('municipioActual', this.user.municipio);
  }

  llenarFormularioDeEdicion() {
    const editNombre = this.get('editNombre');
    const editApellido = this.get('editApellido');
    const editUsuario = this.get('editUsuario');
    const editEmail = this.get('editEmail');
    const editEstado = this.get('editEstado');
    const editMunicipio = this.get('editMunicipio');

    if (editNombre) editNombre.value = this.user.nombre || '';
    if (editApellido) editApellido.value = this.user.apellido || '';
    if (editUsuario) editUsuario.value = this.user.usuario || '';
    if (editEmail) editEmail.value = this.user.email || '';

    if (editEstado && editMunicipio) {
      llenarEstadosYMunicipiosParaEditar(
        editEstado,
        editMunicipio,
        this.user.estado,
        this.user.municipio
      );
    }
  }

  async guardarCambiosDePerfil() {
    const mensaje = this.get('editMensaje');
    const nombre = this.get('editNombre') ? this.get('editNombre').value.trim() : '';
    const apellido = this.get('editApellido') ? this.get('editApellido').value.trim() : '';
    const email = this.get('editEmail') ? this.get('editEmail').value.trim() : '';
    const estado = this.get('editEstado') ? this.get('editEstado').value : '';
    const municipio = this.get('editMunicipio') ? this.get('editMunicipio').value : '';

    if (!nombre || !apellido) {
      if (mensaje) {
        mensaje.textContent = 'Nombre y apellido son requeridos.';
      }
      return;
    }

    if (mensaje) {
      mensaje.textContent = 'Guardando...';
    }

    const guardado = await this.api.updateUser(this.user.usuario, {
      nombre: nombre,
      apellido: apellido,
      email: email,
      estado: estado,
      municipio: municipio
    });

    if (mensaje) {
      mensaje.textContent = guardado
        ? 'Cambios guardados correctamente.'
        : 'Error al guardar cambios.';
    }

    if (guardado) {
      setTimeout(function () {
        window.location.href = 'menu.html';
      }, 1500);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const api = window.UNICOMPASS;
  if (!api) return;
  const page = new PerfilPage(api);
  page.init();
});
