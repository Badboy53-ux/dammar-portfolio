import profile from '../config/profile'
import Button from './Button'

const socialLinks = [
  { label: 'GitHub', href: profile.github, icon: 'GH' },
  { label: 'LinkedIn', href: profile.linkedin, icon: 'in' },
  { label: 'Facebook', href: profile.facebook, icon: 'f' },
  { label: 'Instagram', href: profile.instagram, icon: 'ig' },
  { label: 'TikTok', href: profile.tiktok, icon: 'tk' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: '@' },
]

export function Hero() {
  return (
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
  )
}

export default Hero
