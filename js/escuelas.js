(function () {
  class ResultsRenderer {
    constructor(api, elements) {
      this.api = api;
      this.elements = elements;
      this.user = api.getCurrentUser();
    }

    hasResult() {
      return !!(this.user && this.user.vocacionalResultado && this.user.vocacionalResultado.categoriaPrincipal);
    }

    renderEmptyState() {
      const { suggestionBox, statsCanvas, skillsCanvas, mapHint, mapPanelCard } = this.elements;

      if (suggestionBox) {
        suggestionBox.innerHTML = `
          <h3>Aún no tienes resultados</h3>
          <p>Completa la encuesta vocacional para que podamos sugerirte una carrera y las escuelas más cercanas a ti.</p>
          <p><a class="button" href="vocacional.html">Ir a la encuesta</a></p>
        `;
      }

      [statsCanvas, skillsCanvas].forEach((canvas) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f7fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#52606d';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Completa la encuesta para ver esta gráfica', canvas.width / 2, canvas.height / 2);
      });

      if (mapPanelCard) mapPanelCard.style.display = 'none';
      if (mapHint) mapHint.textContent = '';
    }

    renderSuggestion() {
      const { suggestionBox } = this.elements;
      if (!suggestionBox) return;

      const result = this.user.vocacionalResultado;
      const primary = this.api.CAREERS[result.categoriaPrincipal];
      const secondary = result.categoriaSecundaria ? this.api.CAREERS[result.categoriaSecundaria] : null;

      let comparacionHtml = '';
      if (result.carreraDeseada) {
        const declarada = result.carreraDeseada.toLowerCase();
        const coincide = primary.carreras.some((c) => c.toLowerCase().includes(declarada) || declarada.includes(c.toLowerCase()));
        comparacionHtml = coincide
          ? `<p class="small-text" style="color:#2f8c52;">¡Tu resultado coincide con la carrera que ya tenías en mente: <strong>${result.carreraDeseada}</strong>!</p>`
          : `<p class="small-text">Nos dijiste que te interesa <strong>${result.carreraDeseada}</strong>. Tu encuesta apunta más hacia el área de abajo, pero ambas opciones pueden convivir, ¡explóralas!</p>`;
      }

      const secondaryHtml = secondary
        ? `<p><strong>También muestras afinidad con:</strong> ${this.api.CATEGORY_LABELS[result.categoriaSecundaria]} (${secondary.carreras.join(', ')})</p>`
        : '';

      suggestionBox.innerHTML = `
        <h3>${primary.escuela}</h3>
        <p><strong>Carreras sugeridas:</strong> ${primary.carreras.join(', ')}</p>
        <p><strong>Motivo:</strong> ${primary.motivo}</p>
        ${secondaryHtml}
        ${comparacionHtml}
      `;
    }

    drawBarChart(canvas, entries) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const padding = 40;
      const chartHeight = height - padding * 2;
      const maxValue = Math.max(...entries.map((e) => e.value), 1);
      const barSlot = (width - padding * 2) / entries.length;
      const barWidth = Math.min(50, barSlot * 0.6);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#d8dde3';
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();

      entries.forEach((entry, index) => {
        const barHeight = (entry.value / maxValue) * (chartHeight - 20);
        const x = padding + barSlot * index + (barSlot - barWidth) / 2;
        const y = height - padding - barHeight;
        ctx.fillStyle = entry.color;
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillStyle = '#102a43';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        const shortLabel = entry.label.split(' ')[0];
        ctx.fillText(shortLabel, x + barWidth / 2, height - 16);
        ctx.fillText(entry.value, x + barWidth / 2, y - 8);
      });
    }

    drawPieChart(canvas, entries, centerLabel) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 90;
      let startAngle = -0.5 * Math.PI;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const total = entries.reduce((sum, e) => sum + e.value, 0) || 1;

      entries.forEach((entry) => {
        const sliceAngle = (entry.value / total) * (2 * Math.PI);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = entry.color;
        ctx.fill();
        startAngle += sliceAngle;
      });

      ctx.fillStyle = '#102a43';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(centerLabel, centerX, centerY);
    }

    renderLegend(container, entries) {
      if (!container) return;
      container.innerHTML = entries
        .map(
          (entry) => `
          <span class="legend-item">
            <span class="legend-dot" style="background:${entry.color}"></span>
            ${entry.label}
          </span>`
        )
        .join('');
    }

    renderCharts() {
      const result = this.user.vocacionalResultado;

      // Estadísticas = gustos + valores (lo que le gusta, lo que valora)
      const estadisticasEntries = this.api.getSortedEntries(result.estadisticasScores).filter((e) => e.value > 0).slice(0, 5);
      // Habilidades = habilidades + conocimientos (en qué es hábil / qué sabe)
      const habilidadesEntries = this.api.getSortedEntries(result.habilidadesScores).filter((e) => e.value > 0).slice(0, 5);

      this.drawBarChart(this.elements.statsCanvas, estadisticasEntries.length ? estadisticasEntries : [{ label: 'Sin datos', value: 1, color: '#d8dde3' }]);
      this.drawPieChart(this.elements.skillsCanvas, habilidadesEntries.length ? habilidadesEntries : [{ label: 'Sin datos', value: 1, color: '#d8dde3' }], 'Habilidades');

      this.renderLegend(this.elements.statsLegend, estadisticasEntries);
      this.renderLegend(this.elements.skillsLegend, habilidadesEntries);
    }

    renderMap() {
      const { mapFrame, mapLink, mapHint, mapPanelCard } = this.elements;
      if (!mapPanelCard) return;

      const result = this.user.vocacionalResultado;
      const primary = this.api.CAREERS[result.categoriaPrincipal];
<<<<<<< Updated upstream
      const lugar = (this.user.lugarVive || this.user.lugar || '').trim();
      const query = lugar ? `${primary.escuela} cerca de ${lugar}` : `${primary.escuela}`;
=======
      const direccion = this.api.getDireccionCompleta ? this.api.getDireccionCompleta(this.user) : '';
      const query = direccion ? `${primary.escuela} cerca de ${direccion}` : `${primary.escuela}`;
>>>>>>> Stashed changes

      if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      if (mapLink) mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      if (mapHint) {
<<<<<<< Updated upstream
        mapHint.textContent = lugar
          ? `Buscando "${primary.escuela}" cerca de "${lugar}".`
          : `No registraste dónde vives, así que buscamos "${primary.escuela}" en general. Agrega tu ubicación en tu perfil para resultados más cercanos a ti.`;
=======
        mapHint.textContent = direccion
          ? `Buscando "${primary.escuela}" cerca de "${direccion}".`
          : `No registraste tu dirección, así que buscamos "${primary.escuela}" en general. Agrega tu ubicación en tu perfil para resultados más cercanos a ti.`;
>>>>>>> Stashed changes
      }
    }

    init() {
      if (!this.user) {
        window.location.href = 'secion.html';
        return;
      }
      if (!this.hasResult()) {
        this.renderEmptyState();
        return;
      }
      this.renderSuggestion();
      this.renderCharts();
      this.renderMap();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const api = window.UNICOMPASS;
    if (!api) return;

    const elements = {
      suggestionBox: document.getElementById('suggestionBox'),
      statsCanvas: document.getElementById('statsChart'),
      skillsCanvas: document.getElementById('skillsChart'),
      statsLegend: document.getElementById('statsLegend'),
      skillsLegend: document.getElementById('skillsLegend'),
      mapPanelCard: document.getElementById('mapPanelCard'),
      mapFrame: document.getElementById('schoolMapFrame'),
      mapLink: document.getElementById('mapLink'),
      mapHint: document.getElementById('mapHint')
    };

    new ResultsRenderer(api, elements).init();
  });
<<<<<<< Updated upstream
})();
=======
})();
>>>>>>> Stashed changes
