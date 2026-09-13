import { API_URL } from './apiConfig'

export const loadPortfolioData = async () => {
  try {
    const response = await fetch(`${API_URL}/portfolio`)

    if (!response.ok) {
      return null
    }

    const payload = await response.json()

    if (!payload?.success || !payload.data) {
      console.warn('Portfolio API returned an unexpected payload. Using local data.')
      return null
    }

    return {
      ...payload.data,
      source: 'backend',
    }
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
