// Job matching utility
exports.match = (resumeKeywords, jobs, skills = []) => {
  if (!resumeKeywords || !Array.isArray(resumeKeywords) || resumeKeywords.length === 0) {
    return [];
  }

  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
    return [];
  }

  // Score each job based on keyword match
  const scoredJobs = jobs.map(job => {
    let matchScore = 0;
    const matchedKeywords = [];
    const jobKeywords = [...(job.keywords || []), ...(job.skills || [])];

    // Check keyword matches
    jobKeywords.forEach(jobKeyword => {
      if (resumeKeywords.some(rk => 
        rk.toLowerCase() === jobKeyword.toLowerCase() ||
        rk.toLowerCase().includes(jobKeyword.toLowerCase()) ||
        jobKeyword.toLowerCase().includes(rk.toLowerCase())
      )) {
        matchScore += 10;
        matchedKeywords.push(jobKeyword);
      }
    });

    // Bonus for skill matches
    if (skills && skills.length > 0) {
      (job.skills || []).forEach(jobSkill => {
        if (skills.some(s => s.toLowerCase() === jobSkill.toLowerCase())) {
          matchScore += 15; // Skills are more valuable
          if (!matchedKeywords.includes(jobSkill)) {
            matchedKeywords.push(jobSkill);
          }
        }
      });
    }

    // Calculate percentage match
    const totalPossibleKeywords = jobKeywords.length || 1;
    const matchPercentage = Math.min(100, Math.round((matchedKeywords.length / totalPossibleKeywords) * 100));

    return {
      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        applicationUrl: job.applicationUrl,
        postedAt: job.postedAt
      },
      matchScore,
      matchPercentage,
      matchedKeywords: matchedKeywords.slice(0, 10), // Top 10 matches
      totalJobKeywords: jobKeywords.length
    };
  });

  // Sort by match score (descending) and return top matches
  const sortedMatches = scoredJobs
    .filter(match => match.matchScore > 0) // Only include jobs with at least one match
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 20); // Top 20 matches

  return sortedMatches;
};
