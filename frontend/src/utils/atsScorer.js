// Client-side ATS scoring utility that matches backend logic
import { jobKeywords } from '../data/jobKeywords';

// Extract keywords from text
function extractKeywords(text) {
  if (!text) return [];
  
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  return [...new Set(words)]; // Remove duplicates
}

// Get job-specific keywords
function getJobKeywords(jobTitle) {
  const keywords = jobKeywords[jobTitle];
  if (keywords) {
    return {
      required: keywords.required.map(k => k.toLowerCase()),
      preferred: keywords.preferred.map(k => k.toLowerCase()),
      skills: keywords.skills.map(k => k.toLowerCase()),
      all: [...keywords.required, ...keywords.preferred, ...keywords.skills].map(k => k.toLowerCase())
    };
  }
  
  // Return generic keywords if job not found
  return {
    required: ['experience', 'skills', 'education', 'work', 'team'],
    preferred: ['communication', 'problem solving', 'leadership', 'analytical', 'organized'],
    skills: ['communication', 'teamwork', 'problem solving'],
    all: ['experience', 'skills', 'education', 'work', 'team', 'communication', 'problem solving', 'leadership', 'analytical', 'organized']
  };
}

// Main scoring function
export function calculateATSScore(resumeText, jobDescription, jobTitle = null) {
  if (!resumeText) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ['Please provide resume text'],
      requiredMatched: 0,
      requiredTotal: 0
    };
  }

  // Extract keywords from resume
  const resumeKeywords = extractKeywords(resumeText);
  const resumeText_lower = resumeText.toLowerCase();

  let jobKeywordsList = [];
  let requiredKeywords = [];
  let preferredKeywords = [];
  
  // If job title is provided, use job-specific keywords
  if (jobTitle) {
    const jobKeywordData = getJobKeywords(jobTitle);
    requiredKeywords = jobKeywordData.required;
    preferredKeywords = jobKeywordData.preferred;
    jobKeywordsList = [...requiredKeywords, ...preferredKeywords];
  } 
  // Otherwise extract from job description
  else if (jobDescription) {
    jobKeywordsList = extractKeywords(jobDescription);
  } else {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ['Please provide either job title or job description'],
      requiredMatched: 0,
      requiredTotal: 0
    };
  }

  // Find matched and missing keywords (case-insensitive)
  const matchedKeywords = [];
  const missingKeywords = [];
  const matchedRequired = [];
  const missedRequired = [];

  jobKeywordsList.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const isMatched = resumeKeywords.some(rk => rk.includes(keywordLower) || keywordLower.includes(rk)) || 
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
    const matchPercentage = jobKeywordsList.length > 0 
      ? (matchedKeywords.length / jobKeywordsList.length) * 100 
      : 0;
    score = Math.round(matchPercentage);
  }

  // Bonus points for having more keywords than required
  if (resumeKeywords.length > jobKeywordsList.length && score < 95) {
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
    totalJobKeywords: jobKeywordsList.length,
    totalResumeKeywords: resumeKeywords.length,
    requiredMatched: matchedRequired.length,
    requiredTotal: requiredKeywords.length,
    jobTitle: jobTitle || 'Generic'
  };
}

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
