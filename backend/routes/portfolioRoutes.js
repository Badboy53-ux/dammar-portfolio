import express from 'express'

const router = express.Router()

const portfolioSeed = {
  source: 'backend',
  projects: [
    {
      id: 1,
      title: 'Portfolio Platform',
      category: 'Full-Stack Projects',
      image: '/images/project.jpg',
      description: 'A full-stack portfolio platform with user-friendly interfaces and scalable backend architecture.',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MySQL'],
      github: '#',
      live: '#',
      featured: true,
    },
    {
      id: 2,
      title: 'Business Website',
      category: 'Web Development',
      image: '/images/duringsetup.jpg',
      description: 'Responsive business website focused on clear branding, content structure and conversion-oriented layout.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
      github: '#',
      live: '#',
      featured: true,
    },
    {
      id: 3,
      title: 'College Event Portal',
      category: 'College Projects',
      image: '/images/duringwork.png',
      description: 'Academic project portal for managing event information, registrations and announcements.',
      technologies: ['React.js', 'Node.js', 'MySQL'],
      github: '#',
      live: '#',
      featured: false,
    },
  ],
  skillGroups: [
    { title: 'Frontend', skills: ['React.js', 'JavaScript', 'CSS3', 'Responsive UI', 'Accessibility', 'Vite'] },
    { title: 'Backend', skills: ['Node.js', 'Express.js', 'REST API', 'MySQL', 'Authentication', 'Architecture'] },
    { title: 'Core Skills', skills: ['Problem Solving', 'Database Design', 'Optimization', 'Debugging', 'Networking', 'Testing'] },
    { title: 'Tools', skills: ['Git', 'Figma', 'Postman', 'VS Code', 'Linux', 'Swagger'] },
  ],
  services: [
    { icon: '⚡', title: 'Full-Stack Development', description: 'Build polished web applications from concept to deployment with scalable architecture.' },
    { icon: '🧩', title: 'Website Design', description: 'Design responsive, conversion-ready interfaces that communicate trust and clarity.' },
    { icon: '🗄️', title: 'Database Solutions', description: 'Create efficient database-backed solutions for content, reporting and application data.' },
  ],
  experience: [
    {
      type: 'Professional Experience',
      title: 'Software Engineer / Developer',
      period: '2024 - Present',
      description: 'Developing software solutions and practical web experiences with a modern engineering mindset.',
      highlights: ['Built user-focused applications', 'Worked with full-stack architecture', 'Improved code quality and maintainability'],
    },
  ],
  education: [
    {
      institution: 'Your University',
      program: 'B.E. / B.Tech / Related Degree',
      field: 'Computer Science / IT / Engineering',
      startYear: '2021',
      endYear: '2025',
      description: 'Focused on software engineering, problem-solving and systems development.',
      academicProjects: ['Web Application Projects', 'Database Projects', 'System Design Work'],
      achievements: ['Top performer', 'Academic learning', 'Project-based growth'],
    },
  ],
  certifications: [
    {
      name: 'Certificate of Appreciation',
      issuingOrganization: 'Nepalgunj Technical College',
      date: '2024',
      credentialId: 'N/A',
      image: '/images/certificate.jpg',
      file: '/images/certificate.jpg',
      verificationLink: '#',
    },
  ],
  collegeProjects: [
    {
      title: 'Academic Project System',
      subject: 'Software Engineering',
      semester: 'Semester 6',
      description: 'A project management and learning support system built for academic workflows.',
      technologies: ['React.js', 'Node.js', 'MySQL'],
      contribution: 'Designed frontend, backend and database interactions.',
      github: '#',
      demo: '#',
      documentation: '#',
    },
  ],
  websites: [
    {
      name: 'Business Showcase Website',
      image: '/images/duringwork.png',
      purpose: 'Marketing and brand representation',
      role: 'Frontend + design + development',
      technologies: ['React', 'CSS', 'Responsive Design'],
      details: 'Built to present services, trust signals and conversion-focused content clearly.',
      live: '#',
      github: '#',
    },
  ],
  nationalProjects: [
    {
      name: 'Digital Service Initiative',
      organization: 'Community / Client / Organization',
      problemSolved: 'Needed a modern digital presence and workflow support.',
      solution: 'Built a digital system with clear information architecture and user experience.',
      role: 'Developer and technical contributor',
      impact: 'Improved access to information and digital engagement.',
      technologies: ['React', 'Node.js', 'MySQL'],
      live: '#',
      github: '#',
      documentation: '#',
    },
  ],
  fullStackFlow: ['Frontend', 'API Layer', 'Database', 'Deployment'],
  programmingLanguages: [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'SQL', level: 'Advanced' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'C / Java', level: 'Intermediate' },
  ],
}

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: portfolioSeed,
    message: 'Portfolio data loaded successfully.',
  })
})

export default router
