document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const nombreCompleto = document.getElementById('nombreCompleto');
  const usuarioActual = document.getElementById('usuarioActual');
  const estatusActual = document.getElementById('estatusActual');
  const escuelasSeleccionadas = document.getElementById('escuelasSeleccionadas') || document.getElementById('seleccionadasList');
  const mapFrame = document.getElementById('mapFrame');
  const registerNivelEscuela = document.getElementById('registerNivelEscuela');

  const user = api.getCurrentUser();
  if (!user) {
    window.location.href = 'secion.html';
    return;
  }

  if (nombreCompleto) nombreCompleto.textContent = `${user.nombre || ''} ${user.apellido || ''}`.trim();
  if (usuarioActual) usuarioActual.textContent = user.usuario || '';
  if (estatusActual) {
    estatusActual.textContent = `Escuela: ${user.escuela || ''} · Semestre: ${user.semestre || ''} · Promedio: ${user.promedio || ''}`;
  }
  if (registerNivelEscuela) registerNivelEscuela.textContent = user.nivelEscuela || '';

  if (escuelasSeleccionadas) {
    escuelasSeleccionadas.innerHTML = '';
    if (user.escuela) {
      const li = document.createElement('li');
      li.textContent = user.escuela;
      escuelasSeleccionadas.appendChild(li);
    }
  }

  if (mapFrame) {
    const query = user.escuela ? `${user.escuela} ${user.lugar || ''}`.trim() : '';
    if (query) {
      mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=15`;
    }
  }
});
