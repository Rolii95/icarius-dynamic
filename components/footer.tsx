export function Footer(){
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 text-sm text-slate-300 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Icarius Consulting</p>
        <nav className="flex gap-4">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Accessibility</a>
        </nav>
      </div>
    </footer>
  )
}
