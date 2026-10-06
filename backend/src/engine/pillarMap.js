// 11 Core Pillars for Team DNA and Capability Assessment
const PILLARS = {
  'Frontend': {
    name: 'Frontend',
    skills: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML/CSS', 'Vue.js'],
    roles: ['Frontend Developer', 'Full Stack Developer']
  },
  'Backend': {
    name: 'Backend',
    skills: ['Python', 'Node.js', 'Express', 'Flask', 'FastAPI', 'Java', 'C++', 'Go'],
    roles: ['Backend Developer', 'Full Stack Developer']
  },
  'AI/ML': {
    name: 'AI/ML',
    skills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Computer Vision', 'Natural Language Processing', 'Data Analysis'],
    roles: ['AI/ML Engineer', 'Data Scientist', 'Data Analyst']
  },
  'Database': {
    name: 'Database',
    skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis'],
    roles: ['Backend Developer', 'Full Stack Developer']
  },
  'UI/UX': {
    name: 'UI/UX',
    skills: ['Figma', 'UI/UX Design', 'Prototyping', 'Wireframing'],
    roles: ['UI/UX Designer']
  },
  'Cloud': {
    name: 'Cloud',
    skills: ['Cloud', 'AWS', 'Docker', 'DevOps', 'Kubernetes', 'CI/CD'],
    roles: ['Cloud/DevOps Engineer']
  },
  'Cybersecurity': {
    name: 'Cybersecurity',
    skills: ['Cybersecurity', 'Penetration Testing', 'Network Security'],
    roles: ['Cybersecurity Engineer']
  },
  'IoT': {
    name: 'IoT',
    skills: ['IoT', 'Arduino', 'Embedded C', 'Raspberry Pi'],
    roles: ['IoT Developer']
  },
  'Research': {
    name: 'Research',
    skills: ['Research', 'Data Analysis', 'Technical Writing'],
    roles: ['Researcher', 'Data Analyst']
  },
  'Presentation': {
    name: 'Presentation',
    skills: ['Presentation', 'Pitching'],
    roles: ['Presenter']
  },
  'Leadership': {
    name: 'Leadership',
    skills: ['Project Management'],
    roles: ['Project Manager']
  }
};

const PROFICIENCY_SCORES = {
  'Beginner': 25,
  'Intermediate': 60,
  'Advanced': 85,
  'Expert': 100
};

module.exports = {
  PILLARS,
  PROFICIENCY_SCORES
};
