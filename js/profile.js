class ProfileBaseController {
  constructor(api) {
    this.api = api;
  }

  redirectToLogin() {
    window.location.href = 'secion.html';
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
    if (this.elements.nombreCompleto || this.elements.usuarioActual || this.elements.estatusActual || this.elements.escuelaActual || this.elements.semestreActual || this.elements.lugarActual || this.elements.promedioActual || this.elements.emailActual) {
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
    const { nombreCompleto, usuarioActual, estatusActual, escuelaActual, semestreActual, lugarActual, promedioActual, emailActual } = this.elements;

    if (nombreCompleto) nombreCompleto.textContent = `${this.user.nombre || ''} ${this.user.apellido || ''}`.trim();
    if (usuarioActual) usuarioActual.textContent = this.user.usuario || '';
    if (emailActual) emailActual.textContent = this.user.email || '';
    if (escuelaActual) escuelaActual.textContent = this.user.escuela || '';
    if (semestreActual) semestreActual.textContent = this.user.semestre || '';
    if (lugarActual) lugarActual.textContent = this.user.lugar || '';
    if (promedioActual) promedioActual.textContent = this.user.promedio || '';
    if (estatusActual) {
      estatusActual.textContent = `Escuela: ${this.user.escuela || ''} · Semestre: ${this.user.semestre || ''} · Promedio: ${this.user.promedio || ''}`;
    }
  }

  fillForm() {
    const { editNombre, editApellido, editUsuario, editEmail, editEscuela, editNivelEscuela, editSemestre, editLugar, editPromedio } = this.elements;

    if (editNombre) editNombre.value = this.user.nombre || '';
    if (editApellido) editApellido.value = this.user.apellido || '';
    if (editUsuario) editUsuario.value = this.user.usuario || '';
    if (editEmail) editEmail.value = this.user.email || '';
    if (editEscuela) editEscuela.value = this.user.escuela || '';
    if (editNivelEscuela) editNivelEscuela.value = this.user.nivelEscuela || '';
    if (editSemestre) editSemestre.value = this.user.semestre || '';
    if (editLugar) editLugar.value = this.user.lugar || '';
    if (editPromedio) editPromedio.value = this.user.promedio || '';
  }

  bindSave() {
    this.elements.guardarButton.addEventListener('click', () => {
      const nombre = this.elements.editNombre ? this.elements.editNombre.value.trim() : '';
      const apellido = this.elements.editApellido ? this.elements.editApellido.value.trim() : '';
      const email = this.elements.editEmail ? this.elements.editEmail.value.trim() : '';
      const escuela = this.elements.editEscuela ? this.elements.editEscuela.value.trim() : '';
      const nivelEscuela = this.elements.editNivelEscuela ? this.elements.editNivelEscuela.value : '';
      const semestre = this.elements.editSemestre ? this.elements.editSemestre.value.trim() : '';
      const lugar = this.elements.editLugar ? this.elements.editLugar.value.trim() : '';
      const promedio = this.elements.editPromedio ? this.elements.editPromedio.value.trim() : '';

      if (!nombre || !apellido) {
        if (this.elements.editMensaje) this.elements.editMensaje.textContent = 'Nombre y apellido son requeridos.';
        return;
      }

      if (this.api.updateUser(this.user.usuario, { nombre, apellido, email, escuela, semestre, lugar, promedio, nivelEscuela })) {
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
    estatusActual: document.getElementById('estatusActual'),
    escuelaActual: document.getElementById('escuelaActual'),
    semestreActual: document.getElementById('semestreActual'),
    lugarActual: document.getElementById('lugarActual'),
    promedioActual: document.getElementById('promedioActual'),
    emailActual: document.getElementById('emailActual'),
    editNombre: document.getElementById('editNombre'),
    editApellido: document.getElementById('editApellido'),
    editUsuario: document.getElementById('editUsuario'),
    editEmail: document.getElementById('editEmail'),
    editEscuela: document.getElementById('editEscuela'),
    editNivelEscuela: document.getElementById('editNivelEscuela'),
    editSemestre: document.getElementById('editSemestre'),
    editLugar: document.getElementById('editLugar'),
    editPromedio: document.getElementById('editPromedio'),
    guardarButton: document.getElementById('guardarButton'),
    editMensaje: document.getElementById('editMensaje')
  };

  new ProfileController(api, elements);
});
