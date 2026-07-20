// Llena el <select> de Estado y engancha el cambio en cascada hacia Municipio.
// Además deja preseleccionado el estado/municipio que ya tenía el usuario.
function llenarEstadosYMunicipiosParaEditar(estadoSelect, municipioSelect, estadoActual, municipioActual) {
  const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS;

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
    catalogo[estado].forEach((municipio) => {
      const opcion = document.createElement('option');
      opcion.value = municipio;
      opcion.textContent = municipio;
      if (municipio === municipioSeleccionado) opcion.selected = true;
      municipioSelect.appendChild(opcion);
    });
  }

  estadoSelect.addEventListener('change', () => llenarMunicipios(estadoSelect.value, ''));

  if (estadoActual) {
    estadoSelect.value = estadoActual;
    llenarMunicipios(estadoActual, municipioActual);
  }
}

function mostrarDatosDelPerfil(usuario) {
  const api = window.UNICOMPASS;
  document.getElementById('nombreCompleto').textContent = `${usuario.nombre} ${usuario.apellido}`;
  document.getElementById('usuarioActual').textContent = usuario.usuario;
  document.getElementById('emailActual').textContent = usuario.email;
  document.getElementById('estadoActual').textContent = usuario.estado;
  document.getElementById('municipioActual').textContent = usuario.municipio;
}

function llenarFormularioDeEdicion(usuario) {
  document.getElementById('editNombre').value = usuario.nombre;
  document.getElementById('editApellido').value = usuario.apellido;
  document.getElementById('editUsuario').value = usuario.usuario;
  document.getElementById('editEmail').value = usuario.email;

  llenarEstadosYMunicipiosParaEditar(
    document.getElementById('editEstado'),
    document.getElementById('editMunicipio'),
    usuario.estado,
    usuario.municipio
  );
}

async function guardarCambiosDePerfil(usuarioOriginal) {
  const api = window.UNICOMPASS;
  const mensaje = document.getElementById('editMensaje');

  const nuevosDatos = {
    nombre: document.getElementById('editNombre').value.trim(),
    apellido: document.getElementById('editApellido').value.trim(),
    email: document.getElementById('editEmail').value.trim(),
    estado: document.getElementById('editEstado').value,
    municipio: document.getElementById('editMunicipio').value
  };

  if (!nuevosDatos.nombre || !nuevosDatos.apellido) {
    mensaje.textContent = 'Nombre y apellido son requeridos.';
    return;
  }

  mensaje.textContent = 'Guardando...';
  const guardado = await api.updateUser(usuarioOriginal, nuevosDatos);

  if (guardado) {
    mensaje.textContent = 'Cambios guardados correctamente.';
    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 1500);
  } else {
    mensaje.textContent = 'Error al guardar cambios.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  const usuario = api.getCurrentUser();

  if (!usuario) {
    window.location.href = 'secion.html';
    return;
  }

  // Página "usuario.html" (solo ver el perfil)
  if (document.getElementById('nombreCompleto')) {
    mostrarDatosDelPerfil(usuario);
  }

  // Página "editar_perfil.html" (editar el perfil)
  const guardarButton = document.getElementById('guardarButton');
  if (guardarButton) {
    llenarFormularioDeEdicion(usuario);
    guardarButton.addEventListener('click', () => guardarCambiosDePerfil(usuario.usuario));
  }
});
