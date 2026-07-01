document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const nombreCompleto = document.getElementById('nombreCompleto');
  const usuarioActual = document.getElementById('usuarioActual');
  const estatusActual = document.getElementById('estatusActual');
  const escuelaActual = document.getElementById('escuelaActual');
  const semestreActual = document.getElementById('semestreActual');
  const lugarActual = document.getElementById('lugarActual');
  const promedioActual = document.getElementById('promedioActual');
  const emailActual = document.getElementById('emailActual');
  const editNombre = document.getElementById('editNombre');
  const editApellido = document.getElementById('editApellido');
  const editUsuario = document.getElementById('editUsuario');
  const editEmail = document.getElementById('editEmail');
  const editEscuela = document.getElementById('editEscuela');
  const editNivelEscuela = document.getElementById('editNivelEscuela');
  const editSemestre = document.getElementById('editSemestre');
  const editLugar = document.getElementById('editLugar');
  const editPromedio = document.getElementById('editPromedio');
  const guardarButton = document.getElementById('guardarButton');
  const editMensaje = document.getElementById('editMensaje');

  const user = api.getCurrentUser();

  if (nombreCompleto || usuarioActual || estatusActual || escuelaActual || semestreActual || lugarActual || promedioActual || emailActual) {
    if (!user) {
      window.location.href = 'secion.html';
      return;
    }

    if (nombreCompleto) nombreCompleto.textContent = `${user.nombre || ''} ${user.apellido || ''}`.trim();
    if (usuarioActual) usuarioActual.textContent = user.usuario || '';
    if (emailActual) emailActual.textContent = user.email || '';
    if (escuelaActual) escuelaActual.textContent = user.escuela || '';
    if (semestreActual) semestreActual.textContent = user.semestre || '';
    if (lugarActual) lugarActual.textContent = user.lugar || '';
    if (promedioActual) promedioActual.textContent = user.promedio || '';
    if (estatusActual) {
      estatusActual.textContent = `Escuela: ${user.escuela || ''} · Semestre: ${user.semestre || ''} · Promedio: ${user.promedio || ''}`;
    }
  }

  if (guardarButton) {
    if (!user) {
      window.location.href = 'secion.html';
      return;
    }

    if (editNombre) editNombre.value = user.nombre || '';
    if (editApellido) editApellido.value = user.apellido || '';
    if (editUsuario) editUsuario.value = user.usuario || '';
    if (editEmail) editEmail.value = user.email || '';
    if (editEscuela) editEscuela.value = user.escuela || '';
    if (editNivelEscuela) editNivelEscuela.value = user.nivelEscuela || '';
    if (editSemestre) editSemestre.value = user.semestre || '';
    if (editLugar) editLugar.value = user.lugar || '';
    if (editPromedio) editPromedio.value = user.promedio || '';

    guardarButton.addEventListener('click', () => {
      const nombre = editNombre ? editNombre.value.trim() : '';
      const apellido = editApellido ? editApellido.value.trim() : '';
      const email = editEmail ? editEmail.value.trim() : '';
      const escuela = editEscuela ? editEscuela.value.trim() : '';
      const nivelEscuela = editNivelEscuela ? editNivelEscuela.value : '';
      const semestre = editSemestre ? editSemestre.value.trim() : '';
      const lugar = editLugar ? editLugar.value.trim() : '';
      const promedio = editPromedio ? editPromedio.value.trim() : '';

      if (!nombre || !apellido) {
        if (editMensaje) editMensaje.textContent = 'Nombre y apellido son requeridos.';
        return;
      }

      if (api.updateUser(user.usuario, { nombre, apellido, email, escuela, semestre, lugar, promedio, nivelEscuela })) {
        if (editMensaje) editMensaje.textContent = 'Cambios guardados correctamente.';
        setTimeout(() => {
          window.location.href = 'menu.html';
        }, 1500);
      } else if (editMensaje) {
        editMensaje.textContent = 'Error al guardar cambios.';
      }
    });
  }
});
