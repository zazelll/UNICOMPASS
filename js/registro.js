class RegistroPage extends PageBase {
  constructor(api) {
    super(api);
    this.registerMensaje = null;
    this.registerEstado = null;
    this.registerMunicipio = null;
    this.registerButton = null;
    this.acceptPrivacyButton = null;
    this.privacyCheckbox = null;
    this.privacyModal = null;
  }

  init() {
    this.loadElements();
    this.fillEstados();
    this.bindEvents();
  }

  loadElements() {
    this.registerMensaje = this.get('registerMensaje');
    this.registerEstado = this.get('registerEstado');
    this.registerMunicipio = this.get('registerMunicipio');
    this.registerButton = this.get('registerButton');
    this.acceptPrivacyButton = this.get('acceptPrivacyButton');
    this.privacyCheckbox = this.get('privacyCheckbox');
    this.privacyModal = this.get('privacyModal');
  }

  bindEvents() {
    if (this.registerButton) {
      this.registerButton.addEventListener('click', this.showPrivacy.bind(this));
    }
    if (this.acceptPrivacyButton) {
      this.acceptPrivacyButton.addEventListener('click', this.onAcceptPrivacy.bind(this));
    }
    if (this.registerEstado) {
      this.registerEstado.addEventListener('change', this.fillMunicipios.bind(this));
    }
  }

  fillEstados() {
    if (!this.registerEstado || !this.registerMunicipio) return;
    const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};

    this.registerMunicipio.disabled = true;

    for (const estado in catalogo) {
      const opcion = document.createElement('option');
      opcion.value = estado;
      opcion.textContent = estado;
      this.registerEstado.appendChild(opcion);
    }
  }

  fillMunicipios() {
    if (!this.registerEstado || !this.registerMunicipio) return;
    const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};
    const valor = this.registerEstado.value;

    this.registerMunicipio.innerHTML = '';
    if (!valor) {
      this.registerMunicipio.disabled = true;
      return;
    }

    this.registerMunicipio.disabled = false;
    const lista = catalogo[valor] || [];
    for (let i = 0; i < lista.length; i += 1) {
      const municipio = lista[i];
      const opcion = document.createElement('option');
      opcion.value = municipio;
      opcion.textContent = municipio;
      this.registerMunicipio.appendChild(opcion);
    }
  }

  readForm() {
    return {
      nombre: this.getValue('registerNombre'),
      apellido: this.getValue('registerApellido'),
      usuario: this.getValue('registerUsuario'),
      contraseña: this.getValue('registerPassword'),
      email: this.getValue('registerEmail'),
      estado: this.getValue('registerEstado'),
      municipio: this.getValue('registerMunicipio')
    };
  }

  getValue(id) {
    const element = this.get(id);
    if (!element) return '';
    return element.value.trim();
  }

  validate(datos) {
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

  showPrivacy() {
    if (!this.privacyModal) return;
    this.privacyModal.classList.add('is-open');
    if (this.privacyCheckbox) {
      this.privacyCheckbox.checked = false;
    }
  }

  hidePrivacy() {
    if (!this.privacyModal) return;
    this.privacyModal.classList.remove('is-open');
  }

  showMessage(text) {
    if (this.registerMensaje) {
      this.registerMensaje.textContent = text;
    }
  }

  async onAcceptPrivacy() {
    if (!this.privacyCheckbox || !this.privacyCheckbox.checked) {
      this.showMessage('Debes aceptar los términos de privacidad.');
      return;
    }

    this.hidePrivacy();
    await this.registerUsuario();
  }

  async registerUsuario() {
    const datos = this.readForm();
    const error = this.validate(datos);
    if (error) {
      this.showMessage(error);
      return;
    }

    this.showMessage('Registrando...');
    const respuesta = await this.api.registerUser(
      datos.nombre,
      datos.apellido,
      datos.usuario,
      datos.contraseña,
      datos.email,
      datos.estado,
      datos.municipio
    );

    if (respuesta.ok) {
      this.showMessage('Registro guardado. Inicia sesión.');
      setTimeout(function () {
        window.location.href = 'secion.html';
      }, 1200);
    } else {
      this.showMessage(respuesta.error || 'No se pudo guardar el registro.');
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const page = new RegistroPage(window.UNICOMPASS);
  page.init();
});
