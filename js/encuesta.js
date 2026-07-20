(function () {
  // Las preguntas ya NO se escriben aquí. Siempre se traen desde la pestaña
  // "Preguntas" de tu Google Sheet, la misma que edita el admin desde admin.html.
  // Cada respuesta trae su(s) categoría(s) (TEC, ING, ART, HUM, NEG, SAL, CIE, DER)
  // y con eso se suman los puntos para saber la carrera del usuario.
  let QUESTIONS = [];

  async function cargarPreguntasRemotas() {
    try {
      const response = await fetch(`${GOOGLE_SHEET_WEBAPP_URL}?action=preguntas`);
      const data = await response.json();

      if (data && data.ok && Array.isArray(data.preguntas)) {
        QUESTIONS = data.preguntas;
      }
    } catch (error) {
      console.warn('No se pudieron cargar las preguntas desde Google Sheets:', error);
    }

    return QUESTIONS.length > 0;
  }

  const SECTIONS = ['gustos', 'habilidades', 'conocimientos', 'valores'];
  const SECTION_META = {
    gustos: {
      title: 'Gustos e Intereses',
      desc: 'No hay respuestas correctas o incorrectas, elige lo que más se parezca a ti.'
    },
    habilidades: {
      title: 'Habilidades',
      desc: 'Piensa en situaciones reales que ya te han pasado.'
    },
    conocimientos: {
      title: 'Conocimientos y Aptitudes',
      desc: 'Sobre lo que ya sabes o se te facilita aprender.'
    },
    valores: {
      title: 'Valores Laborales',
      desc: 'Sobre cómo te gustaría que fuera tu futuro trabajo.'
    }
  };

  // Pasos: 0 = intro (datos ya en el HTML), 1-4 = secciones del quiz, 5 = datos extra + confirmación
  const TOTAL_STEPS = 6;

  class SurveyEngine {
    constructor(api, elements) {
      this.api = api;
      this.elements = elements;
      this.answers = {}; // { questionId: optionIndex }
      this.currentStep = 0;
      this.user = null;
    }

    init() {
      this.user = this.api.getCurrentUser();
      if (!this.user) {
        window.location.href = 'secion.html';
        return;
      }

      if (this.elements.nombreCompleto) {
        this.elements.nombreCompleto.textContent = `${this.user.nombre || ''} ${this.user.apellido || ''}`.trim();
      }
      if (this.elements.usuarioActual) this.elements.usuarioActual.textContent = this.user.usuario || '';

      if (this.elements.prevButton) {
        this.elements.prevButton.addEventListener('click', () => this.goToStep(this.currentStep - 1));
      }
      if (this.elements.nextButton) {
        this.elements.nextButton.addEventListener('click', () => {
          if (!this.validateCurrentStep()) return;
          this.goToStep(this.currentStep + 1);
        });
      }
      if (this.elements.quizQuestions) {
        this.elements.quizQuestions.addEventListener('change', (event) => {
          if (event.target && event.target.name && event.target.name.startsWith('q_')) {
            const qid = event.target.name.slice(2);
            this.answers[qid] = Number(event.target.value);
            this.clearStepWarning();
          }
        });
      }
      if (this.elements.finishButton) {
        this.elements.finishButton.addEventListener('click', () => this.finishSurvey());
      }

      this.renderStep();
    }

    clearStepWarning() {
      if (this.elements.stepWarning) this.elements.stepWarning.textContent = '';
    }

    goToStep(step) {
      if (step < 0 || step > TOTAL_STEPS - 1) return;
      this.currentStep = step;
      this.renderStep();
    }

    questionsForSection(section) {
      return QUESTIONS.filter((q) => q.section === section);
    }

    renderStep() {
      const { stepIntro, stepQuiz, stepFinal, quizSectionTitle, quizSectionDesc, prevButton, nextButton, stepNav, progressFill, progressLabel } = this.elements;

      if (stepIntro) stepIntro.style.display = this.currentStep === 0 ? 'block' : 'none';
      if (stepQuiz) stepQuiz.style.display = this.currentStep >= 1 && this.currentStep <= 4 ? 'block' : 'none';
      if (stepFinal) stepFinal.style.display = this.currentStep === 5 ? 'block' : 'none';

      if (this.currentStep >= 1 && this.currentStep <= 4) {
        const section = SECTIONS[this.currentStep - 1];
        const meta = SECTION_META[section];
        if (quizSectionTitle) quizSectionTitle.textContent = meta.title;
        if (quizSectionDesc) quizSectionDesc.textContent = meta.desc;
        this.renderQuestions(section);
      }

      if (prevButton) prevButton.disabled = this.currentStep === 0;
      if (nextButton) nextButton.style.display = this.currentStep === 5 ? 'none' : 'inline-flex';
      if (stepNav) stepNav.style.display = 'flex';

      const percent = Math.round((this.currentStep / (TOTAL_STEPS - 1)) * 100);
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressLabel) progressLabel.textContent = `Paso ${this.currentStep + 1} de ${TOTAL_STEPS}`;

      this.clearStepWarning();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderQuestions(section) {
      const container = this.elements.quizQuestions;
      if (!container) return;
      const questions = this.questionsForSection(section);

      container.innerHTML = questions
        .map((question, index) => {
          const optionsHtml = question.options
            .map((option, optIndex) => {
              const checked = this.answers[question.id] === optIndex ? 'checked' : '';
              const inputId = `opt_${question.id}_${optIndex}`;
              return `
                <label class="option-item" for="${inputId}">
                  <input type="radio" id="${inputId}" name="q_${question.id}" value="${optIndex}" ${checked}>
                  <span>${option.text}</span>
                </label>`;
            })
            .join('');

          return `
            <div class="question-card">
              <h3>${index + 1}. ${question.text}</h3>
              <div class="option-list">${optionsHtml}</div>
            </div>`;
        })
        .join('');
    }

    validateCurrentStep() {
      if (this.currentStep < 1 || this.currentStep > 4) return true;
      const section = SECTIONS[this.currentStep - 1];
      const questions = this.questionsForSection(section);
      const missing = questions.some((q) => this.answers[q.id] === undefined);

      if (missing) {
        if (this.elements.stepWarning) {
          this.elements.stepWarning.textContent = 'Responde todas las preguntas de esta sección para continuar.';
        }
        return false;
      }
      return true;
    }

    computeScores() {
      const empty = () => ({ TEC: 0, ING: 0, ART: 0, HUM: 0, NEG: 0, SAL: 0, CIE: 0, DER: 0 });
      const categoryScores = empty();
      const habilidadesScores = empty(); // habilidades + conocimientos
      const estadisticasScores = empty(); // gustos + valores

      QUESTIONS.forEach((question) => {
        const selected = this.answers[question.id];
        if (selected === undefined) return;
        const option = question.options[selected];
        const cats = option.cats;
        if (!cats || cats.length === 0) return;

        const points = 1 / cats.length;
        const isHabilidadGroup = question.section === 'habilidades' || question.section === 'conocimientos';
        const isEstadisticaGroup = question.section === 'gustos' || question.section === 'valores';

        cats.forEach((cat) => {
          categoryScores[cat] += points;
          if (isHabilidadGroup) habilidadesScores[cat] += points;
          if (isEstadisticaGroup) estadisticasScores[cat] += points;
        });
      });

      return { categoryScores, habilidadesScores, estadisticasScores };
    }

    async finishSurvey() {
      const agreement = document.querySelector('input[name="agreement"]:checked');
      if (!agreement) {
        if (this.elements.surveyMessage) {
          this.elements.surveyMessage.textContent = 'Selecciona si estás de acuerdo con tus respuestas antes de enviar.';
          this.elements.surveyMessage.style.color = '#c0392b';
        }
        return;
      }

      if (agreement.value === 'no') {
        if (this.elements.surveyMessage) {
          this.elements.surveyMessage.textContent = 'Usa "Anterior" para revisar y ajustar tus respuestas.';
          this.elements.surveyMessage.style.color = '#c0392b';
        }
        return;
      }

      const { categoryScores, habilidadesScores, estadisticasScores } = this.computeScores();
      const { primary, secondary } = this.api.determinePrimarySecondary(categoryScores);

      const carreraSelect = document.getElementById('carreraSelect');
      const otraCarreraInput = document.getElementById('otraCarreraInput');
      const porQueElegiste = document.getElementById('porQueElegiste');
      const cambiarOpcion = document.getElementById('cambiarOpcion');
      const informacionExtra = document.getElementById('informacionExtra');

      const otraCarrera = otraCarreraInput ? otraCarreraInput.value.trim() : '';
      const carreraDeseada = otraCarrera || (carreraSelect ? carreraSelect.value : '');

      const vocacionalResultado = {
        fecha: new Date().toISOString(),
        categoryScores,
        habilidadesScores,
        estadisticasScores,
        categoriaPrincipal: primary ? primary.code : null,
        categoriaSecundaria: secondary ? secondary.code : null,
        carreraDeseada,
        razonEleccion: porQueElegiste ? porQueElegiste.value.trim() : '',
        cambioOpcion: cambiarOpcion ? cambiarOpcion.value.trim() : '',
        informacionExtra: informacionExtra ? informacionExtra.value.trim() : ''
      };

      const ok = await this.api.updateUser(this.user.usuario, { vocacionalResultado });

      if (this.elements.surveyMessage) {
        if (ok) {
          this.elements.surveyMessage.textContent = 'Tus respuestas fueron enviadas. Revisa tus resultados en Escuelas.';
          this.elements.surveyMessage.style.color = '#2f8c52';
        } else {
          this.elements.surveyMessage.textContent = 'No se pudieron guardar tus respuestas. Intenta de nuevo.';
          this.elements.surveyMessage.style.color = '#c0392b';
          return;
        }
      }

      setTimeout(() => {
        window.location.href = 'escuelas.html';
      }, 1200);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const api = window.UNICOMPASS;
    if (!api) return;

    const progressLabel = document.getElementById('quizProgressLabel');
    if (progressLabel) progressLabel.textContent = 'Cargando encuesta...';

    const cargoBien = await cargarPreguntasRemotas();

    if (!cargoBien) {
      if (progressLabel) progressLabel.textContent = 'No se pudieron cargar las preguntas. Intenta más tarde.';
      return;
    }

    const elements = {
      nombreCompleto: document.getElementById('nombreCompleto'),
      usuarioActual: document.getElementById('usuarioActual'),
      stepIntro: document.getElementById('stepIntro'),
      stepQuiz: document.getElementById('stepQuiz'),
      stepFinal: document.getElementById('stepFinal'),
      quizSectionTitle: document.getElementById('quizSectionTitle'),
      quizSectionDesc: document.getElementById('quizSectionDesc'),
      quizQuestions: document.getElementById('quizQuestions'),
      stepWarning: document.getElementById('stepWarning'),
      stepNav: document.getElementById('stepNav'),
      prevButton: document.getElementById('prevStepButton'),
      nextButton: document.getElementById('nextStepButton'),
      progressFill: document.getElementById('quizProgressFill'),
      progressLabel: document.getElementById('quizProgressLabel'),
      finishButton: document.getElementById('finishSurveyButton'),
      surveyMessage: document.getElementById('surveyMessage')
    };

    new SurveyEngine(api, elements).init();
  });
})();