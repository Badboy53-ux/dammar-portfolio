import { useEffect, useMemo, useState } from 'react'
import './App.css'
import profile from './config/profile'
import projects from './data/projects'
import skillGroups, { fullStackFlow, programmingLanguages } from './data/skills'
import services from './data/services'
import experience from './data/experience'
import education from './data/education'
import certifications from './data/certifications'
import collegeProjects from './data/collegeProjects'
import websites from './data/websites'
import nationalProjects from './data/nationalProjects'
import { submitContactForm } from './services/contactService'
import { getDataHealth, loadPortfolioData } from './services/portfolioService'

const fallbackPortfolio = {
  projects,
  skillGroups,
  services,
  experience,
  education,
  certifications,
  collegeProjects,
  websites,
  nationalProjects,
  fullStackFlow,
  programmingLanguages,
}

const socialLinks = [
  { label: 'GitHub', href: profile.github, icon: 'GH' },
  { label: 'LinkedIn', href: profile.linkedin, icon: 'in' },
  { label: 'Facebook', href: profile.facebook, icon: 'f' },
  { label: 'Instagram', href: profile.instagram, icon: 'ig' },
  { label: 'TikTok', href: profile.tiktok, icon: 'tk' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: '@' },
]

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function Button({ children, variant = 'primary', href, className = '', ...props }) {
  const classes = `btn btn-${variant} ${className}`.trim()

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  )
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState('dark')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [progress, setProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [toast, setToast] = useState('')
  const [copyState, setCopyState] = useState('')
  const [expandedProjectId, setExpandedProjectId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [portfolio, setPortfolio] = useState(fallbackPortfolio)

  const adminMetrics = useMemo(() => getDataHealth(portfolio), [portfolio])
  const syncStatusText = portfolio.source === 'backend' ? 'API sync active' : 'Local data ready'

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
      setProgress(nextProgress)
      setShowBackToTop(window.scrollY > 500)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const nextData = await loadPortfolioData()
        if (nextData && Object.keys(nextData).length) {
          setPortfolio({ ...fallbackPortfolio, ...nextData, source: nextData.source || 'backend' })
        }
      } catch (error) {
        console.warn('Falling back to local portfolio data.', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  useEffect(() => {
    const handlePathChange = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePathChange)
    return () => window.removeEventListener('popstate', handlePathChange)
  }, [])

  const projectList = portfolio.projects ?? projects
  const skillList = portfolio.skillGroups ?? skillGroups
  const servicesList = portfolio.services ?? services
  const experienceList = portfolio.experience ?? experience
  const educationList = portfolio.education ?? education
  const certificationList = portfolio.certifications ?? certifications
  const collegeList = portfolio.collegeProjects ?? collegeProjects
  const websiteList = portfolio.websites ?? websites
  const nationalList = portfolio.nationalProjects ?? nationalProjects
  const fullStackList = portfolio.fullStackFlow ?? fullStackFlow
  const languageList = portfolio.programmingLanguages ?? programmingLanguages
  const availableProjectFilters = ['All', ...new Set(projectList.map((project) => project.category))]

  const filteredProjects = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return projectList.filter((project) => {
      const matchesFilter = activeFilter === 'All' || project.category === activeFilter
      const matchesSearch =
        !search ||
        [project.title, project.category, project.description, project.technologies.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(search)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchTerm, projectList])

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setFormErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) errors.name = 'Name is required.'
    if (!formData.email.trim()) errors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email.'
    if (!formData.subject.trim()) errors.subject = 'Subject is required.'
    if (!formData.message.trim()) errors.message = 'Message is required.'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      setToast('Please review the highlighted fields.')
      return
    }

    const response = await submitContactForm(formData)
    setToast(response.message || 'Message sent successfully.')
    setFormData(initialForm)
    setFormErrors({})
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState('Copied!')
      setToast('Email copied to clipboard.')
    } catch {
      setCopyState('Copy failed')
      setToast('Unable to copy email automatically.')
    }
  }

  const isNotFound = currentPath !== '/' && currentPath !== ''

  if (isNotFound) {
    return <NotFoundPage />
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {isLoading ? (
        <div className="loader" aria-live="polite" aria-busy="true">
          <div className="loader-ring" />
        </div>
      ) : null}

      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home">
            <span className="brand-mark">
              <img src="/images/myl.jpg" alt="Dammar B.K." />
            </span>
            <span className="brand-text">DAMMAR B.K.</span>
          </a>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav-menu ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {profile.navItems.map((item) => {
              const sectionId = item.toLowerCase().replace(/\s+/g, '-')
              return (
                <a key={item} href={`#${sectionId}`} onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </a>
              )
            })}

            <div className="nav-actions">
              <button
                type="button"
                className="icon-button"
                onClick={() => setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))}
                aria-label="Toggle light and dark mode"
              >
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
              <Button href="#contact" className="nav-button">
                Hire Me
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="intro-line">{profile.intro}</p>
              <h1>{profile.title}</h1>
              <p className="hero-role">{profile.professionalTitle}</p>
              <p className="hero-tagline">{profile.tagline}</p>
              <p className="hero-bio">{profile.bio}</p>

              <div className="hero-actions">
                <Button href="#projects">View My Projects</Button>
                <Button href={profile.cv} variant="secondary" target="_blank" rel="noreferrer" download="Dammar-BK-CV.html">
                  Download CV
                </Button>
                <Button href="#contact" variant="ghost">Hire Me</Button>
                <Button href="#contact" variant="secondary">Contact Me</Button>
              </div>

              <div className="social-row" aria-label="Social links">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={`social-link social-${link.label.toLowerCase()}`} aria-label={`Open ${link.label}`} title={`Open ${link.label}`}>
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </section>

        <section id="about" className="section">
          <div className="container about-grid">
            <div className="about-content">
              <SectionHeading eyebrow="About Me" title="About Me" subtitle="Software Engineer • Full-Stack Developer • Technology Enthusiast" />
              <p>{profile.about}</p>

              <div className="info-blocks">
                <div>
                  <h3>Who I Am</h3>
                  <p>I am Dammar B.K., a software engineer focused on problem-solving, modern web development and digital systems.</p>
                </div>
                <div>
                  <h3>What I Do</h3>
                  <p>I build responsive web applications, APIs, interfaces and database-driven solutions for real-world needs.</p>
                </div>
                <div>
                  <h3>What I’m Interested In</h3>
                  <p>Software development, full-stack engineering, networking, databases, multimedia technology and practical innovation.</p>
                </div>
                <div>
                  <h3>My Approach</h3>
                  <p>I focus on clean architecture, performance, maintainability and user-centered design while solving meaningful problems.</p>
                </div>
                <div>
                  <h3>My Career Goal</h3>
                  <p>{profile.careerGoal}</p>
                </div>
              </div>

              <div className="stat-grid">
                {[
                  { value: `${projectList.length}+`, label: 'Projects Completed' },
                  { value: `${skillList.reduce((total, group) => total + (group.skills?.length ?? 0), 0)}+`, label: 'Skills & Tools' },
                  { value: `${collegeList.length}+`, label: 'College Projects' },
                  { value: `${websiteList.length}+`, label: 'Websites Developed' },
                ].map((item) => (
                  <div key={item.label} className="stat-card">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section alt-section">
          <div className="container">
            <SectionHeading eyebrow="My Skills" title="Skills & Technologies" subtitle="Focused on engineering, product thinking and practical implementation." />

            <div className="skill-groups">
              {skillList.map((group) => (
                <div key={group.title} className="skill-group">
                  <h3>{group.title}</h3>
                  <div className="chip-list">
                    {group.skills.map((skill) => (
                      <span key={skill} className="chip">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="tech-stack-panel">
              <div className="stack-header">
                <h3>Full-Stack Development</h3>
              </div>
              <div className="stack-flow" aria-label="Full-stack development stack">
                {fullStackList.map((item, index) => (
                  <div key={item} className="stack-item">
                    <span>{item}</span>
                    {index < fullStackFlow.length - 1 ? <span className="stack-arrow">↓</span> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="language-panel">
              <div className="language-header">
                <h3>Programming Languages</h3>
              </div>
              <div className="language-list">
                {languageList.map((language) => (
                  <div key={language.name} className="language-card">
                    <div className="language-name-row">
                      <strong>{language.name}</strong>
                      <span>{language.level}</span>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: language.name === 'JavaScript' ? '80%' : language.name === 'SQL' ? '75%' : language.name === 'Python' ? '60%' : '50%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <SectionHeading eyebrow="My Services" title="What I Can Help You Build" subtitle="Focused, practical and quality-driven digital solutions." />
            <div className="services-grid">
              {servicesList.map((service) => (
                <article key={service.title} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Button href="#contact" variant="ghost" className="service-btn">Learn More</Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section alt-section">
          <div className="container">
            <SectionHeading eyebrow="My Projects" title="Featured Work" subtitle="A curated selection of development work and technical experiments." />

            <div className="toolbar">
              <div className="filter-list" aria-label="Project filters">
                {availableProjectFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={filter === activeFilter ? 'filter-chip is-active' : 'filter-chip'}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <label className="search-box" aria-label="Search projects">
                <span>Search</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search project name or technology"
                />
              </label>
            </div>

            {filteredProjects.length ? (
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <article key={project.id} className="project-card modern-card">
                    <div className="project-body">
                      <div className="project-meta">
                        <span>{project.category}</span>
                        {project.featured ? <span className="featured-pill">Featured</span> : null}
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="tech-tags">
                        {project.technologies.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                      {expandedProjectId === project.id ? (
                        <div className="project-details">
                          <strong>Project focus</strong>
                          <p>Designed around practical delivery, responsive user experience and maintainable technical implementation.</p>
                        </div>
                      ) : null}
                      <div className="project-actions">
                        <a href={project.github} target="_blank" rel="noreferrer" className="inline-link">
                          GitHub
                        </a>
                        <a href={project.live} target="_blank" rel="noreferrer" className="inline-link">
                          Live Demo
                        </a>
                        <button
                          type="button"
                          className="inline-link button-like"
                          onClick={() => setExpandedProjectId((currentId) => (currentId === project.id ? null : project.id))}
                          aria-expanded={expandedProjectId === project.id}
                        >
                          {expandedProjectId === project.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No project matches your search criteria. Try another filter or keyword.</p>
              </div>
            )}
          </div>
        </section>

        <section id="college-projects" className="section">
          <div className="container">
            <SectionHeading eyebrow="College Projects & Certification" title="College Project & IoT Certification" subtitle="Nepalgunj Technical College" />
            <div className="college-project-gallery">
              <div className="college-gallery-heading">
                <h3>Project Work and IoT Certification</h3>
                <p>Project development, practical work and certification evidence in one professional frame.</p>
              </div>
              <div className="college-gallery-grid">
                {[
                  ['/images/project.jpg', 'College project presentation'],
                  ['/images/duringsetup.jpg', 'Project setup'],
                  ['/images/duringwork.png', 'Practical project work'],
                  ['/images/certificate.jpg', 'IoT certification'],
                ].map(([image, alt]) => (
                  <img key={image} src={image} alt={alt} />
                ))}
              </div>
            </div>
            <div className="content-grid">
              {collegeList.map((project) => (
                <article key={project.title} className="detail-card">
                  <h3>{project.title}</h3>
                  <p><strong>Subject:</strong> {project.subject}</p>
                  <p><strong>Semester:</strong> {project.semester}</p>
                  <p>{project.description}</p>
                  <div className="tech-tags">
                    {project.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                  <p><strong>My contribution:</strong> {project.contribution}</p>
                  <div className="card-links">
                    <a href={project.github}>GitHub</a>
                    <a href={project.demo}>Demo</a>
                    <a href={project.documentation}>Documentation</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="websites" className="section alt-section">
          <div className="container">
            <SectionHeading eyebrow="Websites" title="Websites I Developed" subtitle="Responsive, professional and purpose-driven website builds." />
            <div className="content-grid">
              {websiteList.map((site) => (
                <article key={site.name} className="detail-card site-card">
                  <h3>{site.name}</h3>
                  <p><strong>Purpose:</strong> {site.purpose}</p>
                  <p><strong>My role:</strong> {site.role}</p>
                  <div className="tech-tags">
                    {site.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                  <p>{site.details}</p>
                  <div className="card-links">
                    <a href={site.live} target="_blank" rel="noreferrer">Live website</a>
                    <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="national-projects" className="section">
          <div className="container">
            <SectionHeading eyebrow="National & Real-World Projects" title="National & Real-World Projects" subtitle="Professional, practical and community-focused technology work." />
            <div className="content-grid">
              {nationalList.map((project) => (
                <article key={project.name} className="detail-card">
                  <h3>{project.name}</h3>
                  <p><strong>Organization / Client:</strong> {project.organization}</p>
                  <p><strong>Problem solved:</strong> {project.problemSolved}</p>
                  <p><strong>Solution:</strong> {project.solution}</p>
                  <p><strong>Role:</strong> {project.role}</p>
                  <p><strong>Impact:</strong> {project.impact}</p>
                  <div className="tech-tags">
                    {project.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                  <div className="card-links">
                    <a href={project.live}>Live link</a>
                    <a href={project.github}>GitHub</a>
                    <a href={project.documentation}>Documentation</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section alt-section">
          <div className="container">
            <SectionHeading eyebrow="Experience" title="Professional Journey" subtitle="Open to opportunities and always developing skills through rigorous practice." />
            <div className="timeline">
              {experienceList.map((item) => (
                <article key={`${item.type}-${item.title}`} className="timeline-item">
                  <span className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-content">
                    <span className="timeline-type">{item.type}</span>
                    <h3>{item.title}</h3>
                    <p className="timeline-period">{item.period}</p>
                    <p>{item.description}</p>
                    <ul>
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container">
            <SectionHeading eyebrow="Education" title="Education" subtitle="Academic foundation and continuous technical learning." />
            <div className="content-grid">
              {educationList.map((item) => (
                <article key={`${item.institution}-${item.program}`} className="detail-card">
                  <h3>{item.institution}</h3>
                  <p><strong>Program:</strong> {item.program}</p>
                  <p><strong>Field:</strong> {item.field}</p>
                  <p><strong>Period:</strong> {item.startYear} - {item.endYear}</p>
                  <p>{item.description}</p>
                  <p><strong>Academic projects:</strong> {item.academicProjects.join(', ')}</p>
                  <p><strong>Achievements:</strong> {item.achievements.join(', ')}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className="section alt-section">
          <div className="container">
            <SectionHeading eyebrow="Certifications" title="Certifications" subtitle="Professional learning and continuous growth." />
            {certificationList.length ? (
              <div className="content-grid">
                {certificationList.map((certificate) => (
                  <article key={certificate.name} className="detail-card">
                    <h3>{certificate.name}</h3>
                    <p><strong>Issued by:</strong> {certificate.issuingOrganization}</p>
                    <p><strong>Date:</strong> {certificate.date}</p>
                    <p><strong>Credential ID:</strong> {certificate.credentialId}</p>
                    <div className="card-links">
                      {certificate.file ? <a href={certificate.file}>Certificate</a> : null}
                      {certificate.verificationLink ? <a href={certificate.verificationLink}>Verification</a> : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No certifications available yet. Add your certificate list in <code>src/data/certifications.js</code>.</p>
              </div>
            )}
          </div>
        </section>

        <section id="resume" className="section">
          <div className="container resume-panel">
            <div>
              <SectionHeading eyebrow="Resume / CV" title="Download My CV" subtitle="Professional profile and work summary." />
            </div>
            <div className="resume-actions">
              <Button href={profile.cv} variant="primary" target="_blank" rel="noreferrer" download="Dammar-BK-CV.html">
                Download My CV
              </Button>
              <Button href={profile.cv} variant="secondary" target="_blank" rel="noreferrer">
                View CV
              </Button>
            </div>
          </div>
        </section>

        <section id="contact" className="section alt-section">
          <div className="container contact-panel">
            <div className="contact-copy">
              <SectionHeading eyebrow="Open to Opportunities" title="Let’s Build Something Great Together." subtitle="Open to Software Engineering, Full-Stack Development, Web Development and technology-related opportunities." />
              <div className="contact-meta">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                <a href={profile.facebook} target="_blank" rel="noreferrer">Facebook</a>
                <a href={profile.instagram} target="_blank" rel="noreferrer">Instagram</a>
                <a href={profile.tiktok} target="_blank" rel="noreferrer">TikTok</a>
              </div>
              <div className="copy-email-row">
                <button type="button" className="inline-link button-like" onClick={handleCopyEmail}>
                  {copyState ? copyState : 'Copy Email'}
                </button>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="field-grid">
                <label>
                  <span>Name</span>
                  <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Your name" autoComplete="name" aria-invalid={Boolean(formErrors.name)} />
                  {formErrors.name ? <small>{formErrors.name}</small> : null}
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="your@email.com" autoComplete="email" aria-invalid={Boolean(formErrors.email)} />
                  {formErrors.email ? <small>{formErrors.email}</small> : null}
                </label>
              </div>

              <div className="field-grid">
                <label>
                  <span>Phone</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Optional phone number" autoComplete="tel" />
                </label>
                <label>
                  <span>Subject</span>
                  <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} placeholder="Project inquiry" aria-invalid={Boolean(formErrors.subject)} />
                  {formErrors.subject ? <small>{formErrors.subject}</small> : null}
                </label>
              </div>

              <label>
                <span>Message</span>
                <textarea name="message" value={formData.message} onChange={handleFormChange} rows="6" placeholder="Tell me about your project or opportunity." aria-invalid={Boolean(formErrors.message)} />
                {formErrors.message ? <small>{formErrors.message}</small> : null}
              </label>

              <Button type="submit" className="submit-btn">Send Inquiry</Button>
            </form>
          </div>
        </section>

        <section id="dashboard" className="section alt-section">
          <div className="container">
            <SectionHeading eyebrow="Admin Dashboard" title="Content Control Center" subtitle="Portfolio health, sync status and content coverage overview." />

            <div className="dashboard-grid">
              <div className="dashboard-panel">
                <div className="meta-row">
                  <span className="status-badge">{syncStatusText}</span>
                </div>
                <div className="metric-grid">
                  {adminMetrics.map((metric) => (
                    <div key={metric.label} className={`metric-card ${metric.tone}`}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-panel table-panel">
                <h3>Portfolio sync</h3>
                <table className="sync-table">
                  <tbody>
                    <tr>
                      <td>Primary data source</td>
                      <td>{portfolio.source === 'backend' ? 'Express API' : 'Local file dataset'}</td>
                    </tr>
                    <tr>
                      <td>Skills inventory</td>
                      <td>{skillList.reduce((total, group) => total + (group.skills?.length ?? 0), 0)}</td>
                    </tr>
                    <tr>
                      <td>Project coverage</td>
                      <td>{projectList.length} active items</td>
                    </tr>
                    <tr>
                      <td>Portfolio state</td>
                      <td>{isLoading ? 'Loading…' : 'Ready for review'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>DAMMAR B.K.</h3>
            <p>SOFTWARE ENGINEER</p>
            <p className="footer-tagline">Turning Ideas Into Digital Solutions.</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {profile.navItems.map((item) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-')
                return <li key={item}><a href={`#${sectionId}`}>{item}</a></li>
              })}
            </ul>
          </div>

          <div>
            <h4>Social Links</h4>
            <ul className="footer-links">
              <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href={profile.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href={profile.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href={profile.tiktok} target="_blank" rel="noreferrer">TikTok</a></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
              <li><a href={`tel:${profile.phone}`}>{profile.phone}</a></li>
              <li>{profile.location}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p>© 2026 Dammar B.K. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {showBackToTop ? (
        <button type="button" className="back-to-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </>
  )
}

export default App

function NotFoundPage() {
  return (
    <section className="section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="eyebrow">404</span>
        <h2 style={{ marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ marginBottom: '24px', color: 'rgba(224, 237, 255, 0.8)' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Button href="#home">Return Home</Button>
      </div>
    </section>
  )
}
