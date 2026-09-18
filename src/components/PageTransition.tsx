'use client'

import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return <main id="main-content" tabIndex={-1} key={pathname} className="page-enter">{children}</main>
}
