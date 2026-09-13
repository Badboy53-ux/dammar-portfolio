import { useState } from 'react'
import profile from '../config/profile'
import { submitContactForm } from '../services/contactService'
import Button from './Button'
import SectionHeading from './SectionHeading'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export function ContactSection({ onNotify }) {
  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [copyState, setCopyState] = useState('')

  const notify = (message) => {
    if (onNotify) onNotify(message)
  }

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
      notify('Please review the highlighted fields.')
      return
    }

    const response = await submitContactForm(formData)

    if (!response?.success) {
      notify(response?.message || 'Unable to send your message right now. Please try again later.')
      return
    }

    notify(response.message || 'Message sent successfully.')
    setFormData(initialForm)
    setFormErrors({})
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState('Copied!')
      notify('Email copied to clipboard.')
    } catch {
      setCopyState('Copy failed')
      notify('Unable to copy email automatically.')
    }
  }

  return (
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
  )
}

export default ContactSection
