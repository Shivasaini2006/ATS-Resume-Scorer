const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Common ATS keywords by category
const ATS_KEYWORDS = {
  technical: [
    'javascript', 'python', 'java', 'c++', 'react', 'angular', 'vue', 'node.js',
    'express', 'mongodb', 'sql', 'postgresql', 'mysql', 'aws', 'azure', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'rest api', 'graphql', 'typescript',
    'html', 'css', 'bootstrap', 'tailwind', 'webpack', 'npm', 'yarn'
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'critical thinking', 'time management', 'adaptability', 'creativity',
    'collaboration', 'organizational', 'presentation', 'negotiation'
  ],
  experience: [
    'developed', 'managed', 'led', 'implemented', 'designed', 'created',
    'improved', 'optimized', 'maintained', 'coordinated', 'supervised',
    'analyzed', 'delivered', 'achieved', 'reduced', 'increased'
  ],
  education: [
    'bachelor', 'master', 'phd', 'degree', 'certificate', 'certification',
    'diploma', 'graduate', 'undergraduate', 'mba', 'engineering', 'computer science'
  ]
};

/**
 * Calculate ATS score for a resume
 * @param {string} text - Extracted resume text
 * @returns {object} - Score and analysis
 */
const calculateATSScore = (text) => {
  const lowerText = text.toLowerCase();
  const tokens = tokenizer.tokenize(lowerText);
  
  // Extract all keywords
  const allKeywords = [
    ...ATS_KEYWORDS.technical,
    ...ATS_KEYWORDS.soft,
    ...ATS_KEYWORDS.experience,
    ...ATS_KEYWORDS.education
  ];
  
  // Find matched keywords
  const matchedKeywords = [];
  const keywordFrequency = {};
  
  allKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      matchedKeywords.push(keyword);
      keywordFrequency[keyword] = matches.length;
    }
  });
  
  // Find missing important keywords (sample)
  const missingKeywords = allKeywords
    .filter(kw => !matchedKeywords.includes(kw))
    .slice(0, 10); // Limit to 10 for display
  
  // Scoring factors
  const keywordScore = Math.min((matchedKeywords.length / allKeywords.length) * 100, 40);
  const lengthScore = Math.min((tokens.length / 500) * 20, 20); // Optimal ~500 words
  const sectionScore = calculateSectionScore(lowerText);
  const formatScore = calculateFormatScore(text);
  
  const totalScore = Math.round(keywordScore + lengthScore + sectionScore + formatScore);
  
  return {
    score: Math.min(totalScore, 100),
    matched: matchedKeywords,
    missing: missingKeywords,
    keywordFrequency,
    totalWords: tokens.length
  };
};

/**
 * Calculate score based on resume sections
 */
const calculateSectionScore = (text) => {
  const sections = [
    'experience', 'education', 'skills', 'summary', 'objective',
    'projects', 'certifications', 'achievements'
  ];
  
  let score = 0;
  const foundSections = [];
  
  sections.forEach(section => {
    const regex = new RegExp(`\\b${section}\\b`, 'i');
    if (regex.test(text)) {
      score += 3;
      foundSections.push(section);
    }
  });
  
  return Math.min(score, 20);
};

/**
 * Calculate score based on formatting indicators
 */
const calculateFormatScore = (text) => {
  let score = 0;
  
  // Check for email
  if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) score += 5;
  
  // Check for phone
  if (/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 5;
  
  // Check for bullet points or organized structure
  if (/[•\-*]/.test(text)) score += 5;
  
  // Check for dates (experience timeline)
  if (/\d{4}|\d{2}\/\d{4}/.test(text)) score += 5;
  
  return Math.min(score, 20);
};

/**
 * Extract skills from resume text
 */
const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  const foundSkills = [];
  
  ATS_KEYWORDS.technical.forEach(skill => {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
};

/**
 * Generate improvement suggestions based on analysis
 */
const generateImprovements = (analysis, text) => {
  const suggestions = [];
  const lowerText = text.toLowerCase();
  
  // Score-based suggestions
  if (analysis.score < 50) {
    suggestions.push('Your resume needs significant improvement to pass ATS systems.');
  }
  
  if (analysis.matched.length < 10) {
    suggestions.push('Add more relevant keywords from your industry and job descriptions.');
  }
  
  // Section-based suggestions
  if (!lowerText.includes('experience')) {
    suggestions.push('Add a clear "Experience" or "Work Experience" section.');
  }
  
  if (!lowerText.includes('skills')) {
    suggestions.push('Include a dedicated "Skills" section with relevant technical and soft skills.');
  }
  
  if (!lowerText.includes('education')) {
    suggestions.push('Add an "Education" section with your academic qualifications.');
  }
  
  // Format suggestions
  if (!/[\w.-]+@[\w.-]+\.\w+/.test(text)) {
    suggestions.push('Include your email address in the contact information.');
  }
  
  if (!/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
    suggestions.push('Add your phone number to make it easy for recruiters to contact you.');
  }
  
  // Content suggestions
  if (analysis.totalWords < 300) {
    suggestions.push('Your resume seems too brief. Add more details about your experience and achievements.');
  } else if (analysis.totalWords > 800) {
    suggestions.push('Your resume might be too long. Try to keep it concise and relevant.');
  }
  
  // Action verb suggestions
  const actionVerbs = ['developed', 'managed', 'led', 'implemented', 'designed'];
  const hasActionVerbs = actionVerbs.some(verb => lowerText.includes(verb));
  
  if (!hasActionVerbs) {
    suggestions.push('Use strong action verbs to describe your achievements (e.g., developed, managed, led, implemented).');
  }
  
  // Quantifiable achievements
  if (!/\d+%|\$\d+|increased|decreased|improved/.test(lowerText)) {
    suggestions.push('Include quantifiable achievements with numbers and percentages to show your impact.');
  }
  
  return suggestions;
};

/**
 * Calculate match score between resume and job
 */
const calculateMatchScore = (resumeKeywords, jobKeywords) => {
  if (!jobKeywords || jobKeywords.length === 0) return 0;
  
  const matchCount = jobKeywords.filter(jk => 
    resumeKeywords.some(rk => rk.toLowerCase().includes(jk.toLowerCase()))
  ).length;
  
  return Math.round((matchCount / jobKeywords.length) * 100);
};

module.exports = {
  calculateATSScore,
  extractSkills,
  generateImprovements,
  calculateMatchScore,
  ATS_KEYWORDS
};
