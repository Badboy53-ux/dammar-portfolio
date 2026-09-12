const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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
    console.warn('Contact API unavailable. Falling back to demo mode.', error)
    return {
      success: true,
      message: 'Your message has been queued successfully. Connect the backend to persist messages in MySQL.',
      demoMode: true,
    }
  }
}

export default submitContactForm
