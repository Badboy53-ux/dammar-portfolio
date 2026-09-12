const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const loadPortfolioData = async () => {
  try {
    const response = await fetch(`${API_URL}/portfolio`)

    if (!response.ok) {
      return null
    }

    const payload = await response.json()

    if (payload?.success && payload.data) {
      return {
        ...payload.data,
        source: 'backend',
      }
    }

    return payload
  } catch (error) {
    console.warn('Portfolio API unavailable. Using local data.', error)
    return null
  }
}

export const getDataHealth = (portfolio = {}) => {
  const projectCount = portfolio.projects?.length ?? 0
  const skillCount = (portfolio.skillGroups ?? []).reduce(
    (total, group) => total + (group.skills?.length ?? 0),
    0,
  )
  const certificationCount = portfolio.certifications?.length ?? 0

  return [
    { label: 'Projects', value: projectCount, tone: 'primary' },
    { label: 'Skills', value: skillCount, tone: 'secondary' },
    { label: 'Certificates', value: certificationCount, tone: 'accent' },
    { label: 'Sync', value: portfolio.source === 'backend' ? 'Live' : 'Local', tone: 'neutral' },
  ]
}

export default loadPortfolioData
