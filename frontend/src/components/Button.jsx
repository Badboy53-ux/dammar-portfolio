export function Button({ children, variant = 'primary', href, className = '', ...props }) {
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

export default Button
