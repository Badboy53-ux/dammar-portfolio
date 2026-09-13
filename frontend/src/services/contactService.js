import { API_URL } from './apiConfig'

export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Unable to send message right now.')
    }

    return await response.json()
  } catch (error) {
    console.warn('Contact API unavailable.', error)
    return {
      success: false,
      message: 'Unable to send your message right now. Please try again later.',
    }
  }
}

export default submitContactForm
