const bcrypt = require('bcryptjs');
const db = require('./db');

function seedDatabase() {
  console.log('Seeding TEVIX database...');

  // Clear existing records in proper dependency order
  db.exec(`
    DELETE FROM requests;
    DELETE FROM team_required_roles;
    DELETE FROM team_required_skills;
    DELETE FROM team_requirements;
    DELETE FROM team_members;
    DELETE FROM teams;
    DELETE FROM hackathons;
    DELETE FROM availability;
    DELETE FROM student_roles;
    DELETE FROM roles;
    DELETE FROM student_skills;
    DELETE FROM skills;
    DELETE FROM profiles;
    DELETE FROM users;
  `);

  // 1. Insert Skills
  const skillsList = [
    // Frontend
    { name: 'React', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'HTML/CSS', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    // Backend
    { name: 'Python', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'Flask', category: 'Backend' },
    { name: 'FastAPI', category: 'Backend' },
    { name: 'Java', category: 'Backend' },
    { name: 'C++', category: 'Backend' },
    { name: 'Go', category: 'Backend' },
    // AI/ML
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'Deep Learning', category: 'AI/ML' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'Computer Vision', category: 'AI/ML' },
    { name: 'Natural Language Processing', category: 'AI/ML' },
    { name: 'Data Analysis', category: 'AI/ML' },
    // Database
    { name: 'SQL', category: 'Database' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    // UI/UX
    { name: 'Figma', category: 'UI/UX' },
    { name: 'UI/UX Design', category: 'UI/UX' },
    { name: 'Prototyping', category: 'UI/UX' },
    { name: 'Wireframing', category: 'UI/UX' },
    // Cloud/DevOps
    { name: 'Cloud', category: 'Cloud/DevOps' },
    { name: 'AWS', category: 'Cloud/DevOps' },
    { name: 'Docker', category: 'Cloud/DevOps' },
    { name: 'DevOps', category: 'Cloud/DevOps' },
    { name: 'Kubernetes', category: 'Cloud/DevOps' },
    { name: 'CI/CD', category: 'Cloud/DevOps' },
    // Cybersecurity
    { name: 'Cybersecurity', category: 'Cybersecurity' },
    { name: 'Penetration Testing', category: 'Cybersecurity' },
    { name: 'Network Security', category: 'Cybersecurity' },
    // IoT
    { name: 'IoT', category: 'IoT' },
    { name: 'Arduino', category: 'IoT' },
    { name: 'Embedded C', category: 'IoT' },
    { name: 'Raspberry Pi', category: 'IoT' },
    // Mobile
    { name: 'Flutter', category: 'Mobile' },
    { name: 'React Native', category: 'Mobile' },
    // Soft Skills / Management
    { name: 'Presentation', category: 'Soft Skills' },
    { name: 'Pitching', category: 'Soft Skills' },
    { name: 'Research', category: 'Soft Skills' },
    { name: 'Project Management', category: 'Soft Skills' },
    { name: 'Technical Writing', category: 'Soft Skills' }
  ];

  const insertSkill = db.prepare('INSERT INTO skills (name, category) VALUES (?, ?)');
  const skillIdMap = {};
  for (const s of skillsList) {
    const info = insertSkill.run(s.name, s.category);
    skillIdMap[s.name] = info.lastInsertRowid;
  }

  // 2. Insert Roles
  const rolesList = [
    { name: 'Frontend Developer', category: 'Engineering' },
    { name: 'Backend Developer', category: 'Engineering' },
    { name: 'Full Stack Developer', category: 'Engineering' },
    { name: 'AI/ML Engineer', category: 'AI/Data' },
    { name: 'Data Analyst', category: 'AI/Data' },
    { name: 'Data Scientist', category: 'AI/Data' },
    { name: 'UI/UX Designer', category: 'Design' },
    { name: 'Mobile Developer', category: 'Engineering' },
    { name: 'Cloud/DevOps Engineer', category: 'Infrastructure' },
    { name: 'Cybersecurity Engineer', category: 'Security' },
    { name: 'IoT Developer', category: 'Hardware' },
    { name: 'Researcher', category: 'Research' },
    { name: 'Presenter', category: 'Communication' },
    { name: 'Project Manager', category: 'Management' }
  ];

  const insertRole = db.prepare('INSERT INTO roles (name, category) VALUES (?, ?)');
  const roleIdMap = {};
  for (const r of rolesList) {
    const info = insertRole.run(r.name, r.category);
    roleIdMap[r.name] = info.lastInsertRowid;
  }

  // 3. Insert Hackathons
  const hackathons = [
    {
      name: 'Smart India Hackathon (SIH 2026)',
      description: 'Nationwide initiative to provide students a platform to solve pressing problems of society, ministries and industries.',
      category: 'Smart Automation & AI',
      start_date: '2026-10-15',
      end_date: '2026-10-17',
      team_size_min: 3,
      team_size_max: 6
    },
    {
      name: 'HackMIT Global 2026',
      description: 'One of the world premier collegiate hackathons focusing on groundbreaking AI and distributed computing projects.',
      category: 'AI & Innovation',
      start_date: '2026-11-01',
      end_date: '2026-11-03',
      team_size_min: 2,
      team_size_max: 4
    },
    {
      name: 'ETHIndia Web3 & Security',
      description: 'Asia largest Web3 hackathon building verifiable credentials, decentralized storage and trustless systems.',
      category: 'Web3 & Security',
      start_date: '2026-11-20',
      end_date: '2026-11-22',
      team_size_min: 2,
      team_size_max: 4
    },
    {
      name: 'NASA Space Apps Challenge 2026',
      description: 'International hackathon for scientists, designers and storytellers to solve problems using NASA open data.',
      category: 'Space & Climate Tech',
      start_date: '2026-10-25',
      end_date: '2026-10-27',
      team_size_min: 2,
      team_size_max: 5
    }
  ];

  const insertHackathon = db.prepare(`
    INSERT INTO hackathons (name, description, category, start_date, end_date, team_size_min, team_size_max)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const hackathonIds = [];
  for (const h of hackathons) {
    const info = insertHackathon.run(h.name, h.description, h.category, h.start_date, h.end_date, h.team_size_min, h.team_size_max);
    hackathonIds.push(info.lastInsertRowid);
  }

  // 4. Default password hash for all seed users: 'password123'
  const passwordHash = bcrypt.hashSync('password123', 10);

  // 5. Seed 21 Realistic Students
  const students = [
    // DEMO TEAM MEMBERS:
    {
      email: 'arjun@tevix.dev',
      fullName: 'Arjun Kumar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      department: 'CSE',
      year: 3,
      gender: 'Male',
      contactPref: 'Email',
      experienceLevel: 'Advanced',
      hackathonsCount: 3,
      githubUrl: 'https://github.com/arjun-dev',
      linkedinUrl: 'https://linkedin.com/in/arjun-kumar',
      bio: 'Frontend enthusiast obsessed with snappy UIs, React component design, and micro-interactions.',
      roles: ['Frontend Developer'],
      skills: [
        { name: 'React', prof: 'Expert' },
        { name: 'JavaScript', prof: 'Advanced' },
        { name: 'HTML/CSS', prof: 'Advanced' },
        { name: 'Tailwind CSS', prof: 'Expert' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 20 }
    },
    {
      email: 'priya@tevix.dev',
      fullName: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      department: 'IT',
      year: 3,
      gender: 'Female',
      contactPref: 'LinkedIn',
      experienceLevel: 'Intermediate',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/priyaui',
      linkedinUrl: 'https://linkedin.com/in/priya-sharma',
      bio: 'Passionate UI/UX designer who turns complex architectures into intuitive, accessible user flows.',
      roles: ['UI/UX Designer', 'Researcher'],
      skills: [
        { name: 'Figma', prof: 'Expert' },
        { name: 'UI/UX Design', prof: 'Expert' },
        { name: 'Prototyping', prof: 'Advanced' },
        { name: 'Wireframing', prof: 'Advanced' },
        { name: 'Research', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Afternoon, Evening', hours: 15 }
    },
    {
      email: 'rahul@tevix.dev',
      fullName: 'Rahul Kumar',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      department: 'CSE',
      year: 3,
      gender: 'Male',
      contactPref: 'Email',
      experienceLevel: 'Intermediate',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/rahul-pm',
      linkedinUrl: 'https://linkedin.com/in/rahul-kumar',
      bio: 'Tech storyteller, market researcher and presentation specialist. Winning hackathon pitches is my craft.',
      roles: ['Presenter', 'Researcher', 'Project Manager'],
      skills: [
        { name: 'Presentation', prof: 'Expert' },
        { name: 'Pitching', prof: 'Expert' },
        { name: 'Research', prof: 'Advanced' },
        { name: 'Project Management', prof: 'Advanced' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 16 }
    },

    // CANDIDATES:
    // Star Candidate 1: Kavin Raj (Fills Backend & Database gaps)
    {
      email: 'kavin@tevix.dev',
      fullName: 'Kavin Raj',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      department: 'CSE',
      year: 2,
      gender: 'Male',
      contactPref: 'GitHub',
      experienceLevel: 'Advanced',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/kavinraj-backend',
      linkedinUrl: 'https://linkedin.com/in/kavin-raj',
      bio: 'High-throughput backend engineer. Loving REST APIs, database indexing, Python, and async Node pipelines.',
      roles: ['Backend Developer'],
      skills: [
        { name: 'Python', prof: 'Advanced' },
        { name: 'Node.js', prof: 'Advanced' },
        { name: 'SQL', prof: 'Expert' },
        { name: 'Flask', prof: 'Intermediate' },
        { name: 'PostgreSQL', prof: 'Advanced' },
        { name: 'Express', prof: 'Advanced' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 18 }
    },
    // Star Candidate 2: Divya Menon (Fills AI/ML & Python gap)
    {
      email: 'divya@tevix.dev',
      fullName: 'Divya Menon',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      department: 'AI & DS',
      year: 3,
      gender: 'Female',
      contactPref: 'Email',
      experienceLevel: 'Advanced',
      hackathonsCount: 4,
      githubUrl: 'https://github.com/divya-ml',
      linkedinUrl: 'https://linkedin.com/in/divya-menon-ai',
      bio: 'Machine learning practitioner specializing in computer vision, PyTorch model deployment, and predictive pipelines.',
      roles: ['AI/ML Engineer', 'Data Scientist'],
      skills: [
        { name: 'Python', prof: 'Expert' },
        { name: 'Machine Learning', prof: 'Expert' },
        { name: 'TensorFlow', prof: 'Advanced' },
        { name: 'PyTorch', prof: 'Advanced' },
        { name: 'SQL', prof: 'Intermediate' },
        { name: 'Computer Vision', prof: 'Advanced' }
      ],
      availability: { days: 'All Days', timeSlots: 'Evening, Night', hours: 22 }
    },
    // Candidate 3: Sanjay Kumar (IoT / Hardware)
    {
      email: 'sanjay@ece.dev',
      fullName: 'Sanjay Kumar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      department: 'ECE',
      year: 3,
      gender: 'Male',
      contactPref: 'Email',
      experienceLevel: 'Intermediate',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/sanjay-iot',
      linkedinUrl: 'https://linkedin.com/in/sanjay-kumar-ece',
      bio: 'Hardware hacker bridging physical sensors with cloud telemetry using ESP32, Arduino and Embedded C.',
      roles: ['IoT Developer'],
      skills: [
        { name: 'IoT', prof: 'Expert' },
        { name: 'Arduino', prof: 'Expert' },
        { name: 'Embedded C', prof: 'Advanced' },
        { name: 'C++', prof: 'Intermediate' },
        { name: 'Raspberry Pi', prof: 'Advanced' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Morning, Afternoon', hours: 14 }
    },
    // Candidate 4: Ananya Rao (Full Stack)
    {
      email: 'ananya@tevix.dev',
      fullName: 'Ananya Rao',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      department: 'CSE',
      year: 2,
      gender: 'Female',
      contactPref: 'GitHub',
      experienceLevel: 'Intermediate',
      hackathonsCount: 1,
      githubUrl: 'https://github.com/ananya-fullstack',
      linkedinUrl: 'https://linkedin.com/in/ananya-rao',
      bio: 'Full stack builder with MERN stack experience. Quick to prototype MVPs and build full end-to-end flows.',
      roles: ['Full Stack Developer', 'Backend Developer'],
      skills: [
        { name: 'JavaScript', prof: 'Advanced' },
        { name: 'React', prof: 'Intermediate' },
        { name: 'Node.js', prof: 'Advanced' },
        { name: 'MongoDB', prof: 'Advanced' },
        { name: 'Express', prof: 'Advanced' }
      ],
      availability: { days: 'Weekdays', timeSlots: 'Evening', hours: 12 }
    },
    // Candidate 5: Rohan Mehta (Cybersecurity)
    {
      email: 'rohan@tevix.dev',
      fullName: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      department: 'CSE',
      year: 4,
      gender: 'Male',
      contactPref: 'LinkedIn',
      experienceLevel: 'Expert',
      hackathonsCount: 5,
      githubUrl: 'https://github.com/rohan-sec',
      linkedinUrl: 'https://linkedin.com/in/rohan-mehta-sec',
      bio: 'Security researcher and ethical hacker. Focused on secure API design, JWT auth hardening, and vulnerability assessments.',
      roles: ['Cybersecurity Engineer'],
      skills: [
        { name: 'Cybersecurity', prof: 'Expert' },
        { name: 'Penetration Testing', prof: 'Expert' },
        { name: 'Network Security', prof: 'Advanced' },
        { name: 'Python', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Night', hours: 16 }
    },
    // Candidate 6: Sneha Patel (Mobile App)
    {
      email: 'sneha@patel.dev',
      fullName: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      department: 'IT',
      year: 2,
      gender: 'Female',
      contactPref: 'Email',
      experienceLevel: 'Intermediate',
      hackathonsCount: 1,
      githubUrl: 'https://github.com/sneha-flutter',
      linkedinUrl: 'https://linkedin.com/in/sneha-patel',
      bio: 'Cross-platform mobile developer building smooth 60fps experiences in Flutter and Dart.',
      roles: ['Mobile Developer'],
      skills: [
        { name: 'Flutter', prof: 'Expert' },
        { name: 'React Native', prof: 'Intermediate' },
        { name: 'Firebase', prof: 'Intermediate' },
        { name: 'UI/UX Design', prof: 'Beginner' }
      ],
      availability: { days: 'All Days', timeSlots: 'Afternoon, Evening', hours: 18 }
    },
    // Candidate 7: Aditya Verma (Data Analyst)
    {
      email: 'aditya@verma.dev',
      fullName: 'Aditya Verma',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      department: 'AI & DS',
      year: 2,
      gender: 'Male',
      contactPref: 'LinkedIn',
      experienceLevel: 'Intermediate',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/aditya-analytics',
      linkedinUrl: 'https://linkedin.com/in/aditya-verma',
      bio: 'Data insights enthusiast skilled in pandas, exploratory data analysis, and dashboard generation.',
      roles: ['Data Analyst'],
      skills: [
        { name: 'Python', prof: 'Advanced' },
        { name: 'SQL', prof: 'Advanced' },
        { name: 'Data Analysis', prof: 'Expert' },
        { name: 'Machine Learning', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Morning, Evening', hours: 15 }
    },
    // Candidate 8: Meera Krishnan (Cloud / DevOps)
    {
      email: 'meera@krishnan.dev',
      fullName: 'Meera Krishnan',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      department: 'CSE',
      year: 3,
      gender: 'Female',
      contactPref: 'GitHub',
      experienceLevel: 'Advanced',
      hackathonsCount: 3,
      githubUrl: 'https://github.com/meera-cloud',
      linkedinUrl: 'https://linkedin.com/in/meera-krishnan',
      bio: 'Infrastructure and containerization specialist. Docker, AWS Lambda, microservices and automated CI/CD pipelines.',
      roles: ['Cloud/DevOps Engineer', 'Backend Developer'],
      skills: [
        { name: 'Cloud', prof: 'Expert' },
        { name: 'AWS', prof: 'Advanced' },
        { name: 'Docker', prof: 'Expert' },
        { name: 'DevOps', prof: 'Advanced' },
        { name: 'CI/CD', prof: 'Advanced' },
        { name: 'Node.js', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 20 }
    },
    // Candidate 9: Vikram Malhotra (Robotics / IoT)
    {
      email: 'vikram@malhotra.dev',
      fullName: 'Vikram Malhotra',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      department: 'ECE',
      year: 3,
      gender: 'Male',
      contactPref: 'Email',
      experienceLevel: 'Intermediate',
      hackathonsCount: 1,
      githubUrl: 'https://github.com/vikram-robotics',
      linkedinUrl: 'https://linkedin.com/in/vikram-malhotra',
      bio: 'Robotics and embedded systems builder. Loves microcontrollers, sensor fusion and autonomous logic.',
      roles: ['IoT Developer'],
      skills: [
        { name: 'IoT', prof: 'Advanced' },
        { name: 'Raspberry Pi', prof: 'Expert' },
        { name: 'Embedded C', prof: 'Intermediate' },
        { name: 'Python', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekdays', timeSlots: 'Morning, Afternoon', hours: 10 }
    },
    // Candidate 10: Pooja Joshi (Redundant Frontend Profile - to prove complementarity ranking!)
    {
      email: 'pooja@joshi.dev',
      fullName: 'Pooja Joshi',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
      department: 'CSE',
      year: 2,
      gender: 'Female',
      contactPref: 'LinkedIn',
      experienceLevel: 'Intermediate',
      hackathonsCount: 1,
      githubUrl: 'https://github.com/pooja-frontend',
      linkedinUrl: 'https://linkedin.com/in/pooja-joshi',
      bio: 'Frontend developer specializing purely in React, JavaScript, and Tailwind CSS animations.',
      roles: ['Frontend Developer'],
      skills: [
        { name: 'React', prof: 'Advanced' },
        { name: 'JavaScript', prof: 'Advanced' },
        { name: 'Tailwind CSS', prof: 'Advanced' },
        { name: 'HTML/CSS', prof: 'Expert' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening', hours: 12 }
    },
    // Candidate 11: Tanvi Nair (AI/ML & NLP specialist)
    {
      email: 'tanvi@nair.dev',
      fullName: 'Tanvi Nair',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      department: 'AI & DS',
      year: 4,
      gender: 'Female',
      contactPref: 'Email',
      experienceLevel: 'Expert',
      hackathonsCount: 4,
      githubUrl: 'https://github.com/tanvi-nlp',
      linkedinUrl: 'https://linkedin.com/in/tanvi-nair',
      bio: 'NLP researcher with expertise in LLM fine-tuning, retrieval-augmented generation and PyTorch neural pipelines.',
      roles: ['AI/ML Engineer', 'Researcher'],
      skills: [
        { name: 'Natural Language Processing', prof: 'Expert' },
        { name: 'Machine Learning', prof: 'Expert' },
        { name: 'PyTorch', prof: 'Expert' },
        { name: 'Python', prof: 'Expert' },
        { name: 'FastAPI', prof: 'Advanced' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 18 }
    },
    // Candidate 12: Karthik Subramanian (High-Performance Backend)
    {
      email: 'karthik@tevix.dev',
      fullName: 'Karthik Subramanian',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      department: 'CSE',
      year: 3,
      gender: 'Male',
      contactPref: 'GitHub',
      experienceLevel: 'Advanced',
      hackathonsCount: 3,
      githubUrl: 'https://github.com/karthik-sub',
      linkedinUrl: 'https://linkedin.com/in/karthik-sub',
      bio: 'Distributed backend systems engineer working with Go, Node.js microservices and Redis caching.',
      roles: ['Backend Developer', 'Cloud/DevOps Engineer'],
      skills: [
        { name: 'Go', prof: 'Advanced' },
        { name: 'Node.js', prof: 'Expert' },
        { name: 'PostgreSQL', prof: 'Expert' },
        { name: 'Docker', prof: 'Advanced' },
        { name: 'Redis', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 20 }
    },
    // Candidate 13: Ritu Agarwal (Redundant Design Profile)
    {
      email: 'ritu@agarwal.dev',
      fullName: 'Ritu Agarwal',
      avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150',
      department: 'IT',
      year: 3,
      gender: 'Female',
      contactPref: 'LinkedIn',
      experienceLevel: 'Intermediate',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/ritu-design',
      linkedinUrl: 'https://linkedin.com/in/ritu-agarwal',
      bio: 'Figma and wireframing specialist creating visual design design systems.',
      roles: ['UI/UX Designer'],
      skills: [
        { name: 'Figma', prof: 'Advanced' },
        { name: 'UI/UX Design', prof: 'Advanced' },
        { name: 'Prototyping', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening', hours: 14 }
    },
    // Candidate 14: Siddharth Rao (Full Stack Architect)
    {
      email: 'siddharth@rao.dev',
      fullName: 'Siddharth Rao',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      department: 'CSE',
      year: 4,
      gender: 'Male',
      contactPref: 'Email',
      experienceLevel: 'Expert',
      hackathonsCount: 5,
      githubUrl: 'https://github.com/sid-rao',
      linkedinUrl: 'https://linkedin.com/in/siddharth-rao',
      bio: 'Full stack product engineer. Experience launching production React + FastAPI apps in under 36 hours.',
      roles: ['Full Stack Developer', 'Backend Developer'],
      skills: [
        { name: 'Next.js', prof: 'Expert' },
        { name: 'FastAPI', prof: 'Expert' },
        { name: 'Python', prof: 'Advanced' },
        { name: 'PostgreSQL', prof: 'Advanced' },
        { name: 'Docker', prof: 'Intermediate' }
      ],
      availability: { days: 'All Days', timeSlots: 'Night', hours: 25 }
    },
    // Candidate 15: Neha Gupta (Data Scientist)
    {
      email: 'neha@gupta.dev',
      fullName: 'Neha Gupta',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      department: 'AI & DS',
      year: 2,
      gender: 'Female',
      contactPref: 'Email',
      experienceLevel: 'Intermediate',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/neha-ds',
      linkedinUrl: 'https://linkedin.com/in/neha-gupta-ds',
      bio: 'Data science explorer focused on tabular datasets, scikit-learn models and statistical experimentation.',
      roles: ['Data Scientist', 'AI/ML Engineer'],
      skills: [
        { name: 'Python', prof: 'Advanced' },
        { name: 'Machine Learning', prof: 'Advanced' },
        { name: 'SQL', prof: 'Intermediate' },
        { name: 'Data Analysis', prof: 'Expert' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Afternoon, Evening', hours: 16 }
    },
    // Candidate 16: Varun Chawla (IoT Embedded)
    {
      email: 'varun@chawla.dev',
      fullName: 'Varun Chawla',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      department: 'ECE',
      year: 2,
      gender: 'Male',
      contactPref: 'Email',
      experienceLevel: 'Intermediate',
      hackathonsCount: 1,
      githubUrl: 'https://github.com/varun-hardware',
      linkedinUrl: 'https://linkedin.com/in/varun-chawla',
      bio: 'Embedded C programmer working with ARM microcontrollers, sensors, and telemetry bridges.',
      roles: ['IoT Developer'],
      skills: [
        { name: 'Arduino', prof: 'Advanced' },
        { name: 'Embedded C', prof: 'Advanced' },
        { name: 'C++', prof: 'Intermediate' },
        { name: 'IoT', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekdays', timeSlots: 'Evening', hours: 12 }
    },
    // Candidate 17: Ishaan Sen (Cybersecurity / Network)
    {
      email: 'ishaan@sen.dev',
      fullName: 'Ishaan Sen',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      department: 'CSE',
      year: 3,
      gender: 'Male',
      contactPref: 'GitHub',
      experienceLevel: 'Intermediate',
      hackathonsCount: 2,
      githubUrl: 'https://github.com/ishaan-netsec',
      linkedinUrl: 'https://linkedin.com/in/ishaan-sen',
      bio: 'Network defense and ethical hacking enthusiast. Focused on zero-trust architectures and telemetry validation.',
      roles: ['Cybersecurity Engineer'],
      skills: [
        { name: 'Cybersecurity', prof: 'Advanced' },
        { name: 'Network Security', prof: 'Advanced' },
        { name: 'Python', prof: 'Intermediate' },
        { name: 'Penetration Testing', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Morning, Evening', hours: 15 }
    },
    // Candidate 18: Kavya Nambiar (Cloud Architect)
    {
      email: 'kavya@nambiar.dev',
      fullName: 'Kavya Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      department: 'IT',
      year: 4,
      gender: 'Female',
      contactPref: 'LinkedIn',
      experienceLevel: 'Expert',
      hackathonsCount: 4,
      githubUrl: 'https://github.com/kavya-cloud',
      linkedinUrl: 'https://linkedin.com/in/kavya-nambiar',
      bio: 'Cloud solution architect certified in AWS and Azure. Experienced deploying resilient multi-tier apps.',
      roles: ['Cloud/DevOps Engineer'],
      skills: [
        { name: 'Cloud', prof: 'Expert' },
        { name: 'AWS', prof: 'Expert' },
        { name: 'Docker', prof: 'Advanced' },
        { name: 'Kubernetes', prof: 'Intermediate' },
        { name: 'CI/CD', prof: 'Advanced' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 18 }
    },
    // Candidate 19: Aarav Sharma (Beginner / Low Match)
    {
      email: 'aarav@sharma.dev',
      fullName: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      department: 'Mechanical',
      year: 1,
      gender: 'Male',
      contactPref: 'Email',
      experienceLevel: 'Beginner',
      hackathonsCount: 0,
      githubUrl: 'https://github.com/aarav-freshman',
      linkedinUrl: 'https://linkedin.com/in/aarav-sharma-mech',
      bio: 'First year engineering student curious about basic web design and learning fundamentals of HTML and CSS.',
      roles: ['Frontend Developer'],
      skills: [
        { name: 'HTML/CSS', prof: 'Beginner' },
        { name: 'JavaScript', prof: 'Beginner' }
      ],
      availability: { days: 'Weekdays', timeSlots: 'Morning', hours: 8 }
    },
    // Candidate 20: Deepak Varma (Mobile App Specialist)
    {
      email: 'deepak@varma.dev',
      fullName: 'Deepak Varma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      department: 'IT',
      year: 3,
      gender: 'Male',
      contactPref: 'GitHub',
      experienceLevel: 'Advanced',
      hackathonsCount: 3,
      githubUrl: 'https://github.com/deepak-mobile',
      linkedinUrl: 'https://linkedin.com/in/deepak-varma',
      bio: 'Full lifecycle mobile engineer with React Native and Flutter experience building polished offline-first mobile apps.',
      roles: ['Mobile Developer', 'Frontend Developer'],
      skills: [
        { name: 'React Native', prof: 'Expert' },
        { name: 'Flutter', prof: 'Advanced' },
        { name: 'TypeScript', prof: 'Advanced' },
        { name: 'React', prof: 'Intermediate' }
      ],
      availability: { days: 'Weekends', timeSlots: 'Evening, Night', hours: 16 }
    },
    // Candidate 21: Shreya Mukherjee (AI Researcher)
    {
      email: 'shreya@mukherjee.dev',
      fullName: 'Shreya Mukherjee',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      department: 'AI & DS',
      year: 3,
      gender: 'Female',
      contactPref: 'LinkedIn',
      experienceLevel: 'Advanced',
      hackathonsCount: 3,
      githubUrl: 'https://github.com/shreya-ai',
      linkedinUrl: 'https://linkedin.com/in/shreya-mukherjee',
      bio: 'AI researcher focused on explainable AI, computer vision and automated diagnostics.',
      roles: ['AI/ML Engineer', 'Researcher'],
      skills: [
        { name: 'Machine Learning', prof: 'Expert' },
        { name: 'Deep Learning', prof: 'Expert' },
        { name: 'Python', prof: 'Expert' },
        { name: 'Computer Vision', prof: 'Advanced' },
        { name: 'Research', prof: 'Expert' }
      ],
      availability: { days: 'All Days', timeSlots: 'Evening, Night', hours: 22 }
    }
  ];

  const insertUser = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
  const insertProfile = db.prepare(`
    INSERT INTO profiles (
      user_id, full_name, avatar_url, department, year, gender,
      contact_preference, experience_level, hackathons_count, github_url, linkedin_url, bio
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertStudentSkill = db.prepare('INSERT INTO student_skills (profile_id, skill_id, proficiency) VALUES (?, ?, ?)');
  const insertStudentRole = db.prepare('INSERT INTO student_roles (profile_id, role_id, is_primary) VALUES (?, ?, ?)');
  const insertAvailability = db.prepare('INSERT INTO availability (profile_id, days, time_slots, hours_per_week) VALUES (?, ?, ?, ?)');

  const profileMap = {}; // email -> profile_id

  for (const s of students) {
    const userRes = insertUser.run(s.email, passwordHash);
    const userId = userRes.lastInsertRowid;

    const profRes = insertProfile.run(
      userId,
      s.fullName,
      s.avatar,
      s.department,
      s.year,
      s.gender,
      s.contactPref,
      s.experienceLevel,
      s.hackathonsCount,
      s.githubUrl,
      s.linkedinUrl,
      s.bio
    );
    const profileId = profRes.lastInsertRowid;
    profileMap[s.email] = profileId;

    // Skills
    for (const sk of s.skills) {
      const skillId = skillIdMap[sk.name];
      if (skillId) {
        insertStudentSkill.run(profileId, skillId, sk.prof);
      }
    }

    // Roles
    let isFirstRole = 1;
    for (const rn of s.roles) {
      const roleId = roleIdMap[rn];
      if (roleId) {
        insertStudentRole.run(profileId, roleId, isFirstRole);
        isFirstRole = 0;
      }
    }

    // Availability
    insertAvailability.run(profileId, s.availability.days, s.availability.timeSlots, s.availability.hours);
  }

  // 6. Create Demo Team: "Team Quantum Leap"
  // Leader: Arjun Kumar (Frontend)
  // Members: Priya Sharma (UI/UX), Rahul Kumar (Presentation/PM)
  // Missing: Backend, AI/ML, Database
  const sihId = hackathonIds[0];
  const arjunProfId = profileMap['arjun@tevix.dev'];
  const priyaProfId = profileMap['priya@tevix.dev'];
  const rahulProfId = profileMap['rahul@tevix.dev'];

  const insertTeam = db.prepare(`
    INSERT INTO teams (leader_id, hackathon_id, name, description, max_size, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const demoTeamRes = insertTeam.run(
    arjunProfId,
    sihId,
    'Team Quantum Leap',
    'Building an intelligent healthcare diagnostics and resource allocation engine for SIH 2026.',
    5,
    'forming'
  );
  const demoTeamId = demoTeamRes.lastInsertRowid;

  // Insert Team Members
  const insertTeamMember = db.prepare('INSERT INTO team_members (team_id, profile_id, role_in_team) VALUES (?, ?, ?)');
  insertTeamMember.run(demoTeamId, arjunProfId, 'Team Leader & Frontend Developer');
  insertTeamMember.run(demoTeamId, priyaProfId, 'UI/UX Designer & Product Researcher');
  insertTeamMember.run(demoTeamId, rahulProfId, 'Presenter & Project Manager');

  // Insert Team Requirements
  const insertRequirements = db.prepare(`
    INSERT INTO team_requirements (
      team_id, department_preference, gender_requirement, experience_requirement, preferred_availability, notes
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertRequirements.run(
    demoTeamId,
    'CSE or AI & DS',
    'Any',
    'Intermediate or Advanced',
    'Weekends & Evenings',
    'We urgently need a skilled Backend engineer (Python/Node/SQL) and an AI/ML developer to train and deploy our diagnostics models.'
  );

  // Required skills for the team
  const insertTeamReqSkill = db.prepare('INSERT INTO team_required_skills (team_id, skill_id) VALUES (?, ?)');
  insertTeamReqSkill.run(demoTeamId, skillIdMap['Python']);
  insertTeamReqSkill.run(demoTeamId, skillIdMap['SQL']);
  insertTeamReqSkill.run(demoTeamId, skillIdMap['Machine Learning']);
  insertTeamReqSkill.run(demoTeamId, skillIdMap['Node.js']);

  // Required roles for the team
  const insertTeamReqRole = db.prepare('INSERT INTO team_required_roles (team_id, role_id) VALUES (?, ?)');
  insertTeamReqRole.run(demoTeamId, roleIdMap['Backend Developer']);
  insertTeamReqRole.run(demoTeamId, roleIdMap['AI/ML Engineer']);

  // 7. Seed Example Requests
  const insertRequest = db.prepare(`
    INSERT INTO requests (team_id, sender_profile_id, receiver_profile_id, request_type, status, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Outgoing invite from Team Quantum Leap to Kavin Raj
  const kavinProfId = profileMap['kavin@tevix.dev'];
  insertRequest.run(
    demoTeamId,
    arjunProfId,
    kavinProfId,
    'team_invite',
    'pending',
    'Hi Kavin! We saw your strong Backend and SQL skills. Our SIH team is ready with UI and presentation, and your server architecture is the exact missing piece!'
  );

  // Incoming join request from Ananya Rao to Team Quantum Leap
  const ananyaProfId = profileMap['ananya@tevix.dev'];
  insertRequest.run(
    demoTeamId,
    ananyaProfId,
    arjunProfId,
    'join_request',
    'pending',
    'Hey Arjun, I would love to contribute full-stack capabilities to Team Quantum Leap for SIH 2026!'
  );

  console.log('Database seeded successfully!');
  console.log(`Created ${students.length} students, 1 demo team with 3 members, requirements, and requests.`);
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
