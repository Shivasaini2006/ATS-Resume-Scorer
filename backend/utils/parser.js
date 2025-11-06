const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Simple placeholder for resume parsing
exports.parse = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let text = '';

    if (ext === '.pdf') {
      // Parse PDF
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      text = data.text;
    } else if (ext === '.txt') {
      // Read text file
      text = fs.readFileSync(filePath, 'utf8');
    } else if (ext === '.doc' || ext === '.docx') {
      // For DOC/DOCX, you'd need a library like mammoth
      // For now, just return a message
      text = 'DOC/DOCX parsing not yet implemented. Please use PDF or TXT format.';
    }

    // Extract basic information (this is a simple version)
    const skills = extractSkills(text);
    const education = extractEducation(text);
    const experience = extractExperience(text);

    return {
      text,
      skills,
      education,
      experience
    };
  } catch (error) {
    console.error('Parse error:', error);
    return {
      text: 'Error parsing file',
      skills: [],
      education: [],
      experience: []
    };
  }
};

// Helper function to extract skills
function extractSkills(text) {
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Angular', 'Vue',
    'MongoDB', 'SQL', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
    'Machine Learning', 'AI', 'Data Analysis', 'TypeScript', 'HTML', 'CSS',
    'Express', 'Django', 'Flask', 'Spring', 'Leadership', 'Communication',
    'Project Management', 'Agile', 'Scrum', 'DevOps', 'CI/CD'
  ];

  const foundSkills = [];
  const lowerText = text.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

// Helper function to extract education
function extractEducation(text) {
  const education = [];
  const degreePatterns = [
    /bachelor'?s?\s+(?:of\s+)?(?:science|arts|engineering)/gi,
    /master'?s?\s+(?:of\s+)?(?:science|arts|engineering|business)/gi,
    /phd|doctorate/gi,
    /associate'?s?\s+degree/gi
  ];

  degreePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        education.push({ degree: match, institution: 'Unknown', year: 'Unknown' });
      });
    }
  });

  return education;
}

// Helper function to extract experience
function extractExperience(text) {
  // This is a very basic implementation
  // A real parser would use NLP and more sophisticated techniques
  const experience = [];
  const lines = text.split('\n');
  
  lines.forEach((line, index) => {
    // Look for common job title patterns
    if (line.match(/(developer|engineer|manager|analyst|designer|consultant)/i)) {
      experience.push({
        title: line.trim(),
        company: 'Unknown',
        duration: 'Unknown',
        description: lines[index + 1] || ''
      });
    }
  });

  return experience.slice(0, 5); // Limit to first 5 entries
}
