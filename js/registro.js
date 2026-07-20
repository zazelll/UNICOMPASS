// Llena el <select> de Estado y engancha el cambio en cascada hacia Municipio.
function llenarEstadosYMunicipios(estadoSelect, municipioSelect) {
  const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS;

  for (const estado in catalogo) {
    const opcion = document.createElement('option');
    opcion.value = estado;
    opcion.textContent = estado;
    estadoSelect.appendChild(opcion);
  }

  estadoSelect.addEventListener('change', () => {
    municipioSelect.innerHTML = '';

    if (!estadoSelect.value) {
      municipioSelect.disabled = true;
      return;
    }

    municipioSelect.disabled = false;
    catalogo[estadoSelect.value].forEach((municipio) => {
      const opcion = document.createElement('option');
      opcion.value = municipio;
      opcion.textContent = municipio;
      municipioSelect.appendChild(opcion);
    });
  });
}

function leerFormularioDeRegistro() {
  return {
    nombre: document.getElementById('registerNombre').value.trim(),
    apellido: document.getElementById('registerApellido').value.trim(),
    usuario: document.getElementById('registerUsuario').value.trim(),
    contraseña: document.getElementById('registerPassword').value,
    email: document.getElementById('registerEmail').value.trim(),
    estado: document.getElementById('registerEstado').value,
    municipio: document.getElementById('registerMunicipio').value
  };
}

function datosDeRegistroSonValidos(datos) {
  if (!datos.nombre || !datos.apellido || !datos.usuario || !datos.contraseña || !datos.email) {
    return 'Completa todos los campos.';
  }
  if (!datos.estado || !datos.municipio) {
    return 'Selecciona tu estado y municipio.';
  }
  if (!/^\d{8}$/.test(datos.contraseña)) {
    return 'La contraseña debe tener exactamente 8 dígitos numéricos.';
  }
  return null;
}

async function registrarUsuarioClick() {
  const api = window.UNICOMPASS;
  const mensaje = document.getElementById('registerMensaje');
  const datos = leerFormularioDeRegistro();

  const error = datosDeRegistroSonValidos(datos);
  if (error) {
    mensaje.textContent = error;
    return;
  }

  mensaje.textContent = 'Registrando...';

  const respuesta = await api.registerUser(
    datos.nombre,
    datos.apellido,
    datos.usuario,
    datos.contraseña,
    datos.email,
    datos.estado,
    datos.municipio
  );

  if (respuesta.ok) {
    mensaje.textContent = 'Registro guardado. Inicia sesión.';
    setTimeout(() => {
      window.location.href = 'secion.html';
    }, 1200);
  } else {
    mensaje.textContent = respuesta.error || 'No se pudo guardar el registro.';
  }
}

function mostrarModalPrivacidad() {
  const modal = document.getElementById('privacyModal');
  modal.classList.add('is-open');
  document.getElementById('privacyCheckbox').checked = false;
}

function ocultarModalPrivacidad() {
  document.getElementById('privacyModal').classList.remove('is-open');
}

document.addEventListener('DOMContentLoaded', () => {
  llenarEstadosYMunicipios(
    document.getElementById('registerEstado'),
    document.getElementById('registerMunicipio')
  );

  document.getElementById('registerButton').addEventListener('click', mostrarModalPrivacidad);

  document.getElementById('acceptPrivacyButton').addEventListener('click', () => {
    if (!document.getElementById('privacyCheckbox').checked) {
      document.getElementById('registerMensaje').textContent = 'Debes aceptar los términos de privacidad.';
      return;
    }
    ocultarModalPrivacidad();
    registrarUsuarioClick();
  });
});
