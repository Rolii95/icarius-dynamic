export type NavLink = {
  href: string
  label: string
}

export const primaryNavLinks: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/packages', label: 'Packages' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
]

export const footerNavLinks: NavLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/accessibility', label: 'Accessibility' },
]
