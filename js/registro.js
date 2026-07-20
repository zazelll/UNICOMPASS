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

<<<<<<< Updated upstream
// Pega aquí la URL que te dio Google al "Implementar" el Apps Script como Aplicación Web.
// Ejemplo: 'https://script.google.com/macros/s/AKfycb.../exec'
const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxgq_DEN3ODP7ttexPo1tC_5nKYclCLGNbVfVjLce3pwIqIXtjvsi1SSgvyQ6YrROnz_w/exec';

function sendToGoogleSheet(data) {
  if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL === 'PEGA_AQUI_TU_URL_DE_APPS_SCRIPT') {
    console.warn('GOOGLE_SHEET_WEBAPP_URL no está configurada todavía; no se envió copia a Sheets.');
    return;
  }

  // mode: 'no-cors' evita el bloqueo de CORS del navegador; a cambio no podemos
  // leer la respuesta, pero para solo "loguear" el registro nos basta.
  fetch(GOOGLE_SHEET_WEBAPP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data)
  }).catch((error) => {
    console.warn('No se pudo enviar la copia a Google Sheets:', error);
  });
}

// Llena el <select> de Estado y engancha el cambio en cascada hacia Municipio.
function setupEstadoMunicipio(estadoSelect, municipioSelect) {
  if (!estadoSelect || !municipioSelect) return;
  const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};

  Object.keys(catalogo).forEach((estado) => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    estadoSelect.appendChild(option);
  });

  estadoSelect.addEventListener('change', () => {
    const municipios = catalogo[estadoSelect.value] || [];
    municipioSelect.innerHTML = '';

    if (!estadoSelect.value) {
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
      municipioSelect.appendChild(option);
    });
  });
}

class RegistrationController extends BaseFormController {
  constructor(api, elements) {
    super(api);
    this.elements = elements;
    this.init();
  }

  init() {
    if (!this.elements.registerButton) return;

    setupEstadoMunicipio(this.elements.registerEstado, this.elements.registerMunicipio);

    this.elements.registerButton.addEventListener('click', () => {
      this.showPrivacyModal();
    });

    if (this.elements.acceptPrivacyButton) {
      this.elements.acceptPrivacyButton.addEventListener('click', () => {
        if (this.elements.privacyCheckbox && !this.elements.privacyCheckbox.checked) {
          this.setMessage(this.elements.registerMensaje, 'Debes aceptar los términos de privacidad.', true);
          return;
        }
        this.hidePrivacyModal();
        this.processRegistration();
      });
    }

    if (this.elements.privacyModal) {
      this.elements.privacyModal.addEventListener('click', (event) => {
        if (event.target === this.elements.privacyModal) {
          this.hidePrivacyModal();
        }
      });
    }
  }

  showPrivacyModal() {
    if (this.elements.privacyModal) {
      this.elements.privacyModal.classList.add('is-open');
      this.elements.privacyModal.setAttribute('aria-hidden', 'false');
      if (this.elements.privacyCheckbox) this.elements.privacyCheckbox.checked = false;
    }
  }

  hidePrivacyModal() {
    if (this.elements.privacyModal) {
      this.elements.privacyModal.classList.remove('is-open');
      this.elements.privacyModal.setAttribute('aria-hidden', 'true');
    }
  }

  collectData() {
    return {
      nombre: this.elements.registerNombre ? this.elements.registerNombre.value.trim() : '',
      apellido: this.elements.registerApellido ? this.elements.registerApellido.value.trim() : '',
      usuario: this.elements.registerUsuario ? this.elements.registerUsuario.value.trim() : '',
      contraseña: this.elements.registerPassword ? this.elements.registerPassword.value : '',
      email: this.elements.registerEmail ? this.elements.registerEmail.value.trim() : '',
      estado: this.elements.registerEstado ? this.elements.registerEstado.value : '',
      municipio: this.elements.registerMunicipio ? this.elements.registerMunicipio.value : ''
    };
  }

  focusField(element) {
    if (!element) return;
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  clearFieldErrors() {
    document.querySelectorAll('.field-error').forEach((el) => el.remove());
  }

  showFieldError(element, message) {
    if (!element) return;
    this.clearFieldErrors();
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    element.parentElement.appendChild(errorElement);
  }

  processRegistration() {
    const data = this.collectData();

    const requiredFields = [
      { key: 'nombre', element: this.elements.registerNombre, label: 'nombre' },
      { key: 'apellido', element: this.elements.registerApellido, label: 'apellido' },
      { key: 'usuario', element: this.elements.registerUsuario, label: 'usuario' },
      { key: 'contraseña', element: this.elements.registerPassword, label: 'contraseña' },
      { key: 'email', element: this.elements.registerEmail, label: 'correo electrónico' },
      { key: 'estado', element: this.elements.registerEstado, label: 'estado' },
      { key: 'municipio', element: this.elements.registerMunicipio, label: 'municipio' }
    ];

    this.clearFieldErrors();

    const missingField = requiredFields.find(({ key }) => !data[key] || (typeof data[key] === 'string' && data[key].trim() === ''));

    if (missingField) {
      this.setMessage(this.elements.registerMensaje, `Completa el campo de ${missingField.label}.`, true);
      this.showFieldError(missingField.element, 'Falta completar este campo');
      this.focusField(missingField.element);
      return;
    }

    if (!/^\d{8}$/.test(data.contraseña)) {
      this.setMessage(this.elements.registerMensaje, 'La contraseña debe tener exactamente 8 dígitos numéricos.', true);
      this.showFieldError(this.elements.registerPassword, 'Falta completar este campo');
      this.focusField(this.elements.registerPassword);
      return;
    }

    if (this.api.findUser(data.usuario)) {
      this.setMessage(this.elements.registerMensaje, 'Ese usuario ya existe.', true);
      return;
    }

    const ok = this.api.registerUser(
      data.nombre,
      data.apellido,
      data.usuario,
      data.contraseña,
      data.email,
      data.estado,
      data.municipio
    );

    if (ok) {
      const { contraseña, ...datosSinContrasena } = data;
      sendToGoogleSheet(datosSinContrasena);
      this.setMessage(this.elements.registerMensaje, 'Registro guardado. Inicia sesión.');
      setTimeout(() => {
        window.location.href = 'secion.html';
      }, 1200);
    } else {
      this.setMessage(this.elements.registerMensaje, 'No se pudo guardar el registro. Intenta de nuevo.', true);
    }
  }
=======
function mostrarModalPrivacidad() {
  const modal = document.getElementById('privacyModal');
  modal.classList.add('is-open');
  document.getElementById('privacyCheckbox').checked = false;
}

function ocultarModalPrivacidad() {
  document.getElementById('privacyModal').classList.remove('is-open');
>>>>>>> Stashed changes
}

document.addEventListener('DOMContentLoaded', () => {
  llenarEstadosYMunicipios(
    document.getElementById('registerEstado'),
    document.getElementById('registerMunicipio')
  );

<<<<<<< Updated upstream
  const elements = {
    registerNombre: document.getElementById('registerNombre'),
    registerApellido: document.getElementById('registerApellido'),
    registerUsuario: document.getElementById('registerUsuario'),
    registerPassword: document.getElementById('registerPassword'),
    registerEmail: document.getElementById('registerEmail'),
    registerEstado: document.getElementById('registerEstado'),
    registerMunicipio: document.getElementById('registerMunicipio'),
    registerButton: document.getElementById('registerButton'),
    registerMensaje: document.getElementById('registerMensaje'),
    privacyModal: document.getElementById('privacyModal'),
    acceptPrivacyButton: document.getElementById('acceptPrivacyButton'),
    privacyCheckbox: document.getElementById('privacyCheckbox')
  };

  new RegistrationController(api, elements);
});
=======
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
>>>>>>> Stashed changes
