/**
 * SkeletonLoader component provides stable placeholder UI to prevent layout shift
 * during content loading. Uses fixed dimensions instead of animations to avoid
 * mobile flicker and jank.
 */

type SkeletonLoaderProps = {
  className?: string
  minHeight?: string
  children?: React.ReactNode
}

export function SkeletonLoader({ 
  className = '', 
  minHeight = '160px',
  children 
}: SkeletonLoaderProps) {
  const baseClasses = 'rounded-lg border border-white/10 bg-white/5'
  const classes = [baseClasses, className].filter(Boolean).join(' ')
  
  return (
    <div 
      className={classes} 
      style={{ minHeight }}
      aria-busy="true"
      aria-live="polite"
    >
      {children}
    </div>
  )
}

type SkeletonTextProps = {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i} 
          className="h-4 rounded bg-white/5"
          style={{ 
            width: i === lines - 1 ? '70%' : '100%' 
          }}
        />
      ))}
    </div>
  )
}

type SkeletonCardProps = {
  className?: string
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-950/40 p-6 ${className}`}>
      <div className="h-6 w-3/4 rounded bg-white/5 mb-3" />
      <SkeletonText lines={2} />
    </div>
  )
}
