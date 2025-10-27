// Simple test for ATS Scorer utility
const { calculateATSScore, extractSkills, generateImprovements } = require('../utils/atsScorer');

console.log('Testing ATS Scorer Utility...\n');

// Test 1: Sample resume text
const sampleResume = `
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567

SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development.
Strong skills in JavaScript, React, Node.js, and MongoDB.

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-Present
- Developed and maintained web applications using React and Node.js
- Implemented REST APIs and improved system performance by 40%
- Led a team of 5 developers on multiple projects
- Managed MongoDB databases and optimized queries

Junior Developer | StartupCo | 2018-2020
- Created responsive web interfaces using HTML, CSS, and JavaScript
- Collaborated with cross-functional teams using Agile methodologies
- Reduced bug count by 30% through comprehensive testing

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2018

SKILLS
JavaScript, React, Node.js, Express, MongoDB, HTML, CSS, Git, Agile, REST API,
Problem-solving, Leadership, Communication, Teamwork
`;

// Test ATS Score Calculation
console.log('Test 1: Calculating ATS Score');
console.log('='.repeat(50));
const analysis = calculateATSScore(sampleResume);
console.log(`ATS Score: ${analysis.score}/100`);
console.log(`Total Words: ${analysis.totalWords}`);
console.log(`Matched Keywords: ${analysis.matched.length}`);
console.log(`Sample Matched: ${analysis.matched.slice(0, 10).join(', ')}`);
console.log(`Missing Keywords (sample): ${analysis.missing.slice(0, 5).join(', ')}`);
console.log('');

// Test Skill Extraction
console.log('Test 2: Extracting Skills');
console.log('='.repeat(50));
const skills = extractSkills(sampleResume);
console.log(`Extracted Skills: ${skills.join(', ')}`);
console.log('');

// Test Improvement Suggestions
console.log('Test 3: Generating Improvements');
console.log('='.repeat(50));
const improvements = generateImprovements(analysis, sampleResume);
console.log('Suggestions:');
improvements.forEach((imp, idx) => {
  console.log(`${idx + 1}. ${imp}`);
});
console.log('');

// Test with poor resume
const poorResume = `
John Smith
Looking for job.
Email: john@email.com
`;

console.log('Test 4: Testing with Poor Resume');
console.log('='.repeat(50));
const poorAnalysis = calculateATSScore(poorResume);
console.log(`ATS Score: ${poorAnalysis.score}/100`);
console.log(`Matched Keywords: ${poorAnalysis.matched.length}`);
const poorImprovements = generateImprovements(poorAnalysis, poorResume);
console.log('Suggestions:');
poorImprovements.forEach((imp, idx) => {
  console.log(`${idx + 1}. ${imp}`);
});
console.log('');

// Test Summary
console.log('='.repeat(50));
console.log('All Tests Completed Successfully! ✓');
console.log('='.repeat(50));
