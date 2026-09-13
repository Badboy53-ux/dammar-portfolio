import { useMemo, useState } from 'react'
import SectionHeading from './SectionHeading'

export function Projects({ projectList = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedProjectId, setExpandedProjectId] = useState(null)

  const availableFilters = ['All', ...new Set(projectList.map((project) => project.category))]

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

  return (
    <section id="projects" className="section alt-section">
      <div className="container">
        <SectionHeading eyebrow="My Projects" title="Featured Work" subtitle="A curated selection of development work and technical experiments." />

        <div className="toolbar">
          <div className="filter-list" aria-label="Project filters">
            {availableFilters.map((filter) => (
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
  )
}

export default Projects
