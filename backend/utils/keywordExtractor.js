// Keyword extractor utility
exports.extract = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Convert to lowercase and remove special characters
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');

  // Split into words
  const words = cleanText.split(/\s+/).filter(word => word.length > 2);

  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
    'its', 'may', 'now', 'old', 'see', 'time', 'way', 'who', 'will', 'with',
    'this', 'that', 'from', 'have', 'they', 'been', 'were', 'what', 'when',
    'where', 'which', 'while', 'would', 'there', 'their', 'about', 'after',
    'before', 'being', 'during', 'under', 'through', 'between', 'also'
  ]);

  // Count word frequency
  const wordFreq = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  // Sort by frequency and get top keywords
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(entry => entry[0]);

  // Also extract common technical terms and skills
  const technicalTerms = extractTechnicalTerms(text);
  
  // Combine and deduplicate
  const allKeywords = [...new Set([...keywords, ...technicalTerms])];

  return allKeywords;
};

// Helper to extract common technical terms (multi-word)
function extractTechnicalTerms(text) {
  const terms = [
    'machine learning', 'artificial intelligence', 'data science', 
    'web development', 'software engineering', 'project management',
    'business analysis', 'data analysis', 'cloud computing', 'devops',
    'full stack', 'front end', 'back end', 'database management',
    'user experience', 'user interface', 'mobile development',
    'quality assurance', 'test automation', 'continuous integration',
    'agile methodology', 'scrum master', 'product management',
    'digital marketing', 'content creation', 'social media',
    'customer service', 'sales management', 'financial analysis'
  ];

  const lowerText = text.toLowerCase();
  const found = [];

  terms.forEach(term => {
    if (lowerText.includes(term)) {
      found.push(term);
    }
  });

  return found;
}
