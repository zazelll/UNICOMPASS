class SurveyBaseController {
  constructor(elements) {
    this.elements = elements;
  }

  getSelectedValue() {
    const selectedColor = document.querySelector('input[name="colorFavorito"]:checked');
    return selectedColor ? Number(selectedColor.value) : 0;
  }
}

class SurveyController extends SurveyBaseController {
  constructor(elements) {
    super(elements);
    this.init();
  }

  init() {
    if (!this.elements.finishButton) return;

    this.elements.finishButton.addEventListener('click', () => {
      this.finishSurvey();
    });
  }

  finishSurvey() {
    const value = this.getSelectedValue();
    localStorage.setItem('encuesta_color', value);

    if (this.elements.surveyMessage) {
      this.elements.surveyMessage.textContent = 'Tus respuestas fueron enviadas. Revisa tus resultados en Escuelas.';
      this.elements.surveyMessage.style.color = '#2f8c52';
    }

    setTimeout(() => {
      window.location.href = 'escuelas.html';
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    finishButton: document.getElementById('finishSurveyButton'),
    surveyMessage: document.getElementById('surveyMessage')
  };

  new SurveyController(elements);
});
