class Grafica {
  constructor(canvas) {
    this.canvas = canvas;
  }

  limpiarCanvas() {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return ctx;
  }

  dibujar(entradas) {
    // Se implementa en las subclases.
  }
}

class GraficaDeBarras extends Grafica {
  dibujar(entradas) {
    if (!this.canvas) return;
    var ctx = this.limpiarCanvas();
    var width = this.canvas.width;
    var height = this.canvas.height;
    var padding = 40;
    var chartHeight = height - padding * 2;
    var maxValue = 1;
    for (var i = 0; i < entradas.length; i += 1) {
      if (entradas[i].value > maxValue) {
        maxValue = entradas[i].value;
      }
    }

    var barSlot = (width - padding * 2) / entradas.length;
    var barWidth = barSlot * 0.6;
    if (barWidth > 50) {
      barWidth = 50;
    }

    ctx.strokeStyle = '#d8dde3';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    for (var i = 0; i < entradas.length; i += 1) {
      var entrada = entradas[i];
      var barHeight = (entrada.value / maxValue) * (chartHeight - 20);
      var x = padding + barSlot * i + (barSlot - barWidth) / 2;
      var y = height - padding - barHeight;

      ctx.fillStyle = entrada.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#102a43';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      var etiquetaCorta = entrada.label.split(' ')[0];
      ctx.fillText(etiquetaCorta, x + barWidth / 2, height - 16);
      ctx.fillText(entrada.value, x + barWidth / 2, y - 8);
    }
  }
}

class GraficaDePastel extends Grafica {
  constructor(canvas, etiquetaCentral) {
    super(canvas);
    this.etiquetaCentral = etiquetaCentral;
  }

  dibujar(entradas) {
    if (!this.canvas) return;
    var ctx = this.limpiarCanvas();
    var centerX = this.canvas.width / 2;
    var centerY = this.canvas.height / 2;
    var radio = 90;
    var anguloInicial = -0.5 * Math.PI;
    var total = 0;

    for (var i = 0; i < entradas.length; i += 1) {
      total += entradas[i].value;
    }
    if (total === 0) {
      total = 1;
    }

    for (var i = 0; i < entradas.length; i += 1) {
      var entrada = entradas[i];
      var anguloRebanada = (entrada.value / total) * (2 * Math.PI);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radio, anguloInicial, anguloInicial + anguloRebanada);
      ctx.closePath();
      ctx.fillStyle = entrada.color;
      ctx.fill();
      anguloInicial += anguloRebanada;
    }

    ctx.fillStyle = '#102a43';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.etiquetaCentral, centerX, centerY);
  }
}

class PaginaEscuelas extends PageBase {
  constructor(api) {
    super(api);
    this.api = api;
    this.user = api.getCurrentUser();
  }

  tieneResultado() {
    return !!(this.user && this.user.vocacionalResultado && this.user.vocacionalResultado.categoriaPrincipal);
  }

  mostrarEstadoVacio() {
    var suggestionBox = this.get('suggestionBox');
    var statsCanvas = this.get('statsChart');
    var skillsCanvas = this.get('skillsChart');
    var mapHint = this.get('mapHint');
    var mapPanelCard = this.get('mapPanelCard');

    if (suggestionBox) {
      suggestionBox.innerHTML =
        '<h3>Aún no tienes resultados</h3>' +
        '<p>Completa la encuesta vocacional para que podamos sugerirte una carrera y las escuelas más cercanas a ti.</p>' +
        '<p><a class="button" href="vocacional.html">Ir a la encuesta</a></p>';
    }

    var canvases = [statsCanvas, skillsCanvas];
    for (var i = 0; i < canvases.length; i += 1) {
      var canvas = canvases[i];
      if (!canvas) continue;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f7fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#52606d';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Completa la encuesta para ver esta gráfica', canvas.width / 2, canvas.height / 2);
    }

    if (mapPanelCard) {
      mapPanelCard.style.display = 'none';
    }
    if (mapHint) {
      mapHint.textContent = '';
    }
  }

  mostrarSugerencia() {
    var suggestionBox = this.get('suggestionBox');
    if (!suggestionBox) return;

    var resultado = this.user.vocacionalResultado;
    var principal = this.api.CAREERS[resultado.categoriaPrincipal];
    var secundaria = null;
    if (resultado.categoriaSecundaria) {
      secundaria = this.api.CAREERS[resultado.categoriaSecundaria];
    }

    var comparacionHtml = '';
    if (resultado.carreraDeseada) {
      var declarada = resultado.carreraDeseada.toLowerCase();
      var coincide = false;
      for (var i = 0; i < principal.carreras.length; i += 1) {
        var carrera = principal.carreras[i];
        var carreraLower = carrera.toLowerCase();
        if (carreraLower.indexOf(declarada) !== -1 || declarada.indexOf(carreraLower) !== -1) {
          coincide = true;
          break;
        }
      }
      if (coincide) {
        comparacionHtml =
          '<p class="small-text" style="color:#2f8c52;">¡Tu resultado coincide con la carrera que ya tenías en mente: <strong>' +
          resultado.carreraDeseada +
          '</strong>!</p>';
      } else {
        comparacionHtml =
          '<p class="small-text">Nos dijiste que te interesa <strong>' +
          resultado.carreraDeseada +
          '</strong>. Tu encuesta apunta más hacia el área de abajo, pero ambas opciones pueden convivir, ¡explóralas!</p>';
      }
    }

    var secundariaHtml = '';
    if (secundaria) {
      secundariaHtml =
        '<p><strong>También muestras afinidad con:</strong> ' +
        this.api.CATEGORY_LABELS[resultado.categoriaSecundaria] +
        ' (' + secundaria.carreras.join(', ') + ')</p>';
    }

    suggestionBox.innerHTML =
      '<h3>' + principal.escuela + '</h3>' +
      '<p><strong>Carreras sugeridas:</strong> ' + principal.carreras.join(', ') + '</p>' +
      '<p><strong>Motivo:</strong> ' + principal.motivo + '</p>' +
      secundariaHtml +
      comparacionHtml;
  }

  mostrarLeyenda(contenedor, entradas) {
    if (!contenedor) return;
    var html = '';
    for (var i = 0; i < entradas.length; i += 1) {
      var entrada = entradas[i];
      html +=
        '<span class="legend-item">' +
        '<span class="legend-dot" style="background:' + entrada.color + '"></span>' +
        entrada.label +
        '</span>';
    }
    contenedor.innerHTML = html;
  }

  mostrarGraficas() {
    var resultado = this.user.vocacionalResultado;
    var entradasEstadisticas = this.api.getSortedEntries(resultado.estadisticasScores);
    var estadisticasFiltradas = [];
    for (var i = 0; i < entradasEstadisticas.length; i += 1) {
      if (entradasEstadisticas[i].value > 0) {
        estadisticasFiltradas.push(entradasEstadisticas[i]);
      }
    }
    if (estadisticasFiltradas.length > 5) {
      estadisticasFiltradas = estadisticasFiltradas.slice(0, 5);
    }

    var entradasHabilidades = this.api.getSortedEntries(resultado.habilidadesScores);
    var habilidadesFiltradas = [];
    for (var j = 0; j < entradasHabilidades.length; j += 1) {
      if (entradasHabilidades[j].value > 0) {
        habilidadesFiltradas.push(entradasHabilidades[j]);
      }
    }
    if (habilidadesFiltradas.length > 5) {
      habilidadesFiltradas = habilidadesFiltradas.slice(0, 5);
    }

    var sinDatos = [{ label: 'Sin datos', value: 1, color: '#d8dde3' }];
    var graficaEstadisticas = new GraficaDeBarras(this.get('statsChart'));
    graficaEstadisticas.dibujar(estadisticasFiltradas.length ? estadisticasFiltradas : sinDatos);
    var graficaHabilidades = new GraficaDePastel(this.get('skillsChart'), 'Habilidades');
    graficaHabilidades.dibujar(habilidadesFiltradas.length ? habilidadesFiltradas : sinDatos);
    this.mostrarLeyenda(this.get('statsLegend'), estadisticasFiltradas);
    this.mostrarLeyenda(this.get('skillsLegend'), habilidadesFiltradas);
  }

  mostrarMapa() {
    var mapFrame = this.get('schoolMapFrame');
    var mapLink = this.get('mapLink');
    var mapHint = this.get('mapHint');
    var mapPanelCard = this.get('mapPanelCard');
    if (!mapPanelCard) return;

    var resultado = this.user.vocacionalResultado;
    var principal = this.api.CAREERS[resultado.categoriaPrincipal];
    var direccion = this.api.getDireccionCompleta(this.user);
    var query = direccion ? principal.escuela + ' cerca de ' + direccion : principal.escuela;

    if (mapFrame) {
      mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
    }
    if (mapLink) {
      mapLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    }
    if (mapHint) {
      if (direccion) {
        mapHint.textContent = 'Buscando "' + principal.escuela + '" cerca de "' + direccion + '".';
      } else {
        mapHint.textContent = 'No registraste tu dirección, así que buscamos "' + principal.escuela + '" en general. Agrega tu ubicación en tu perfil para resultados más cercanos a ti.';
      }
    }
  }

  iniciar() {
    if (!this.user) {
      this.redirect('secion.html');
      return;
    }
    if (!this.tieneResultado()) {
      this.mostrarEstadoVacio();
      return;
    }
    this.mostrarSugerencia();
    this.mostrarGraficas();
    this.mostrarMapa();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var api = window.UNICOMPASS;
  if (!api) return;
  var page = new PaginaEscuelas(api);
  page.iniciar();
});