import Image from 'next/image'
import Link from 'next/link'

export default function Brand() {
  return (
    <Link
      href="/"
      aria-label="Icarius Consulting — home"
      className="flex items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 ring-sky-400/60"
    >
      <Image
        src="/brand/icarius_interlock_mark.svg"
        width={28}
        height={28}
        alt=""
        aria-hidden="true"
        className="h-7 w-7"
        priority
      />
      <div className="leading-tight">
        <div className="font-bold tracking-[0.02em] text-white">Icarius</div>
        <div className="text-xs font-semibold tracking-[0.16em] text-white/80">CONSULTING</div>
      </div>
    </Link>
  )
}
