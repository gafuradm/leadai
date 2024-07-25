const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractAllPDFs() {
  const baseDir = path.join(__dirname, '../../public/ielts-sample-papers-2');
  const categories = fs.readdirSync(baseDir).filter(item => item !== '.DS_Store');

  const extractedData = {};

  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
      const pdfFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.pdf'));

      extractedData[category] = {};

      for (const pdfFile of pdfFiles) {
        const pdfPath = path.join(categoryPath, pdfFile);
        const text = await extractTextFromPDF(pdfPath);

        // Assuming the PDF content is already structured with a title, content, and questions
        // You can enhance this by adding regex parsing to better identify and structure the content
        const titleMatch = text.match(/Title:\s*(.*)/);
        const questionsMatch = text.match(/Questions:\s*((.|\n)*)/);
        
        const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
        const questions = questionsMatch ? questionsMatch[1].trim().split('\n').map(q => q.trim()) : [];

        extractedData[category][pdfFile] = {
          title: title,
          content: text.replace(/Title:\s*.*\n|Questions:\s*((.|\n)*)/, '').trim(),
          questions: questions
        };
      }
    }
  }

  fs.writeFileSync('extractedData.json', JSON.stringify(extractedData, null, 2));
}

extractAllPDFs().catch(console.error);
