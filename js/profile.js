class ProfileBaseController {
  constructor(api) {
    this.api = api;
  }

  redirectToLogin() {
    window.location.href = 'secion.html';
  }
}

// Llena el <select> de Estado y engancha el cambio en cascada hacia Municipio.
// Si se pasa preselectEstado/preselectMunicipio, los deja seleccionados (para el formulario de edición).
function setupEstadoMunicipioEdit(estadoSelect, municipioSelect, preselectEstado, preselectMunicipio) {
  if (!estadoSelect || !municipioSelect) return;
  const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};

  Object.keys(catalogo).forEach((estado) => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    estadoSelect.appendChild(option);
  });

  const renderMunicipios = (estado, municipioSeleccionado) => {
    const municipios = catalogo[estado] || [];
    municipioSelect.innerHTML = '';

    if (!estado) {
      municipioSelect.disabled = true;
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Primero selecciona un estado';
      municipioSelect.appendChild(placeholder);
      return;
    }

    municipioSelect.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona un municipio';
    municipioSelect.appendChild(placeholder);

    municipios.forEach((municipio) => {
      const option = document.createElement('option');
      option.value = municipio;
      option.textContent = municipio;
      if (municipio === municipioSeleccionado) option.selected = true;
      municipioSelect.appendChild(option);
    });
  };

  estadoSelect.addEventListener('change', () => renderMunicipios(estadoSelect.value, ''));

  if (preselectEstado) {
    estadoSelect.value = preselectEstado;
    renderMunicipios(preselectEstado, preselectMunicipio);
  }
}

class ProfileController extends ProfileBaseController {
  constructor(api, elements) {
    super(api);
    this.elements = elements;
    this.user = this.api.getCurrentUser();
    this.init();
  }

  init() {
    if (this.elements.nombreCompleto || this.elements.usuarioActual || this.elements.emailActual || this.elements.estadoActual) {
      if (!this.user) {
        this.redirectToLogin();
        return;
      }

      this.renderProfile();
    }

    if (this.elements.guardarButton) {
      if (!this.user) {
        this.redirectToLogin();
        return;
      }

      this.fillForm();
      this.bindSave();
    }
  }

  renderProfile() {
    const { nombreCompleto, usuarioActual, emailActual, estadoActual, municipioActual } = this.elements;

    if (nombreCompleto) nombreCompleto.textContent = `${this.user.nombre || ''} ${this.user.apellido || ''}`.trim();
    if (usuarioActual) usuarioActual.textContent = this.user.usuario || '';
    if (emailActual) emailActual.textContent = this.user.email || '';
    if (estadoActual) estadoActual.textContent = this.user.estado || '';
    if (municipioActual) municipioActual.textContent = this.user.municipio || '';
  }

  fillForm() {
    const { editNombre, editApellido, editUsuario, editEmail, editEstado, editMunicipio } = this.elements;

    if (editNombre) editNombre.value = this.user.nombre || '';
    if (editApellido) editApellido.value = this.user.apellido || '';
    if (editUsuario) editUsuario.value = this.user.usuario || '';
    if (editEmail) editEmail.value = this.user.email || '';

    setupEstadoMunicipioEdit(editEstado, editMunicipio, this.user.estado, this.user.municipio);
  }

  bindSave() {
    this.elements.guardarButton.addEventListener('click', () => {
      const nombre = this.elements.editNombre ? this.elements.editNombre.value.trim() : '';
      const apellido = this.elements.editApellido ? this.elements.editApellido.value.trim() : '';
      const email = this.elements.editEmail ? this.elements.editEmail.value.trim() : '';
      const estado = this.elements.editEstado ? this.elements.editEstado.value : '';
      const municipio = this.elements.editMunicipio ? this.elements.editMunicipio.value : '';

      if (!nombre || !apellido) {
        if (this.elements.editMensaje) this.elements.editMensaje.textContent = 'Nombre y apellido son requeridos.';
        return;
      }

      if (this.api.updateUser(this.user.usuario, { nombre, apellido, email, estado, municipio })) {
        if (this.elements.editMensaje) this.elements.editMensaje.textContent = 'Cambios guardados correctamente.';
        setTimeout(() => {
          window.location.href = 'menu.html';
        }, 1500);
      } else if (this.elements.editMensaje) {
        this.elements.editMensaje.textContent = 'Error al guardar cambios.';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const elements = {
    nombreCompleto: document.getElementById('nombreCompleto'),
    usuarioActual: document.getElementById('usuarioActual'),
    emailActual: document.getElementById('emailActual'),
    estadoActual: document.getElementById('estadoActual'),
    municipioActual: document.getElementById('municipioActual'),
    editNombre: document.getElementById('editNombre'),
    editApellido: document.getElementById('editApellido'),
    editUsuario: document.getElementById('editUsuario'),
    editEmail: document.getElementById('editEmail'),
    editEstado: document.getElementById('editEstado'),
    editMunicipio: document.getElementById('editMunicipio'),
    guardarButton: document.getElementById('guardarButton'),
    editMensaje: document.getElementById('editMensaje')
  };

  new ProfileController(api, elements);
});