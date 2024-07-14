import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://ielts-up.com/reading/ielts-reading-practice.html';

async function scrapeTests() {
  const { data } = await axios.get(BASE_URL);
  const $ = cheerio.load(data);

  const tests = {
    academic: [],
    general: []
  };

  // Найдите и обработайте каждую ссылку на тест
  $('a:contains("Section 1")').each(async (index, element) => {
    const testUrl = $(element).attr('href');
    const testType = testUrl.includes('academic') ? 'academic' : 'general';
    const testData = await scrapeTest(testUrl);
    tests[testType].push(testData);
  });

  // Записать результаты в файл
  fs.writeFileSync('ielts_tests.json', JSON.stringify(tests, null, 2));
}

async function scrapeTest(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const texts = [];
  const questions = [];

  // Извлечь тексты
  $('.reading-text').each((index, element) => {
    texts.push({
      title: $(element).find('h3').text(),
      content: $(element).find('p').text()
    });
  });

  // Извлечь вопросы
  $('.question').each((index, element) => {
    questions.push({
      id: `Q${index + 1}`,
      type: determineQuestionType($(element)),
      question: $(element).find('.question-text').text(),
      options: $(element).find('.answer').map((i, el) => $(el).text()).get()
    });
  });

  return { texts, questions };
}

function determineQuestionType($question) {
  // Логика определения типа вопроса на основе структуры HTML
  // Это нужно будет настроить в зависимости от фактической структуры сайта
  if ($question.find('input[type="radio"]').length > 0) return 'multiple_choice';
  if ($question.find('input[type="checkbox"]').length > 0) return 'multiple_answer';
  // Добавьте больше условий для других типов вопросов
  return 'unknown';
}

scrapeTests();
