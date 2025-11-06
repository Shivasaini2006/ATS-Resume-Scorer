const keywordExtractor = require('./keywordExtractor');
const { getJobKeywords } = require('../data/jobKeywords');

// ATS scoring utility - Enhanced to support job-specific matching
exports.score = (resumeText, jobDescription, jobTitle = null) => {
  if (!resumeText) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ['Please provide resume text']
    };
  }

  // Extract keywords from resume
  const resumeKeywords = keywordExtractor.extract(resumeText);
  const resumeText_lower = resumeText.toLowerCase();

  let jobKeywords = [];
  let requiredKeywords = [];
  let preferredKeywords = [];
  
  // If job title is provided, use job-specific keywords
  if (jobTitle) {
    const jobKeywordData = getJobKeywords(jobTitle);
    requiredKeywords = jobKeywordData.required.map(k => k.toLowerCase());
    preferredKeywords = jobKeywordData.preferred.map(k => k.toLowerCase());
    jobKeywords = [...requiredKeywords, ...preferredKeywords];
  } 
  // Otherwise extract from job description
  else if (jobDescription) {
    jobKeywords = keywordExtractor.extract(jobDescription);
  } else {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ['Please provide either job title or job description']
    };
  }

  // Find matched and missing keywords (case-insensitive)
  const matchedKeywords = [];
  const missingKeywords = [];
  const matchedRequired = [];
  const missedRequired = [];

  jobKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const isMatched = resumeKeywords.some(rk => rk.toLowerCase().includes(keywordLower)) || 
                      resumeText_lower.includes(keywordLower);
    
    if (isMatched) {
      matchedKeywords.push(keyword);
      if (requiredKeywords.includes(keywordLower)) {
        matchedRequired.push(keyword);
      }
    } else {
      missingKeywords.push(keyword);
      if (requiredKeywords.includes(keywordLower)) {
        missedRequired.push(keyword);
      }
    }
  });

  // Calculate score (0-100) with weighted scoring
  let score = 0;
  
  if (jobTitle && requiredKeywords.length > 0) {
    // Weighted scoring for job-specific matching
    const requiredScore = (matchedRequired.length / requiredKeywords.length) * 70; // 70% weight for required
    const preferredScore = preferredKeywords.length > 0 
      ? ((matchedKeywords.length - matchedRequired.length) / preferredKeywords.length) * 30 // 30% weight for preferred
      : 0;
    score = Math.round(requiredScore + preferredScore);
  } else {
    // Standard scoring for job description matching
    const matchPercentage = jobKeywords.length > 0 
      ? (matchedKeywords.length / jobKeywords.length) * 100 
      : 0;
    score = Math.round(matchPercentage);
  }

  // Bonus points for having more keywords than required
  if (resumeKeywords.length > jobKeywords.length && score < 95) {
    score = Math.min(100, score + 5);
  }

  // Penalty for missing critical required keywords
  if (jobTitle && missedRequired.length > 0) {
    score = Math.max(0, score - (missedRequired.length * 2));
  }

  // Generate suggestions
  const suggestions = generateSuggestions(matchedKeywords, missingKeywords, score, jobTitle, missedRequired);

  return {
    score,
    matchedKeywords: matchedKeywords.slice(0, 20), // Top 20 matches
    missingKeywords: missingKeywords.slice(0, 15), // Top 15 missing
    suggestions,
    totalJobKeywords: jobKeywords.length,
    totalResumeKeywords: resumeKeywords.length,
    requiredMatched: matchedRequired.length,
    requiredTotal: requiredKeywords.length,
    jobTitle: jobTitle || 'Generic'
  };
};

// Generate helpful suggestions
function generateSuggestions(matched, missing, score, jobTitle, missedRequired) {
  const suggestions = [];

  if (jobTitle) {
    suggestions.push(`📌 Matching for: ${jobTitle}`);
  }

  if (score < 40) {
    suggestions.push('⚠️ Your resume needs significant improvement to match this job.');
    if (missedRequired && missedRequired.length > 0) {
      suggestions.push(`🔴 Critical: Missing required skills - ${missedRequired.slice(0, 3).join(', ')}`);
    }
    suggestions.push('💡 Consider adding more relevant keywords from the job description.');
  } else if (score < 70) {
    suggestions.push('⚡ Your resume is somewhat aligned with the job requirements.');
    if (missedRequired && missedRequired.length > 0) {
      suggestions.push(`🟡 Important: Add these required skills - ${missedRequired.slice(0, 3).join(', ')}`);
    }
    suggestions.push('📈 Adding the missing keywords could significantly improve your chances.');
  } else if (score < 85) {
    suggestions.push('✅ Your resume is well-aligned with this job!');
    if (matched.length > 5) {
      suggestions.push(`💪 Strong matches found: ${matched.slice(0, 5).join(', ')}`);
    }
    suggestions.push('🎯 Consider highlighting these matched skills prominently.');
  } else {
    suggestions.push('🌟 Excellent match! Your resume is highly compatible with this job.');
    suggestions.push('🏆 You have strong keyword alignment - great work!');
    if (matched.length > 5) {
      suggestions.push(`✨ Top skills: ${matched.slice(0, 5).join(', ')}`);
    }
  }

  if (missing.length > 0 && score < 85) {
    const topMissing = missing.slice(0, 5).join(', ');
    suggestions.push(`📝 Consider adding: ${topMissing}`);
  }

  return suggestions;
}
