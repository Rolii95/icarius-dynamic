import Image from 'next/image'
import { type ComponentPropsWithoutRef } from 'react'

type HeroIllustrationProps = {
  /**
   * Optional className passed to the wrapping figure so the illustration can
   * participate in existing layout utilities without duplicating styles.
   */
  className?: string
} & ComponentPropsWithoutRef<'figure'>

export function HeroIllustration({ className, ...props }: HeroIllustrationProps) {
  const figureClassName = [
    'relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#09172a] to-[#13213a] p-6 shadow-[0_40px_70px_rgba(6,17,31,0.45)]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <figure className={figureClassName} {...props}>
      <Image
        src="/hero.svg"
        alt="Programme cockpit dashboard showing milestones, risk tracking and adoption progress"
        width={640}
        height={480}
        priority
        className="h-auto w-full"
      />
    </figure>
  )
}
