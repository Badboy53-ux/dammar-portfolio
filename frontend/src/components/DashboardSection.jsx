import SectionHeading from './SectionHeading'

export function DashboardSection({
  adminMetrics = [],
  syncStatusText = '',
  skillCount = 0,
  projectCount = 0,
  isLoading = false,
  dataSource = 'Local file dataset',
}) {
  return (
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
                  <td>{dataSource}</td>
                </tr>
                <tr>
                  <td>Skills inventory</td>
                  <td>{skillCount}</td>
                </tr>
                <tr>
                  <td>Project coverage</td>
                  <td>{projectCount} active items</td>
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
  )
}

export default DashboardSection
