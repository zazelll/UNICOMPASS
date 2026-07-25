//este archivo sirve para manejar la página de login y admin esto resuelve lo de localstorage y la comunicación con Google Sheets 
// para registrar, login, editar perfil y mostrar los usuarios en la tabla de admin.
//sirve para configurar la url del webapp 
// de google sheets y el token de administrador
class LoginPage extends PageBase {
  constructor(api) {
    super(api);
    this.loginUsuario = null;
    this.loginPassword = null;
    this.loginButton = null;
    this.loginMensaje = null;
    this.adminPanel = null;
    this.usersTable = null;
    this.filtroUsuario = null;
    this.refrescarSheetButton = null;
    this.sheetMensaje = null;
    this.logoutLink = null;
    this.registrosCargados = [];
  }
// sirve para inicializar la página de login y 
// admin
  init() {
    this.loadElements();
    this.bindEvents();
  }
// sirve para cargar los elementos del DOM en las variables de la clase
  loadElements() {
    this.loginUsuario = this.get('loginUsuario');
    this.loginPassword = this.get('loginPassword');
    this.loginButton = this.get('loginButton');
    this.loginMensaje = this.get('loginMensaje');
    this.adminPanel = this.get('adminPanel');
    this.usersTable = this.get('usersTable');
    this.filtroUsuario = this.get('filtroUsuario');
    this.refrescarSheetButton = this.get('refrescarSheetButton');
    this.sheetMensaje = this.get('sheetMensaje');
    this.logoutLink = this.get('logoutLink');
  }
// sirve para enlazar los eventos de los botones y campos de entrada
  bindEvents() {
    if (this.loginButton) {
      this.loginButton.addEventListener('click', this.onLoginClick.bind(this));
    }
    if (this.refrescarSheetButton) {
      this.refrescarSheetButton.addEventListener('click', this.cargarUsuariosDesdeSheets.bind(this));
    }
    if (this.filtroUsuario) {
      this.filtroUsuario.addEventListener('input', this.onFilterInput.bind(this));
    }
    if (this.logoutLink) {
      this.logoutLink.addEventListener('click', this.onLogoutClick.bind(this));
    }
  }
// sirve para establecer un mensaje en la página de login
  setMessage(text) {
    if (this.loginMensaje) {
      this.loginMensaje.textContent = text;
    }
  }
// sirve para mostrar los usuarios en la tabla de admin
  mostrarUsuariosEnTabla(usuarios) {
    if (!this.usersTable) return;
    const tbody = this.usersTable.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    for (let i = 0; i < usuarios.length; i += 1) {
      const usuario = usuarios[i];
      const fila = document.createElement('tr');
      fila.innerHTML =
        '<td>' + (usuario.Fecha || '') + '</td>' +
        '<td>' + (usuario.Nombre || '') + '</td>' +
        '<td>' + (usuario.Apellido || '') + '</td>' +
        '<td>' + (usuario.Usuario || '') + '</td>' +
        '<td>' + (usuario.Email || '') + '</td>' +
        '<td>' + (usuario.Estado || '') + '</td>' +
        '<td>' + (usuario.Municipio || '') + '</td>';
      tbody.appendChild(fila);
    }
  }
// sirve para cargar los usuarios desde Google Sheets y mostrarlos en la tabla de admin
  async cargarUsuariosDesdeSheets() {
    if (this.sheetMensaje) {
      this.sheetMensaje.textContent = 'Cargando...';
    }

    const url = GOOGLE_SHEET_WEBAPP_URL + '?token=' + encodeURIComponent(ADMIN_TOKEN);
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (!datos.ok) {
      if (this.sheetMensaje) {
        this.sheetMensaje.textContent = 'Error: ' + datos.error;
      }
      return;
    }

    this.registrosCargados = datos.registros || [];
    this.mostrarUsuariosEnTabla(this.registrosCargados);

    if (this.sheetMensaje) {
      this.sheetMensaje.textContent = this.registrosCargados.length + ' usuario(s) encontrados.';
    }
  }

  onFilterInput() {
    const texto = this.filtroUsuario ? this.filtroUsuario.value.trim().toLowerCase() : '';
    const filtrados = this.registrosCargados.filter(function (u) {
      return (u.Usuario || '').toLowerCase().indexOf(texto) !== -1;
    });
    this.mostrarUsuariosEnTabla(filtrados);
  }

  onLogoutClick() {
    this.api.clearCurrentUser();
    window.location.reload();
  }

  async onLoginClick() {
    if (!this.loginUsuario || !this.loginPassword || !this.loginMensaje) return;

    const usuario = this.loginUsuario.value.trim();
    const contraseña = this.loginPassword.value;

    if (!usuario || !contraseña) {
      this.setMessage('Completa usuario y contraseña.');
      return;
    }

    if (this.api.isAdmin(usuario, contraseña)) {
      this.setMessage('Bienvenido admin.');
      if (this.adminPanel) {
        this.adminPanel.style.display = 'block';
      }
      const preguntasPanel = this.get('preguntasPanel');
      if (preguntasPanel) {
        preguntasPanel.style.display = 'block';
      }
      this.cargarUsuariosDesdeSheets();
      if (typeof cargarPreguntasAdmin === 'function') {
        cargarPreguntasAdmin();
      }
      return;
    }

    this.setMessage('Verificando...');
    const respuesta = await this.api.loginUser(usuario, contraseña);

    if (respuesta.ok) {
      this.redirect('menu.html');
    } else {
      this.setMessage(respuesta.error || 'Usuario o contraseña incorrectos.');
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const api = window.UNICOMPASS;
  if (!api) return;
  const page = new LoginPage(api);
  page.init();
});
