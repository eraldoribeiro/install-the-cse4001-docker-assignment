const fs = require('fs');
const { createWorker } = require('tesseract.js');

// Function to perform OCR
async function performOCR(imagePath) {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
}

// Function to check README.md for screenshot
function checkReadmeForScreenshot() {
  const readmeContent = fs.readFileSync('README.md', 'utf8');
  const screenshotRegex = /!\[.*\]\((.*\.(png|jpg|jpeg|gif|bmp|svg))\)/i;
  const match = screenshotRegex.exec(readmeContent);

  if (match) {
    console.log('Screenshot found in README.md');
    return match[1]; // Returns the file path of the screenshot
  } else {
    console.error('No screenshot found in README.md');
    process.exit(1);
  }
}

// Main execution
(async function main() {
  const screenshotPath = checkReadmeForScreenshot();
  if (screenshotPath) {
    const ocrText = await performOCR(screenshotPath);
    console.log('OCR Text:', ocrText);
    // Here, you can add more checks on ocrText if needed
    process.exit(0);
  }
})();
