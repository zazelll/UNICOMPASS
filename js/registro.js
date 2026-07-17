class BaseFormController {
  constructor(api) {
    this.api = api;
  }

  setMessage(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? '#c0392b' : '#2f8c52';
  }
}

// URL de tu Apps Script (Aplicación Web)
const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxT_4sWCVFxZ5dln549q9LvFlqM8kc3Wl4xrsYvOAajdgRSHrZDBYSDcr528ki2jNv0/exec';

function sendToGoogleSheet(data) {
  // Eliminada la condición estricta que causaba el bloqueo.
  if (!GOOGLE_SHEET_WEBAPP_URL) {
    console.warn('GOOGLE_SHEET_WEBAPP_URL no está configurada.');
    return;
  }

  // Se ejecuta el envío de datos de forma limpia
  fetch(GOOGLE_SHEET_WEBAPP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data)
  }).catch((error) => {
    console.warn('No se pudo enviar la copia a Google Sheets:', error);
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
      escuela: this.elements.registerEscuela ? this.elements.registerEscuela.value.trim() : '',
      semestre: this.elements.registerSemestre ? this.elements.registerSemestre.value.trim() : '',
      lugar: this.elements.registerLugar ? this.elements.registerLugar.value.trim() : '',
      lugarVive: this.elements.registerLugarVive ? this.elements.registerLugarVive.value.trim() : '',
      promedio: this.elements.registerPromedio ? this.elements.registerPromedio.value.trim() : '',
      nivelEscuela: this.elements.registerNivelEscuela ? this.elements.registerNivelEscuela.value : ''
    };
  }

  processRegistration() {
    const data = this.collectData();

    if (!data.nombre || !data.apellido || !data.usuario || !data.contraseña) {
      this.setMessage(this.elements.registerMensaje, 'Completa todos los campos.', true);
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
      data.escuela,
      data.semestre,
      data.lugar,
      data.promedio,
      data.nivelEscuela,
      data.lugarVive
    );

    if (ok) {
      const { contraseña, ...datosSinContrasena } = data;
      
      // Enviamos los datos a Google Sheets
      sendToGoogleSheet(datosSinContrasena);
      
      this.setMessage(this.elements.registerMensaje, 'Registro guardado con éxito. Redirigiendo...');
      
      // Damos 1.5 segundos para asegurar que la petición salga antes de cambiar de página
      setTimeout(() => {
        window.location.href = 'secion.html';
      }, 1500);
    } else {
      this.setMessage(this.elements.registerMensaje, 'No se pudo guardar el registro. Intenta de nuevo.', true);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const api = window.UNICOMPASS;
  if (!api) return;

  const elements = {
    registerNombre: document.getElementById('registerNombre'),
    registerApellido: document.getElementById('registerApellido'),
    registerUsuario: document.getElementById('registerUsuario'),
    registerPassword: document.getElementById('registerPassword'),
    registerEmail: document.getElementById('registerEmail'),
    registerEscuela: document.getElementById('registerEscuela'),
    registerSemestre: document.getElementById('registerSemestre'),
    registerLugar: document.getElementById('registerLugar'),
    registerPromedio: document.getElementById('registerPromedio'),
    registerNivelEscuela: document.getElementById('registerNivelEscuela'),
    registerButton: document.getElementById('registerButton'),
    registerMensaje: document.getElementById('registerMensaje'),
    privacyModal: document.getElementById('privacyModal'),
    acceptPrivacyButton: document.getElementById('acceptPrivacyButton'),
    privacyCheckbox: document.getElementById('privacyCheckbox')
  };

  new RegistrationController(api, elements);
});