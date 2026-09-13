import SectionHeading from './SectionHeading'

export function Skills({ skillList = [], fullStackList = [], languageList = [] }) {
  return (
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
                {index < fullStackList.length - 1 ? <span className="stack-arrow">↓</span> : null}
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
  )
}

export default Skills
