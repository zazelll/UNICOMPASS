//sirve para registrar un nuevo usuario en el sistema
//esto es sobre escrito en una clase ta usada en clase de ivan
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
//esto sirve para cargar los elementos del DOM en las variables 
// de la clase
//esta parte lo investigue para que cuando se cargue la pagina 
// de registro,
// se inicialice la clase RegistroPage y se llame a su metodo init
// para cargar los elementos del DOM en las variables de la clase
  loadElements() {
    this.registerMensaje = this.get('registerMensaje');
    this.registerEstado = this.get('registerEstado');
    this.registerMunicipio = this.get('registerMunicipio');
    this.registerButton = this.get('registerButton');
    this.acceptPrivacyButton = this.get('acceptPrivacyButton');
    this.privacyCheckbox = this.get('privacyCheckbox');
    this.privacyModal = this.get('privacyModal');
  }
//sirve para enlazar los eventos de los botones y selectores
//esto lo investigue para que cuando se cargue la pagina
  bindEvents() {
    if (this.registerButton) {
      this.registerButton.addEventListener('click', this.showPrivacy.bind(this));
    }//sirve para aceptar los terminos de privacidad y registrar el usuario
    if (this.acceptPrivacyButton) {
      this.acceptPrivacyButton.addEventListener('click', this.onAcceptPrivacy.bind(this));
    }//sirve para llenar los municipios cuando se cambia el estado en el select
    if (this.registerEstado) {
      this.registerEstado.addEventListener('change', this.fillMunicipios.bind(this));
    }
  }
//sirve para llenar el select de estados con los estados de mexico
//esto lo investigue para que cuando se cargue la pagina
// de registro, se llene el select de estados con los estados de mexico
  fillEstados() {
    if (!this.registerEstado || !this.registerMunicipio) return;
    const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};
//sirve para deshabilitar el select de municipios hasta que 
// se seleccione un estado
    this.registerMunicipio.disabled = true;

    for (const estado in catalogo) {
      const opcion = document.createElement('option');
      opcion.value = estado;
      opcion.textContent = estado;
      this.registerEstado.appendChild(opcion);
    }
  }
//sirve para llenar el select de municipios con los municipios 
// del estado seleccionado
  fillMunicipios() {
    if (!this.registerEstado || !this.registerMunicipio) return;
    const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};
    const valor = this.registerEstado.value;

    this.registerMunicipio.innerHTML = '';
    if (!valor) {
      this.registerMunicipio.disabled = true;
      return;
    }
//sirve para habilitar el select de municipios cuando 
// se selecciona un estado
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
//sirve para leer los datos del formulario de registro y
// devolver un objeto con los datos
//esto lo investigue para que cuando se haga click en el boton
// de registro, se lean los datos del formulario y se devuelva 
// un objeto con los datos
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
//sirve para obtener el valor de un elemento del DOM por su id
  getValue(id) {
    const element = this.get(id);
    if (!element) return '';
    return element.value.trim();
  }
//sirve para validar los datos del formulario de registro
  validate(datos) {
    if (!datos.nombre || !datos.apellido || !datos.usuario || !datos.contraseña || !datos.email) {
      return 'Completa todos los campos por favor.';
    }//sirve para validar el formato del correo electronico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//sirve para validar que el correo electronico tenga un formato valido (investige)
    if (!emailRegex.test(datos.email)) {
      return 'Ingresa un correo electrónico válido por favor.';
    }
    if (!datos.estado || !datos.municipio) {
      return 'Selecciona tu estado y municipio.';
    }//sirve para validar que la contraseña tenga exactamente 8 digitos numericos
    if (!/^\d{8}$/.test(datos.contraseña)) {
      return 'La contraseña debe tener exactamente 8 dígitos numéricos vuelve a corregir.';
    }
    return null;
  }
//sirve para mostrar el modal de privacidad y desmarcar el checkbox
  showPrivacy() {
    if (!this.privacyModal) return;
    this.privacyModal.classList.add('is-open');
    if (this.privacyCheckbox) {
      this.privacyCheckbox.checked = false;
    }
  }
//sirve para ocultar el modal de privacidad
  hidePrivacy() {
    if (!this.privacyModal) return;
    this.privacyModal.classList.remove('is-open');
  }
//sirve para mostrar un mensaje en el elemento registerMensaje
  showMessage(text) {
    if (this.registerMensaje) {
      this.registerMensaje.textContent = text;
    }
  }
//sirve para manejar el evento de aceptar los terminos de privacidad
  async onAcceptPrivacy() {
    if (!this.privacyCheckbox || !this.privacyCheckbox.checked) {
      this.showMessage('Debes aceptar los términos de privacidad por favor.');
      return;
    }
//sirve para ocultar el modal de privacidad y registrar el usuario
    this.hidePrivacy();
    await this.registerUsuario();
  }
//sirve para registrar el usuario en el sistema
  async registerUsuario() {
    const datos = this.readForm();
    const error = this.validate(datos);
    if (error) {
      this.showMessage(error);
      return;
    }
//sirve para mostrar un mensaje de registrando mientras se hace la peticion a la api
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
//sirve para mostrar un mensaje de registro guardado o error dependiendo de la respuesta de la api
    if (respuesta.ok) {
      this.showMessage('Registro se guardó que bueno. Iniciando sesión.');
      setTimeout(function () {
        window.location.href = 'secion.html';
      }, 1200);
    } else {
      this.showMessage(respuesta.error || 'No se pudo guardar el registro perdon error.');
    }
  }
}
//sirve para inicializar la pagina de registro cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function () {
  const page = new RegistroPage(window.UNICOMPASS);
  page.init();
});
