import { forwardRef, HTMLAttributes } from 'react'

export type SectionProps = HTMLAttributes<HTMLElement>

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({ className, ...props }, ref) {
  const classes = ['observe', 'contain-layout', className].filter(Boolean).join(' ')

  return <section ref={ref} className={classes} {...props} />
})
