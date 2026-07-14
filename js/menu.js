document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const nombreCompleto = document.getElementById('nombreCompleto');
  const usuarioActual = document.getElementById('usuarioActual');
  const estatusActual = document.getElementById('estatusActual');
  const lugarViveActual = document.getElementById('lugarViveActual');
  const escuelasSeleccionadas = document.getElementById('escuelasSeleccionadas') || document.getElementById('seleccionadasList');
  const mapFrame = document.getElementById('mapFrame');
  const mapCaption = document.getElementById('mapCaption');
  const mapNote = document.getElementById('mapNote');
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
  if (lugarViveActual) lugarViveActual.textContent = user.lugarVive || 'no registrado aún';

  if (escuelasSeleccionadas) {
    escuelasSeleccionadas.innerHTML = '';
    if (user.escuela) {
      const li = document.createElement('li');
      li.textContent = user.escuela;
      escuelasSeleccionadas.appendChild(li);
    }
  }

  // --- Mapa: lugar donde vive el usuario + escuelas sugeridas por la encuesta vocacional ---
  if (mapFrame) {
    const lugarVive = (user.lugarVive || '').trim();
    const resultado = user.vocacionalResultado;
    const tieneResultado = resultado && resultado.categoriaPrincipal && api.CAREERS;

    let query = '';
    let nota = '';

    if (tieneResultado) {
      const primary = api.CAREERS[resultado.categoriaPrincipal];
      query = lugarVive ? `${primary.escuela} cerca de ${lugarVive}` : primary.escuela;
      if (mapCaption) mapCaption.textContent = 'Escuelas cerca de ti según tu encuesta:';
      nota = lugarVive
        ? `Mostrando "${primary.escuela}" cerca de "${lugarVive}".`
        : `Aún no registras dónde vives. Agrégalo en tu perfil para ver escuelas más cercanas a ti.`;
    } else if (lugarVive) {
      query = lugarVive;
      if (mapCaption) mapCaption.textContent = 'Tu ubicación:';
      nota = 'Completa la encuesta vocacional para ver aquí las escuelas recomendadas para ti.';
    } else {
      query = 'Ciudad de México';
      if (mapCaption) mapCaption.textContent = 'Mapa de Google:';
      nota = 'Agrega dónde vives en tu perfil y completa la encuesta para ver un mapa personalizado.';
    }

    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    if (mapNote) mapNote.textContent = nota;
  }
});