class ResultsRenderer {
  constructor(elements) {
    this.elements = elements;
    this.selectedValue = Number(localStorage.getItem('encuesta_color') || 0);
    this.profile = this.getProfile(this.selectedValue);
  }

  getProfile(value) {
    switch (value) {
      case 1:
        return {
          name: 'Rojo',
          school: 'Escuela de Diseño y Creatividad',
          career: 'Diseño gráfico o publicidad',
          option: 'Expresión visual',
          location: 'Zona urbana',
          reason: 'Tu respuesta destaca energía y actitud expresiva.',
          stats: [5, 4, 7, 6],
          skills: [
            { value: 40, color: '#e63946' },
            { value: 25, color: '#f39c12' },
            { value: 20, color: '#1f6feb' },
            { value: 15, color: '#2f8c52' }
          ]
        };
      case 2:
        return {
          name: 'Verde',
          school: 'Escuela de Ciencias Naturales',
          career: 'Biología o medio ambiente',
          option: 'Cuidado del planeta',
          location: 'Cerca de una reserva natural',
          reason: 'Tu respuesta muestra equilibrio y conexión con la naturaleza.',
          stats: [7, 6, 4, 5],
          skills: [
            { value: 30, color: '#2f8c52' },
            { value: 25, color: '#1f6feb' },
            { value: 25, color: '#f39c12' },
            { value: 20, color: '#8e44ad' }
          ]
        };
      case 3:
        return {
          name: 'Azul',
          school: 'Escuela de Ingeniería y Tecnología',
          career: 'Informática o ingeniería',
          option: 'Solución de problemas',
          location: 'Área tecnológica',
          reason: 'Tu respuesta refleja orden, lógica y gusto por aprender.',
          stats: [6, 7, 4, 6],
          skills: [
            { value: 35, color: '#1f6feb' },
            { value: 25, color: '#2f8c52' },
            { value: 20, color: '#c0392b' },
            { value: 20, color: '#f39c12' }
          ]
        };
      case 4:
        return {
          name: 'Morado',
          school: 'Escuela de Humanidades y Artes',
          career: 'Psicología o artes',
          option: 'Creatividad e introspección',
          location: 'Zona cultural',
          reason: 'Tu respuesta destaca sensibilidad y visión creativa.',
          stats: [8, 5, 6, 7],
          skills: [
            { value: 35, color: '#8e44ad' },
            { value: 25, color: '#e63946' },
            { value: 20, color: '#1f6feb' },
            { value: 20, color: '#f1c40f' }
          ]
        };
      case 5:
        return {
          name: 'Amarillo',
          school: 'Escuela de Negocios y Liderazgo',
          career: 'Administración o emprendimiento',
          option: 'Motivación y comunicación',
          location: 'Centro de negocios',
          reason: 'Tu respuesta muestra energía, confianza y proactividad.',
          stats: [7, 8, 3, 5],
          skills: [
            { value: 40, color: '#f1c40f' },
            { value: 25, color: '#2f8c52' },
            { value: 20, color: '#1f6feb' },
            { value: 15, color: '#c0392b' }
          ]
        };
      default:
        return {
          name: 'Sin respuesta',
          school: 'Escuela recomendada',
          career: 'Carrera o área de interés',
          option: 'Opción elegida',
          location: 'Cerca de tu ubicación',
          reason: 'Completa la encuesta para ver una recomendación más precisa.',
          stats: [6, 5, 5, 6],
          skills: [
            { value: 25, color: '#2f8c52' },
            { value: 25, color: '#1f6feb' },
            { value: 25, color: '#f39c12' },
            { value: 25, color: '#c0392b' }
          ]
        };
    }
  }

  renderSuggestion() {
    if (!this.elements.suggestionBox) return;

    const suggestionTemplate = {
      escuela: this.profile.school,
      carrera: this.profile.career,
      opcion: this.profile.option,
      distancia: this.profile.location,
      motivo: this.profile.reason
    };

    this.elements.suggestionBox.innerHTML = `
      <h3>${suggestionTemplate.escuela}</h3>
      <p><strong>Carrera:</strong> ${suggestionTemplate.carrera}</p>
      <p><strong>Opción:</strong> ${suggestionTemplate.opcion}</p>
      <p><strong>Ubicación:</strong> ${suggestionTemplate.distancia}</p>
      <p><strong>Motivo:</strong> ${suggestionTemplate.motivo}</p>
      <p><strong>Respuesta:</strong> ${this.profile.name}</p>
    `;
  }

  drawBarChart(canvas, labels, values, colors) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...values, 10);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d8dde3';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    labels.forEach((label, index) => {
      const barHeight = (values[index] / maxValue) * (chartHeight - 20);
      const x = padding + 40 + index * 80;
      const y = height - padding - barHeight;
      ctx.fillStyle = colors[index];
      ctx.fillRect(x, y, 40, barHeight);
      ctx.fillStyle = '#102a43';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + 20, height - 16);
      ctx.fillText(values[index], x + 20, y - 8);
    });
  }

  drawPieChart(canvas, slices) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 90;
    let startAngle = -0.5 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const total = slices.reduce((sum, slice) => sum + slice.value, 0);

    slices.forEach((slice) => {
      const sliceAngle = (slice.value / total) * (2 * Math.PI);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    ctx.fillStyle = '#102a43';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Emociones y habilidades', centerX, centerY);
  }
}

class SchoolResultsView extends ResultsRenderer {
  constructor(elements) {
    super(elements);
    this.init();
  }

  init() {
    this.renderSuggestion();
    this.drawBarChart(
      this.elements.statsCanvas,
      ['Cualidades', 'Sabe', 'No sabe', 'Mejorar'],
      this.profile.stats,
      ['#2f8c52', '#1f6feb', '#c0392b', '#f39c12']
    );
    this.drawPieChart(this.elements.skillsCanvas, this.profile.skills);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    suggestionBox: document.getElementById('suggestionBox'),
    statsCanvas: document.getElementById('statsChart'),
    skillsCanvas: document.getElementById('skillsChart')
  };

  new SchoolResultsView(elements);
});

