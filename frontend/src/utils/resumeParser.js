// Frontend Resume Parser Utility
// This parses resume files in the browser without backend

/**
 * Extract text from uploaded file
 * @param {File} file - The uploaded resume file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromFile(file) {
  const fileType = file.name.split('.').pop().toLowerCase();
  
  try {
    switch (fileType) {
      case 'txt':
        return await extractFromTxt(file);
      case 'pdf':
        return await extractFromPdf(file);
      case 'doc':
      case 'docx':
        return await extractFromDoc(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

/**
 * Extract text from TXT file
 */
async function extractFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Extract text from PDF file using pdfjs-dist library
 */
async function extractFromPdf(file) {
  try {
    console.log('📄 Starting PDF extraction for:', file.name);
    
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    
    // Import the worker directly from node_modules
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
    
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    console.log('📦 PDF file size:', arrayBuffer.byteLength, 'bytes');
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log('📚 PDF loaded successfully. Pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with spaces
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
      
      console.log(`📄 Extracted page ${pageNum}: ${pageText.length} chars`);
    }
    
    console.log('✅ PDF extraction complete! Total text length:', fullText.length);
    console.log('📝 Preview:', fullText.substring(0, 200));
    
    if (fullText.length < 100) {
      console.warn('⚠️ WARNING: Extracted text is very short. PDF might be image-based or empty.');
      return `[Limited text extracted from ${file.name}]\n\n${fullText}\n\nNote: If your resume is image-based (scanned), please convert it to text-based PDF or use a TXT file.`;
    }
    
    return fullText;
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extract text from DOC/DOCX file (requires mammoth library)
 * Install: npm install mammoth
 */
async function extractFromDoc(file) {
  try {
    // For now, return a message that DOC parsing needs mammoth
    return `[DOC/DOCX Content from ${file.name}]\nNote: Install mammoth library for full DOC/DOCX parsing.\n\nFor now, please paste the job description manually or use a TXT file.`;
  } catch (error) {
    throw new Error('DOC/DOCX parsing requires mammoth library');
  }
}

/**
 * Extract skills from resume text - ENHANCED VERSION
 * This mimics professional ATS systems by:
 * 1. Finding the SKILLS section specifically
 * 2. Extracting skills from that section
 * 3. Also scanning entire resume as fallback
 * 4. Using comprehensive skill database
 * 
 * @param {string} text - Resume text content
 * @param {string[]} requiredSkills - Skills to look for
 * @returns {Object} - Matched and missing skills
 */
export function extractSkills(text, requiredSkills = []) {
  if (!text || text.length < 10) {
    console.warn('Resume text is too short or empty');
    return { matched: [], missing: requiredSkills };
  }

  const matched = [];
  const missing = [];
  
  console.log('=== 🎯 ADVANCED SKILL EXTRACTION ===');
  console.log('Resume Text Length:', text.length);
  console.log('Required Skills to Find:', requiredSkills);
  console.log('==============================');
  
  // Step 1: Extract the SKILLS section from resume
  const skillsSection = extractSkillsSection(text);
  console.log('📋 Skills Section Found:', skillsSection ? 'YES (' + skillsSection.length + ' chars)' : 'NO - Using full text');
  
  // Step 2: Normalize text for matching
  const primaryText = skillsSection || text; // Use skills section if found, else full text
  const normalizedText = normalizeText(primaryText);
  const fullNormalizedText = normalizeText(text); // Always keep full text as backup
  
  console.log('📝 Primary Search Text Preview:', primaryText.substring(0, 200));
  
  // Step 3: Check each required skill
  requiredSkills.forEach(skill => {
    const skillLower = skill.toLowerCase().trim();
    let found = false;
    let matchedVia = '';
    let matchLocation = '';
    
    // Get all possible variations for this skill
    const variations = getAllSkillVariations(skillLower);
    
    // Try to match in skills section first
    for (const variation of variations) {
      // Method 1: Exact word boundary match (most accurate)
      const wordBoundaryPattern = new RegExp(`\\b${escapeRegex(variation)}\\b`, 'i');
      if (wordBoundaryPattern.test(normalizedText)) {
        found = true;
        matchedVia = variation;
        matchLocation = 'Skills Section';
        break;
      }
      
      // Method 2: Simple includes (for compound terms)
      if (normalizedText.includes(variation.toLowerCase())) {
        found = true;
        matchedVia = variation;
        matchLocation = 'Skills Section';
        break;
      }
    }
    
    // Fallback: Search in full resume if not found in skills section
    if (!found && skillsSection) {
      for (const variation of variations) {
        const wordBoundaryPattern = new RegExp(`\\b${escapeRegex(variation)}\\b`, 'i');
        if (wordBoundaryPattern.test(fullNormalizedText)) {
          found = true;
          matchedVia = variation;
          matchLocation = 'Full Resume';
          break;
        }
        
        if (fullNormalizedText.includes(variation.toLowerCase())) {
          found = true;
          matchedVia = variation;
          matchLocation = 'Full Resume';
          break;
        }
      }
    }
    
    if (found) {
      matched.push(skill);
      console.log(`✅ MATCHED: "${skill}" via "${matchedVia}" in ${matchLocation}`);
    } else {
      missing.push(skill);
      console.log(`❌ MISSING: "${skill}" - tried variations: ${variations.slice(0, 3).join(', ')}...`);
    }
  });
  
  console.log('=== FINAL RESULTS ===');
  console.log('✅ Total Matched Skills:', matched.length, '→', matched);
  console.log('❌ Total Missing Skills:', missing.length, '→', missing);
  console.log('📊 Match Rate:', requiredSkills.length > 0 ? `${Math.round((matched.length / requiredSkills.length) * 100)}%` : 'N/A');
  console.log('====================');
  
  return { matched, missing };
}

/**
 * Extract the SKILLS section from resume
 * Looks for common section headers like "Skills", "Technical Skills", etc.
 */
function extractSkillsSection(text) {
  const lines = text.split('\n');
  let skillsSectionStart = -1;
  let skillsSectionEnd = -1;
  
  // Common skills section headers (from real ATS systems)
  const skillsHeaders = [
    /^skills?$/i,
    /^technical\s+skills?$/i,
    /^core\s+skills?$/i,
    /^key\s+skills?$/i,
    /^professional\s+skills?$/i,
    /^expertise$/i,
    /^competencies$/i,
    /^technologies$/i,
    /^technical\s+competencies$/i,
    /^areas?\s+of\s+expertise$/i,
    /^programming\s+skills?$/i,
    /^software\s+skills?$/i,
  ];
  
  // Common section headers that indicate end of skills section
  const endHeaders = [
    /^experience$/i,
    /^work\s+experience$/i,
    /^professional\s+experience$/i,
    /^employment$/i,
    /^education$/i,
    /^projects?$/i,
    /^certifications?$/i,
    /^awards?$/i,
    /^publications?$/i,
    /^references?$/i,
  ];
  
  // Find skills section start
  for (let i = 0; i < lines.length; i++) {
    const trimmedLine = lines[i].trim();
    for (const pattern of skillsHeaders) {
      if (pattern.test(trimmedLine)) {
        skillsSectionStart = i;
        console.log(`🎯 Found Skills Section at line ${i}: "${trimmedLine}"`);
        break;
      }
    }
    if (skillsSectionStart !== -1) break;
  }
  
  // Find skills section end
  if (skillsSectionStart !== -1) {
    for (let i = skillsSectionStart + 1; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      
      // Check if it's a new section header
      for (const pattern of endHeaders) {
        if (pattern.test(trimmedLine)) {
          skillsSectionEnd = i;
          break;
        }
      }
      
      // Also check if line is ALL CAPS (often indicates new section)
      if (trimmedLine.length > 0 && trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length < 50) {
        skillsSectionEnd = i;
        break;
      }
      
      if (skillsSectionEnd !== -1) break;
    }
    
    // If no end found, take next 15 lines as skills section
    if (skillsSectionEnd === -1) {
      skillsSectionEnd = Math.min(skillsSectionStart + 15, lines.length);
    }
    
    const skillsSection = lines.slice(skillsSectionStart, skillsSectionEnd).join('\n');
    console.log(`📦 Extracted Skills Section (${skillsSection.length} chars):`, skillsSection.substring(0, 200));
    return skillsSection;
  }
  
  console.log('⚠️ No dedicated Skills section found, will search entire resume');
  return null;
}

/**
 * Normalize text for better matching
 */
function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[^\w\s.,-/#]/g, ' ')  // Keep common programming chars
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get ALL possible variations for a skill
 * Based on real ATS systems and job posting patterns
 */
function getAllSkillVariations(skill) {
  // Comprehensive skill database (based on ATS industry standards)
  const skillDatabase = {
    // Programming Languages
    'javascript': ['javascript', 'js', 'java script', 'ecmascript', 'es6', 'es2015', 'es2020'],
    'typescript': ['typescript', 'ts', 'type script'],
    'python': ['python', 'python3', 'py', 'python programming'],
    'java': ['java', 'java programming', 'core java', 'java se', 'java ee'],
    'c++': ['c++', 'cpp', 'c plus plus'],
    'c#': ['c#', 'csharp', 'c sharp', '.net'],
    'php': ['php', 'php programming'],
    'ruby': ['ruby', 'ruby on rails', 'rails'],
    'go': ['go', 'golang', 'go programming'],
    'rust': ['rust', 'rust programming'],
    'swift': ['swift', 'swift programming', 'ios swift'],
    'kotlin': ['kotlin', 'kotlin programming', 'android kotlin'],
    
    // Frontend Frameworks/Libraries
    'react': ['react', 'reactjs', 'react.js', 'react js', 'facebook react'],
    'react.js': ['react', 'reactjs', 'react.js', 'react js'],
    'angular': ['angular', 'angularjs', 'angular.js', 'angular 2+'],
    'vue': ['vue', 'vuejs', 'vue.js', 'vue js'],
    'vue.js': ['vue', 'vuejs', 'vue.js', 'vue js'],
    'svelte': ['svelte', 'sveltejs'],
    'next.js': ['next', 'nextjs', 'next.js', 'next js'],
    'nuxt': ['nuxt', 'nuxtjs', 'nuxt.js'],
    
    // Backend Frameworks
    'node.js': ['node', 'nodejs', 'node.js', 'node js', 'node.js runtime'],
    'express': ['express', 'expressjs', 'express.js', 'express js', 'express framework'],
    'django': ['django', 'django framework', 'django python'],
    'flask': ['flask', 'flask framework', 'flask python'],
    'spring': ['spring', 'spring boot', 'spring framework', 'java spring'],
    'spring boot': ['spring boot', 'springboot', 'spring-boot'],
    '.net': ['.net', 'dotnet', 'dot net', 'asp.net', 'asp net'],
    'laravel': ['laravel', 'laravel framework', 'laravel php'],
    
    // Databases
    'mongodb': ['mongodb', 'mongo', 'mongo db', 'mongo database'],
    'postgresql': ['postgresql', 'postgres', 'psql', 'postgre sql'],
    'mysql': ['mysql', 'my sql', 'mysql database'],
    'sql': ['sql', 'structured query language', 'sql database'],
    'nosql': ['nosql', 'no sql', 'no-sql'],
    'redis': ['redis', 'redis cache', 'redis database'],
    'cassandra': ['cassandra', 'apache cassandra'],
    'dynamodb': ['dynamodb', 'dynamo db', 'aws dynamodb'],
    'firebase': ['firebase', 'google firebase', 'firebase database'],
    
    // Cloud & DevOps
    'aws': ['aws', 'amazon web services', 'amazon aws'],
    'azure': ['azure', 'microsoft azure', 'azure cloud'],
    'gcp': ['gcp', 'google cloud', 'google cloud platform'],
    'google cloud': ['gcp', 'google cloud', 'google cloud platform'],
    'docker': ['docker', 'docker container', 'containerization'],
    'kubernetes': ['kubernetes', 'k8s', 'k-8-s', 'kube'],
    'jenkins': ['jenkins', 'jenkins ci', 'jenkins ci/cd'],
    'ci/cd': ['ci/cd', 'ci cd', 'continuous integration', 'continuous deployment', 'cicd'],
    'terraform': ['terraform', 'terraform iac'],
    'ansible': ['ansible', 'ansible automation'],
    
    // Version Control
    'git': ['git', 'git version control', 'git vcs'],
    'github': ['github', 'git hub', 'github repository'],
    'gitlab': ['gitlab', 'git lab'],
    'bitbucket': ['bitbucket', 'bit bucket'],
    
    // Web Technologies
    'html': ['html', 'html5', 'html 5', 'hypertext markup'],
    'css': ['css', 'css3', 'css 3', 'cascading style'],
    'sass': ['sass', 'scss', 'syntactically awesome'],
    'less': ['less', 'less css'],
    'tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
    'bootstrap': ['bootstrap', 'bootstrap css', 'twitter bootstrap'],
    
    // APIs & Architecture
    'rest': ['rest', 'rest api', 'restful', 'restful api', 'rest architecture'],
    'rest api': ['rest', 'rest api', 'restful', 'restful api'],
    'api': ['api', 'apis', 'application programming interface'],
    'api development': ['api', 'api development', 'rest api', 'api design'],
    'graphql': ['graphql', 'graph ql', 'graphql api'],
    'microservices': ['microservices', 'micro services', 'microservice architecture'],
    'soap': ['soap', 'soap api', 'soap web services'],
    
    // Testing
    'jest': ['jest', 'jest testing', 'jest js'],
    'mocha': ['mocha', 'mochajs', 'mocha testing'],
    'junit': ['junit', 'j unit', 'junit testing'],
    'selenium': ['selenium', 'selenium webdriver', 'selenium automation'],
    'cypress': ['cypress', 'cypress.io', 'cypress testing'],
    
    // Data Science & AI
    'machine learning': ['machine learning', 'ml', 'machine-learning'],
    'deep learning': ['deep learning', 'dl', 'neural networks', 'deep neural'],
    'ai': ['ai', 'artificial intelligence', 'a.i.'],
    'tensorflow': ['tensorflow', 'tensor flow', 'tf'],
    'pytorch': ['pytorch', 'py torch', 'torch'],
    'keras': ['keras', 'keras framework'],
    'pandas': ['pandas', 'pandas library', 'pandas python'],
    'numpy': ['numpy', 'num py', 'numpy library'],
    'scikit-learn': ['scikit-learn', 'sklearn', 'scikit learn'],
    
    // Marketing & Analytics
    'seo': ['seo', 'search engine optimization', 'search optimization'],
    'sem': ['sem', 'search engine marketing'],
    'google analytics': ['google analytics', 'ga', 'analytics', 'google ga'],
    'google ads': ['google ads', 'google adwords', 'adwords'],
    'facebook ads': ['facebook ads', 'fb ads', 'facebook advertising'],
    'content marketing': ['content marketing', 'content strategy'],
    'social media': ['social media', 'social media marketing', 'smm'],
    'email marketing': ['email marketing', 'email campaigns', 'email automation'],
    'ppc': ['ppc', 'pay per click', 'paid advertising'],
    'marketing automation': ['marketing automation', 'automation'],
    
    // Project Management & Methodologies
    'agile': ['agile', 'agile methodology', 'agile development'],
    'scrum': ['scrum', 'scrum methodology', 'scrum framework'],
    'kanban': ['kanban', 'kanban methodology'],
    'jira': ['jira', 'atlassian jira', 'jira software'],
    'confluence': ['confluence', 'atlassian confluence'],
    
    // Design
    'figma': ['figma', 'figma design'],
    'sketch': ['sketch', 'sketch app'],
    'adobe xd': ['adobe xd', 'xd', 'adobe experience design'],
    'photoshop': ['photoshop', 'adobe photoshop', 'ps'],
    'illustrator': ['illustrator', 'adobe illustrator', 'ai'],
    'ui/ux': ['ui/ux', 'ui ux', 'user interface', 'user experience'],
    
    // Mobile Development
    'react native': ['react native', 'react-native', 'reactnative', 'rn'],
    'flutter': ['flutter', 'flutter framework', 'flutter sdk'],
    'ios': ['ios', 'ios development', 'iphone development'],
    'android': ['android', 'android development', 'android studio'],
    
    // Other
    'excel': ['excel', 'microsoft excel', 'ms excel', 'spreadsheet'],
    'powerpoint': ['powerpoint', 'microsoft powerpoint', 'ppt'],
    'word': ['word', 'microsoft word', 'ms word'],
  };
  
  // Check if we have predefined variations
  if (skillDatabase[skill]) {
    return skillDatabase[skill];
  }
  
  // Auto-generate variations for unmapped skills
  const autoVariations = [skill];
  
  // Handle dot notation (e.g., "Node.js")
  if (skill.includes('.')) {
    autoVariations.push(skill.replace(/\./g, ''));
    autoVariations.push(skill.replace(/\./g, ' '));
  }
  
  // Handle spaces (e.g., "REST API")
  if (skill.includes(' ')) {
    autoVariations.push(skill.replace(/ /g, ''));
    autoVariations.push(skill.replace(/ /g, '-'));
    autoVariations.push(skill.replace(/ /g, '_'));
  }
  
  // Handle dashes (e.g., "test-driven")
  if (skill.includes('-')) {
    autoVariations.push(skill.replace(/-/g, ' '));
    autoVariations.push(skill.replace(/-/g, ''));
  }
  
  // Handle slash (e.g., "CI/CD")
  if (skill.includes('/')) {
    autoVariations.push(skill.replace(/\//g, ' '));
    autoVariations.push(skill.replace(/\//g, ''));
  }
  
  return [...new Set(autoVariations)]; // Remove duplicates
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract contact information from resume
 * @param {string} text - Resume text content
 * @returns {Object} - Extracted contact info
 */
export function extractContactInfo(text) {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const linkedinRegex = /(?:linkedin\.com\/in\/)([\w-]+)/i;
  const githubRegex = /(?:github\.com\/)([\w-]+)/i;
  
  return {
    email: text.match(emailRegex)?.[0] || null,
    phone: text.match(phoneRegex)?.[0] || null,
    linkedin: text.match(linkedinRegex)?.[1] || null,
    github: text.match(githubRegex)?.[1] || null,
  };
}

/**
 * Extract years of experience (simple heuristic)
 * @param {string} text - Resume text content
 * @returns {number} - Estimated years of experience
 */
export function extractExperience(text) {
  const experiencePatterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
    /experience:\s*(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*years?\s*in/i,
  ];
  
  for (const pattern of experiencePatterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return 0;
}

/**
 * Extract education level
 * @param {string} text - Resume text content
 * @returns {string} - Highest education level
 */
export function extractEducation(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('phd') || lowerText.includes('ph.d') || lowerText.includes('doctorate')) {
    return 'PhD';
  }
  if (lowerText.includes('master') || lowerText.includes('msc') || lowerText.includes('mba')) {
    return 'Master\'s';
  }
  if (lowerText.includes('bachelor') || lowerText.includes('bsc') || lowerText.includes('b.s') || lowerText.includes('b.a')) {
    return 'Bachelor\'s';
  }
  
  return 'Not specified';
}

/**
 * Calculate comprehensive ATS score
 * @param {string} resumeText - Full resume text
 * @param {string} jobDescription - Job description text
 * @param {string[]} requiredSkills - Required skills for the job
 * @returns {Object} - Detailed scoring breakdown
 */
export function calculateATSScore(resumeText, jobDescription, requiredSkills = []) {
  console.log('🎯 === CALCULATING ATS SCORE ===');
  console.log('Resume Text Length:', resumeText.length);
  console.log('Required Skills Count:', requiredSkills.length);
  
  if (!resumeText || resumeText.length < 50) {
    console.error('❌ Resume text too short or empty!');
    return {
      score: 0,
      matched: [],
      missing: requiredSkills,
      feedback: ['Please upload a valid resume file with content'],
      experience: 0,
      education: 'Not specified',
      contact: {}
    };
  }
  
  // Extract skills
  const { matched, missing } = extractSkills(resumeText, requiredSkills);
  
  console.log('📊 Skill Matching Results:');
  console.log('  - Matched:', matched.length, 'skills');
  console.log('  - Missing:', missing.length, 'skills');
  
  // Calculate base score from skill matching
  let score = requiredSkills.length > 0 
    ? Math.round((matched.length / requiredSkills.length) * 100)
    : 0;
  
  console.log('📈 Base Score (from skills):', score + '%');
  
  // Bonus points for job description keywords
  if (jobDescription && jobDescription.length > 50) {
    const jobKeywords = jobDescription.toLowerCase().split(/\s+/)
      .filter(word => word.length > 4)
      .slice(0, 20);
    
    const keywordMatches = jobKeywords.filter(keyword => 
      resumeText.toLowerCase().includes(keyword)
    ).length;
    
    const keywordBonus = Math.min(15, Math.round((keywordMatches / jobKeywords.length) * 15));
    console.log('📝 Job Description Bonus:', '+' + keywordBonus + '%');
    score = Math.min(100, score + keywordBonus);
  }
  
  // Extract additional info
  const experience = extractExperience(resumeText);
  const education = extractEducation(resumeText);
  const contact = extractContactInfo(resumeText);
  
  console.log('👤 Profile Info:');
  console.log('  - Experience:', experience, 'years');
  console.log('  - Education:', education);
  
  // Bonus for experience
  if (experience > 0) {
    console.log('✨ Experience Bonus: +5%');
    score = Math.min(100, score + 5);
  }
  
  // Bonus for education
  if (education !== 'Not specified') {
    console.log('✨ Education Bonus: +5%');
    score = Math.min(100, score + 5);
  }
  
  console.log('🎯 FINAL CALCULATED SCORE:', score + '%');
  console.log('===============================');
  
  // Generate feedback
  const feedback = generateFeedback(score, matched, missing, experience, education);
  
  const finalScore = Math.max(35, score); // Minimum 35%
  
  if (finalScore === 35 && score < 35) {
    console.warn('⚠️ Score was below 35%, adjusted to minimum: 35%');
  }
  
  return {
    score: finalScore,
    matched,
    missing,
    feedback,
    experience,
    education,
    contact
  };
}

/**
 * Generate actionable feedback
 */
function generateFeedback(score, matched, missing, experience, education) {
  const feedback = [];
  
  if (score >= 80) {
    feedback.push('Excellent! Your resume is well-optimized for this position.');
    feedback.push(`Strong skill matches: ${matched.slice(0, 3).join(', ')}`);
  } else if (score >= 60) {
    feedback.push('Good match! Your resume shows relevant qualifications.');
    if (missing.length > 0) {
      feedback.push(`Consider adding: ${missing.slice(0, 3).join(', ')}`);
    }
  } else {
    feedback.push('Your resume needs optimization for this role.');
    if (missing.length > 0) {
      feedback.push(`Important skills to add: ${missing.slice(0, 3).join(', ')}`);
    }
  }
  
  if (experience === 0) {
    feedback.push('Add your years of experience to strengthen your resume.');
  }
  
  if (education === 'Not specified') {
    feedback.push('Include your educational background.');
  }
  
  if (matched.length > 0) {
    feedback.push('Highlight your expertise in your matched skills throughout your resume.');
  }
  
  return feedback;
}
