// sirve para llenar los select de estados
// y municipios en el formulario de edición de perfil
// para ver el catalogo completo de estados y municipios,
// ver el archivo js/estados-municipios.js

// ---- ESTO ES UNA *FUNCIÓN* (no es método de ninguna clase) ----
// Está sola, fuera de cualquier class, por eso se puede llamar
// directo desde donde sea dentro de este archivo.
function llenarEstadosYMunicipiosParaEditar(estadoSelect, municipioSelect, estadoActual, municipioActual) {
  const catalogo = window.MEXICO_ESTADOS_MUNICIPIOS || {};

  for (const estado in catalogo) {
    const opcion = document.createElement('option');
    opcion.value = estado;
    opcion.textContent = estado;
    estadoSelect.appendChild(opcion);
  }

  // esta es otra función, pero está DENTRO de la de arriba (una función
  // adentro de otra función). Solo existe mientras se está ejecutando
  // llenarEstadosYMunicipiosParaEditar, nadie de afuera la puede llamar.
  function llenarMunicipios(estado, municipioSeleccionado) {
    municipioSelect.innerHTML = '';
    if (!estado) {
      municipioSelect.disabled = true;
      return;
    }
    municipioSelect.disabled = false;
    const lista = catalogo[estado] || [];
    for (let i = 0; i < lista.length; i += 1) {
      const municipio = lista[i];
      const opcion = document.createElement('option');
      opcion.value = municipio;
      opcion.textContent = municipio;
      if (municipio === municipioSeleccionado) {
        opcion.selected = true;
      }
      municipioSelect.appendChild(opcion);
    }
  }

  // sirve para llenar los municipios cuando se cambia el estado
  // en el select
  estadoSelect.addEventListener('change', function () {
    llenarMunicipios(estadoSelect.value, '');
  });

  if (estadoActual) {
    estadoSelect.value = estadoActual;
    llenarMunicipios(estadoActual, municipioActual);
  }
}

// ---- ESTO ES UNA *CLASE* Y ADEMÁS ES *HERENCIA* ----
// "class PerfilPage extends PageBase" hereda de PageBase (la que
// está en storage.js), por eso puede usar this.get(id), this.redirect(url), etc.
// sirve perfilpage para mostrar los datos del perfil y
// permitir su edición
// dice api para poder acceder a los datos del usuario actual
// y actualizar su perfil en el exel de gpoogle q es url de la api
class PerfilPage extends PageBase {
  constructor(api) {
    super(api); // llama al constructor del papá (PageBase) primero
    this.user = api.getCurrentUser();
  }

  init() {
    if (!this.user) {
      this.redirect('secion.html');
      return;
    }

    if (this.get('nombreCompleto')) {
      this.mostrarDatosDelPerfil();
    }

    const guardarButton = this.get('guardarButton');
    if (guardarButton) {
      this.llenarFormularioDeEdicion();
      guardarButton.addEventListener('click', this.guardarCambiosDePerfil.bind(this));
    }
  }

  // sirve para mostrar los datos del perfil en la pagina de perfil
  mostrarDatosDelPerfil() {
    this.setText('nombreCompleto', this.user.nombre + ' ' + this.user.apellido); // "setText" heredado de PageBase
    this.setText('usuarioActual', this.user.usuario);
    this.setText('emailActual', this.user.email);
    this.setText('estadoActual', this.user.estado);
    this.setText('municipioActual', this.user.municipio);
  }

  // sirve para llenar el formulario de edición de perfil
  // con los datos actuales del usuario
  llenarFormularioDeEdicion() {
    const editNombre = this.get('editNombre');
    const editApellido = this.get('editApellido');
    const editUsuario = this.get('editUsuario');
    const editEmail = this.get('editEmail');
    const editEstado = this.get('editEstado');
    const editMunicipio = this.get('editMunicipio');

    if (editNombre) editNombre.value = this.user.nombre || '';
    if (editApellido) editApellido.value = this.user.apellido || '';
    if (editUsuario) editUsuario.value = this.user.usuario || '';
    if (editEmail) editEmail.value = this.user.email || '';

    if (editEstado && editMunicipio) {
      llenarEstadosYMunicipiosParaEditar( // aquí se usa la función de arriba
        editEstado,
        editMunicipio,
        this.user.estado,
        this.user.municipio
      );
    }
  }

  // sirve para guardar los cambios de perfil en el exel de google
  async guardarCambiosDePerfil() {
    const mensaje = this.get('editMensaje');
    const nombre = this.get('editNombre') ? this.get('editNombre').value.trim() : '';
    const apellido = this.get('editApellido') ? this.get('editApellido').value.trim() : '';
    const email = this.get('editEmail') ? this.get('editEmail').value.trim() : '';
    const estado = this.get('editEstado') ? this.get('editEstado').value : '';
    const municipio = this.get('editMunicipio') ? this.get('editMunicipio').value : '';

    if (!nombre || !apellido) {
      if (mensaje) {
        mensaje.textContent = 'Nombre y apellido son requeridos.';
      }
      return;
    }

    if (mensaje) {
      mensaje.textContent = 'Guardando...';
    }

    // "await" espera a que Google Sheets conteste antes de seguir
    const guardado = await this.api.updateUser(this.user.usuario, {
      nombre: nombre,
      apellido: apellido,
      email: email,
      estado: estado,
      municipio: municipio
    });

    if (mensaje) {
      mensaje.textContent = guardado
        ? 'Cambios guardados correctamente.'
        : 'Error al guardar cambios.';
    }

    if (guardado) {
      setTimeout(function () {
        window.location.href = 'menu.html';
      }, 1500);
    }
  }
}

// sirve para inicializar la pagina de perfil cuando se carga el DOM
// esto lo investige esta parte para que cuando se cargue la pagina
// de perfil, se inicialice la clase PerfilPage y se
// llame a su metodo init para mostrar los datos del perfil
// y permitir su edición
document.addEventListener('DOMContentLoaded', function () {
  const api = window.UNICOMPASS;
  if (!api) return;
  const page = new PerfilPage(api); // se crea el objeto real (se "instancia" la clase)
  page.init();
});