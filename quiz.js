// Объект для хранения количества попыток и правильных ответов для каждого вопроса
const attempts = {
  book1: { count: 0, max: 2, answered: false, correct: false },
  book2: { count: 0, max: 2, answered: false, correct: false },
  book3: { count: 0, max: 2, answered: false, correct: false },
  song1: { count: 0, max: 2, answered: false, correct: false },
  picture1: { count: 0, max: 2, answered: false, correct: false },
  museum1: { count: 0, max: 2, answered: false, correct: false },
  song2: { count: 0, max: 2, answered: false, correct: false },
  movie1: { count: 0, max: 2, answered: false, correct: false },
  city1: { count: 0, max: 2, answered: false, correct: false },
  date1: { count: 0, max: 2, answered: false, correct: false }
};

// Обработчики для всех кнопок
document.getElementById('checkAnswer1').addEventListener('click', function() {
  checkAnswer('book1');
});

document.getElementById('checkAnswer2').addEventListener('click', function() {
  checkAnswer('book2');
});

document.getElementById('checkAnswer3').addEventListener('click', function(){
  checkAnswer('book3')
});

document.getElementById('checkAnswer4').addEventListener('click', function(){
  checkAnswer('song1')
});

document.getElementById('checkAnswer5').addEventListener('click', function(){
  checkAnswer('picture1')
});

document.getElementById('checkAnswer6').addEventListener('click', function(){
  checkAnswer('museum1')
});

document.getElementById('checkAnswer7').addEventListener('click', function(){
  checkAnswer('song2')
});

document.getElementById('checkAnswer8').addEventListener('click', function(){
  checkAnswer('movie1')
});

document.getElementById('checkAnswer9').addEventListener('click', function(){
  checkAnswer('city1')
});

document.getElementById('checkAnswer10').addEventListener('click', function(){
  checkAnswer('date1')
});

// Обработчик для кнопки показа результатов
document.getElementById('showResults').addEventListener('click', function() {
  showResults();
});

function checkAnswer(questionName) {
  // Проверяем, не исчерпаны ли попытки
  if (attempts[questionName].answered) {
    showModal('noAttemptsModal');
    return;
  }

  const selectedBook = document.querySelector(`input[name="${questionName}"]:checked`);
  
  if (!selectedBook) {
    alert('Пожалуйста, выберите правильный вариант!');
    return;
  }
  
  // Увеличиваем счетчик попыток
  attempts[questionName].count++;
  
  // Проверка правильности ответа для каждого вопроса
  const isCorrect = (
    (questionName === 'book1' && selectedBook.value === 'bednye_lyudi') ||
    (questionName === 'book2' && selectedBook.value === 'sevastopolskie rasskazy') ||
    (questionName === 'book3' && selectedBook.value === 'beliy pudel') ||
    (questionName === 'song1' && selectedBook.value === 'mozart1') ||
    (questionName === 'picture1' && selectedBook.value === 'alexandra_vladimirovna_vasnezova') ||
    (questionName === 'museum1' && selectedBook.value === 'russkiy_musey') ||
    (questionName === 'song2' && selectedBook.value === 'zima') ||
    (questionName === 'movie1' && selectedBook.value === 'rimskie_kaniculi') ||
    (questionName === 'city1' && selectedBook.value === 'liverpul') ||
    (questionName === 'date1' && selectedBook.value === '1872')
  );
  
  if (isCorrect) {
    attempts[questionName].answered = true;
    attempts[questionName].correct = true;
    showModal('correctModal');
    disableQuestion(questionName, true);
  } else {
    // Проверяем, остались ли попытки
    if (attempts[questionName].count >= attempts[questionName].max) {
      attempts[questionName].answered = true;
      document.getElementById('attemptsMessage').textContent = 'Ваш ответ неверен. Попытки исчерпаны.';
      showModal('wrongModal');
      disableQuestion(questionName, false);
    } else {
      const remaining = attempts[questionName].max - attempts[questionName].count;
      document.getElementById('attemptsMessage').textContent = `Ваш ответ неверен. Осталось попыток: ${remaining}`;
      showModal('wrongModal');
    }
  }
  
  // Обновляем информацию о попытках
  updateAttemptsInfo(questionName);
  
  // Проверяем, все ли вопросы отвечены, чтобы активировать кнопку результатов
  checkAllQuestionsAnswered();
}

function disableQuestion(questionName, isCorrect) {
  const button = document.getElementById(`checkAnswer${getQuestionNumber(questionName)}`);
  const quizContainer = button.previousElementSibling;
  
  button.disabled = true;
  button.classList.add('attempts-disabled');
  quizContainer.classList.add('attempts-disabled');
  
  if (isCorrect) {
    button.textContent = '✓ Отвечено верно';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
  } else {
    button.textContent = '✗ Попытки исчерпаны';
    button.style.backgroundColor = '#f44336';
    button.style.color = 'white';
  }
}

function getQuestionNumber(questionName) {
  const mapping = {
    'book1': '1',
    'book2': '2', 
    'book3': '3',
    'song1': '4',
    'picture1': '5',
    'museum1': '6',
    'song2': '7',
    'movie1': '8',
    'city1': '9',
    'date1': '10'
  };
  return mapping[questionName];
}

function updateAttemptsInfo(questionName) {
  const button = document.getElementById(`checkAnswer${getQuestionNumber(questionName)}`);
  const remaining = attempts[questionName].max - attempts[questionName].count;
  
  // Создаем или обновляем элемент с информацией о попытках
  let infoElement = button.parentNode.querySelector('.attempts-info');
  if (!infoElement) {
    infoElement = document.createElement('div');
    infoElement.className = 'attempts-info';
    button.parentNode.insertBefore(infoElement, button.nextSibling);
  }
  
  if (attempts[questionName].answered) {
    infoElement.textContent = 'Попытки исчерпаны';
    infoElement.style.color = '#f44336';
  } else {
    infoElement.textContent = `Осталось попыток: ${remaining}`;
    infoElement.style.color = '#666';
  }
}

function checkAllQuestionsAnswered() {
  const allAnswered = Object.values(attempts).every(question => question.answered);
  const resultsButton = document.getElementById('showResults');
  
  if (allAnswered) {
    resultsButton.disabled = false;
    resultsButton.style.backgroundColor = '#2196F3';
  }
}

function showResults() {
  const correctAnswers = Object.values(attempts).filter(question => question.correct).length;
  const totalQuestions = Object.keys(attempts).length;
  
  let message = '';
  let title = 'Результаты викторины';
  
  if (correctAnswers === 10) {
    message = 'Вы сверх интеллектуальны! Поздравляем вас вы ответили на все вопросы правильно';
    title = '🎉 Блестящий результат!';
  } else if (correctAnswers >= 8 && correctAnswers <= 9) {
    message = 'Вы очень умны! Поздравляем вас с успешным прохождением викторины.';
    title = '🏆 Отличный результат!';
  } else if (correctAnswers >= 5 && correctAnswers <= 7) {
    message = 'Вы настоящий молодец!! Поздравляем вас с хорошим прохождением викторины.';
    title = '👍 Хороший результат!';
  } else if (correctAnswers >= 3 && correctAnswers <= 4) {
    message = 'Неплохо! Попробуйте еще раз.';
    title = '📚 Неплохой результат!';
  } else if (correctAnswers >= 0 && correctAnswers <= 2) {
    message = 'Ничего страшного! В следующий раз у вас все получится.';
    title = '💪 Продолжайте учиться!';
  }
  
  document.getElementById('resultsTitle').textContent = title;
  document.getElementById('resultsMessage').textContent = message;
  document.getElementById('resultsScore').textContent = `Ваш результат: ${correctAnswers} из ${totalQuestions} правильных ответов`;
  
  showModal('resultsModal');
}

// Инициализация информации о попытках при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  Object.keys(attempts).forEach(questionName => {
    updateAttemptsInfo(questionName);
  });
});

// Остальные функции остаются без изменений
function showModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}