const pdf = require('pdf-parse');
const fs = require('fs-extra');
const path = require('path');

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

const jsonFilePath = path.resolve(__dirname, './ielts-data.json');
const pdfDir = path.resolve(__dirname, '../../public/ielts-sample-papers-2');

// Функция для извлечения текста из PDF файла
const extractTextFromPDF = async (pdfPath) => {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error extracting text from PDF ${pdfPath}:`, error);
    throw error;
  }
};

const updateJSONFile = async (jsonFilePath, newData) => {
  try {
    let jsonData;
    try {
      jsonData = await fs.readJson(jsonFilePath);
    } catch (error) {
      console.log('JSON file does not exist or is empty. Creating a new one.');
      jsonData = { sections: [] };
    }

    // Убедимся, что у нас есть массив sections
    if (!Array.isArray(jsonData.sections)) {
      jsonData.sections = [];
    }

    // Обновление или добавление новых данных
    newData.forEach((data) => {
      const existingSection = jsonData.sections.find(section => section.category === data.category);
      if (existingSection) {
        existingSection.content = data.content;
      } else {
        jsonData.sections.push(data);
      }
    });

    await fs.writeJson(jsonFilePath, jsonData, { spaces: 2 });
    console.log('JSON файл успешно обновлен');
  } catch (error) {
    console.error(`Error updating JSON file ${jsonFilePath}:`, error);
    throw error;
  }
};

const main = async () => {
  try {
    console.log('PDF directory:', pdfDir);
    const exists = await fs.pathExists(pdfDir);
    console.log('Directory exists:', exists);

    if (!exists) {
      throw new Error(`Directory ${pdfDir} does not exist`);
    }

    const categories = await fs.readdir(pdfDir);
    console.log('Found categories:', categories);

    const newData = [];

    for (const category of categories) {
      if (category === '.DS_Store') continue; // Пропускаем .DS_Store

      const categoryPath = path.join(pdfDir, category); // Убираем encodeURIComponent
      console.log('Checking directory:', categoryPath);

      try {
        const stats = await fs.stat(categoryPath);
        if (stats.isDirectory()) {
          const pdfFiles = await fs.readdir(categoryPath);
          console.log(`Found ${pdfFiles.length} files in ${category}`);

          for (const pdfFile of pdfFiles) {
            if (path.extname(pdfFile).toLowerCase() === '.pdf') {
              const pdfPath = path.join(categoryPath, pdfFile);
              console.log(`Processing file: ${pdfFile} in category: ${category}`);
              const text = await extractTextFromPDF(pdfPath);
              newData.push({
                category,
                content: text,
                pdfFile
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${categoryPath}:`, error);
      }
    }

    console.log('New data:', newData.map(item => ({ category: item.category, pdfFile: item.pdfFile })));
    await updateJSONFile(jsonFilePath, newData);
  } catch (error) {
    console.error('Error in main function:', error);
  }
};

main();