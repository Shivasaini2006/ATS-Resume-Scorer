const axios = require('axios');

/**
 * Search for jobs using JSearch API
 */
const searchJobs = async (query, location = '', numPages = 1) => {
  try {
    const options = {
      method: 'GET',
      url: `https://${process.env.JSEARCH_API_HOST}/search`,
      params: {
        query: query,
        page: '1',
        num_pages: numPages.toString(),
        date_posted: 'all'
      },
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': process.env.JSEARCH_API_HOST
      }
    };

    if (location) {
      options.params.location = location;
    }

    const response = await axios.request(options);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching jobs from JSearch:', error.message);
    // Return mock data if API fails
    return getMockJobs(query);
  }
};

/**
 * Get job details by ID
 */
const getJobDetails = async (jobId) => {
  try {
    const options = {
      method: 'GET',
      url: `https://${process.env.JSEARCH_API_HOST}/job-details`,
      params: {
        job_id: jobId
      },
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': process.env.JSEARCH_API_HOST
      }
    };

    const response = await axios.request(options);
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error fetching job details:', error.message);
    return null;
  }
};

/**
 * Mock jobs for development/testing
 */
const getMockJobs = (query) => {
  return [
    {
      job_id: 'mock_1',
      job_title: `${query} Developer`,
      employer_name: 'Tech Corp',
      employer_logo: null,
      job_city: 'San Francisco',
      job_state: 'CA',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_description: `We are seeking a talented ${query} developer to join our team. Requirements include strong programming skills, problem-solving abilities, and experience with modern development tools.`,
      job_apply_link: 'https://example.com/apply',
      job_posted_at_datetime_utc: new Date().toISOString(),
      job_required_skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      job_min_salary: 80000,
      job_max_salary: 120000
    },
    {
      job_id: 'mock_2',
      job_title: `Senior ${query} Engineer`,
      employer_name: 'Innovation Labs',
      employer_logo: null,
      job_city: 'New York',
      job_state: 'NY',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_description: `Looking for an experienced ${query} engineer with 5+ years of experience. Must have expertise in full-stack development and cloud technologies.`,
      job_apply_link: 'https://example.com/apply',
      job_posted_at_datetime_utc: new Date().toISOString(),
      job_required_skills: ['Python', 'AWS', 'Docker', 'Kubernetes'],
      job_min_salary: 100000,
      job_max_salary: 150000
    },
    {
      job_id: 'mock_3',
      job_title: `${query} Specialist`,
      employer_name: 'Digital Solutions Inc',
      employer_logo: null,
      job_city: 'Austin',
      job_state: 'TX',
      job_country: 'US',
      job_employment_type: 'FULLTIME',
      job_description: `Join our growing team as a ${query} specialist. Opportunity to work on cutting-edge projects with modern technologies.`,
      job_apply_link: 'https://example.com/apply',
      job_posted_at_datetime_utc: new Date().toISOString(),
      job_required_skills: ['Java', 'Spring Boot', 'MySQL', 'REST API'],
      job_min_salary: 75000,
      job_max_salary: 110000
    }
  ];
};

module.exports = {
  searchJobs,
  getJobDetails,
  getMockJobs
};
