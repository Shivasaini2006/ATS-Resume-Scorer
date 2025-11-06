// Job-specific keywords for ATS matching (client-side mirror of backend)
export const jobKeywords = {
  'Software Engineer': {
    required: ['JavaScript', 'Python', 'Java', 'C++', 'programming', 'software development', 'algorithms', 'data structures'],
    preferred: ['React', 'Node.js', 'SQL', 'Git', 'API', 'testing', 'debugging', 'agile', 'REST', 'TypeScript'],
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'problem solving', 'teamwork']
  },
  'Digital Marketing Manager': {
    required: ['marketing', 'digital marketing', 'SEO', 'content strategy', 'campaign management'],
    preferred: ['Google Analytics', 'PPC', 'social media', 'email marketing', 'conversion optimization', 'A/B testing', 'marketing automation'],
    skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'PPC', 'campaign management', 'data analysis']
  },
  'Data Scientist': {
    required: ['Python', 'R', 'machine learning', 'statistics', 'data analysis', 'modeling'],
    preferred: ['SQL', 'TensorFlow', 'PyTorch', 'scikit-learn', 'pandas', 'numpy', 'data visualization', 'big data', 'Spark'],
    skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'data modeling', 'analytical thinking']
  },
  'Product Manager': {
    required: ['product management', 'product strategy', 'roadmap', 'stakeholder management', 'user research'],
    preferred: ['Agile', 'Scrum', 'JIRA', 'analytics', 'A/B testing', 'user stories', 'prioritization', 'market research'],
    skills: ['Product Strategy', 'Agile', 'User Research', 'Roadmap Planning', 'Analytics', 'communication', 'leadership']
  },
  'UI/UX Designer': {
    required: ['UI design', 'UX design', 'user experience', 'wireframing', 'prototyping', 'user research'],
    preferred: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'user testing', 'design systems', 'responsive design', 'accessibility'],
    skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'visual design', 'empathy']
  },
  'Full Stack Developer': {
    required: ['full stack', 'frontend', 'backend', 'web development', 'JavaScript', 'database'],
    preferred: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'REST API', 'Git', 'responsive design', 'cloud'],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'API development', 'problem solving']
  },
  'DevOps Engineer': {
    required: ['DevOps', 'CI/CD', 'automation', 'infrastructure', 'deployment', 'monitoring'],
    preferred: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform', 'Linux', 'scripting', 'Git'],
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'automation', 'troubleshooting']
  },
  'SEO Specialist': {
    required: ['SEO', 'search engine optimization', 'keyword research', 'on-page SEO', 'off-page SEO'],
    preferred: ['Google Analytics', 'Google Search Console', 'link building', 'technical SEO', 'content optimization', 'competitor analysis'],
    skills: ['Google Analytics', 'Keyword Research', 'Link Building', 'Content Optimization', 'Technical SEO', 'analytical thinking']
  },
  'Content Marketing Manager': {
    required: ['content marketing', 'content strategy', 'content creation', 'copywriting', 'editorial'],
    preferred: ['SEO', 'analytics', 'social media', 'blog management', 'email marketing', 'content calendar', 'storytelling'],
    skills: ['Content Strategy', 'SEO', 'Copywriting', 'Analytics', 'Social Media', 'creativity', 'communication']
  },
  'Business Analyst': {
    required: ['business analysis', 'requirements gathering', 'process improvement', 'stakeholder management', 'documentation'],
    preferred: ['SQL', 'data analysis', 'Excel', 'process mapping', 'JIRA', 'Agile', 'reporting', 'UAT'],
    skills: ['SQL', 'Data Analysis', 'Requirements Gathering', 'Process Mapping', 'Excel', 'analytical thinking', 'communication']
  },
  'Frontend Developer': {
    required: ['frontend', 'HTML', 'CSS', 'JavaScript', 'responsive design', 'web development'],
    preferred: ['React', 'Vue', 'Angular', 'TypeScript', 'Sass', 'Webpack', 'Git', 'REST API', 'UI/UX'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'responsive design', 'problem solving']
  },
  'Backend Developer': {
    required: ['backend', 'server-side', 'API', 'database', 'programming'],
    preferred: ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'REST', 'microservices', 'cloud', 'security'],
    skills: ['Node.js', 'Python', 'SQL', 'API development', 'database design', 'problem solving']
  },
  'Mobile Developer': {
    required: ['mobile development', 'iOS', 'Android', 'mobile app', 'UI'],
    preferred: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'API integration', 'testing', 'app store'],
    skills: ['React Native', 'Flutter', 'mobile UI', 'API integration', 'problem solving']
  },
  'Machine Learning Engineer': {
    required: ['machine learning', 'deep learning', 'neural networks', 'AI', 'Python'],
    preferred: ['TensorFlow', 'PyTorch', 'scikit-learn', 'NLP', 'computer vision', 'model deployment', 'data preprocessing'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'machine learning', 'mathematics', 'research']
  },
  'Cloud Engineer': {
    required: ['cloud', 'AWS', 'Azure', 'GCP', 'cloud infrastructure', 'architecture'],
    preferred: ['Terraform', 'CloudFormation', 'serverless', 'containers', 'networking', 'security', 'automation'],
    skills: ['AWS', 'Azure', 'Terraform', 'cloud architecture', 'automation', 'troubleshooting']
  },
  'QA Engineer': {
    required: ['QA', 'quality assurance', 'testing', 'test cases', 'bug tracking'],
    preferred: ['automation testing', 'Selenium', 'JIRA', 'test planning', 'regression testing', 'API testing', 'performance testing'],
    skills: ['testing', 'automation', 'Selenium', 'JIRA', 'attention to detail', 'analytical thinking']
  },
  'Graphic Designer': {
    required: ['graphic design', 'visual design', 'creative design', 'branding'],
    preferred: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'typography', 'color theory', 'layout design', 'print design'],
    skills: ['Adobe Photoshop', 'Illustrator', 'visual communication', 'creativity', 'typography']
  },
  'Project Manager': {
    required: ['project management', 'planning', 'scheduling', 'budget management', 'team leadership'],
    preferred: ['PMP', 'Agile', 'Scrum', 'MS Project', 'JIRA', 'risk management', 'stakeholder communication'],
    skills: ['project planning', 'Agile', 'leadership', 'communication', 'problem solving']
  },
  'Sales Manager': {
    required: ['sales', 'sales management', 'revenue growth', 'client relations', 'team leadership'],
    preferred: ['CRM', 'Salesforce', 'sales strategy', 'forecasting', 'negotiation', 'pipeline management'],
    skills: ['sales strategy', 'CRM', 'negotiation', 'leadership', 'communication']
  },
  'HR Manager': {
    required: ['HR', 'human resources', 'recruitment', 'employee relations', 'talent management'],
    preferred: ['HRIS', 'performance management', 'onboarding', 'compensation', 'compliance', 'training'],
    skills: ['recruitment', 'employee relations', 'HRIS', 'communication', 'problem solving']
  }
};
