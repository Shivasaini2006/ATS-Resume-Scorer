const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

/**
 * Parse PDF resume
 */
const parsePDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Parse DOCX resume
 */
const parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
};

/**
 * Main parser function - detects file type and parses accordingly
 */
const parseResume = async (filePath, fileType) => {
  try {
    let text = '';
    
    if (fileType === 'application/pdf' || filePath.endsWith('.pdf')) {
      text = await parsePDF(filePath);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      filePath.endsWith('.docx')
    ) {
      text = await parseDOCX(filePath);
    } else {
      throw new Error('Unsupported file type. Please upload PDF or DOCX files.');
    }
    
    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    if (!text || text.length < 50) {
      throw new Error('Could not extract sufficient text from the resume.');
    }
    
    return text;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  parseResume,
  parsePDF,
  parseDOCX
};
