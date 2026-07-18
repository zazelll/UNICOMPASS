document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const nombreCompleto = document.getElementById('nombreCompleto');
  const usuarioActual = document.getElementById('usuarioActual');
  const estatusActual = document.getElementById('estatusActual');
  const direccionActual = document.getElementById('direccionActual');
  const escuelasSeleccionadas = document.getElementById('escuelasSeleccionadas') || document.getElementById('seleccionadasList');
  const mapFrame = document.getElementById('mapFrame');
  const mapCaption = document.getElementById('mapCaption');
  const mapNote = document.getElementById('mapNote');

  const user = api.getCurrentUser();
  if (!user) {
    window.location.href = 'secion.html';
    return;
  }

  const direccion = api.getDireccionCompleta ? api.getDireccionCompleta(user) : '';

  if (nombreCompleto) nombreCompleto.textContent = `${user.nombre || ''} ${user.apellido || ''}`.trim();
  if (usuarioActual) usuarioActual.textContent = user.usuario || '';
  if (direccionActual) direccionActual.textContent = direccion || 'no registrado aún';
  if (estatusActual) {
    const resultado = user.vocacionalResultado;
    estatusActual.textContent =
      resultado && resultado.categoriaPrincipal && api.CATEGORY_LABELS
        ? `Tu área vocacional: ${api.CATEGORY_LABELS[resultado.categoriaPrincipal]}`
        : 'Aún no has completado la encuesta vocacional.';
  }

  // Esta lista queda lista para una futura función de "escuelas favoritas".
  if (escuelasSeleccionadas) {
    escuelasSeleccionadas.innerHTML = '';
  }

  // --- Mapa: dirección real del usuario + escuelas sugeridas por la encuesta vocacional ---
  if (mapFrame) {
    const resultado = user.vocacionalResultado;
    const tieneResultado = resultado && resultado.categoriaPrincipal && api.CAREERS;

    let query = '';
    let nota = '';

    if (tieneResultado) {
      const primary = api.CAREERS[resultado.categoriaPrincipal];
      query = direccion ? `${primary.escuela} cerca de ${direccion}` : primary.escuela;
      if (mapCaption) mapCaption.textContent = 'Escuelas cerca de ti según tu encuesta:';
      nota = direccion
        ? `Mostrando "${primary.escuela}" cerca de "${direccion}".`
        : 'Aún no registras tu dirección. Agrégala en tu perfil para ver escuelas más cercanas a ti.';
    } else if (direccion) {
      query = direccion;
      if (mapCaption) mapCaption.textContent = 'Tu ubicación:';
      nota = 'Completa la encuesta vocacional para ver aquí las escuelas recomendadas para ti.';
    } else {
      query = 'Ciudad de México';
      if (mapCaption) mapCaption.textContent = 'Mapa de Google:';
      nota = 'Agrega tu dirección en tu perfil y completa la encuesta para ver un mapa personalizado.';
    }

    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    if (mapNote) mapNote.textContent = nota;
  }
});