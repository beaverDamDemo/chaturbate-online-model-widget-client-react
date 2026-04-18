
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from './app/theme-context.tsx'
import { useAuth } from './features/auth/auth-context.tsx'

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
    </svg>
  );
}


function App() {
  const { user, isAdmin, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="theme-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-panel flex flex-col gap-5 rounded-[2rem] px-6 py-5 shadow-[0_30px_80px_rgba(120,53,15,0.12)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <NavLink to="/" className="focus:outline-none" aria-label="Go to home page">
              <img src="/favicon.svg" alt="Home" className="h-12 w-12 rounded-xl border border-stone-200 shadow-sm transition-opacity hover:opacity-80" />
            </NavLink>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-amber-700/80">
                Model Widget Control Room
              </p>
              <div className="mt-3 flex items-end gap-3">
                <h1 className="font-display text-3xl leading-none sm:text-4xl">
                  Creator Ops Starter
                </h1>
                <span className="rounded-full border border-amber-900/10 bg-white/70 px-3 py-1 text-xs font-semibold text-stone-600">
                  v0.0.0
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
                Boilerplate for auth, favorites management, and a live status dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {user ? (
              <div className="rounded-2xl border border-stone-200/70 bg-white/80 px-4 py-3 text-sm shadow-sm">
                <p className="font-semibold text-stone-900">{user.name}</p>
                <p className="text-stone-500">{user.email}</p>
              </div>
            ) : null}

            <nav className="flex flex-wrap gap-2">
              <NavItem to="/api-test" label="API Test" />
              {user ? <NavItem to="/account" label="Account" /> : null}
              {user ? <AdminNavItem isAdmin={isAdmin} /> : null}
              {user ? null : <NavItem to="/login" label="Login" />}
            </nav>

            {user ? (
              <>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-toggle flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold p-0 border-none mr-2"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  style={{ minWidth: '2.75rem', minHeight: '2.75rem' }}
                >
                  <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut()
                    navigate('/login', { replace: true })
                  }}
                  className="secondary-button flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold p-0 border-none"
                  aria-label="Log out"
                  title="Log out"
                  style={{ minWidth: '2.75rem', minHeight: '2.75rem' }}
                >
                  <LogOutIcon className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold p-0 border-none"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                style={{ minWidth: '2.75rem', minHeight: '2.75rem' }}
              >
                <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

type AdminNavItemProps = {
  isAdmin: boolean
}

function AdminNavItem({ isAdmin }: AdminNavItemProps) {
  if (isAdmin) {
    return <NavItem to="/admin" label="Admin Panel" />
  }

  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Admin access required"
      className="nav-pill cursor-not-allowed rounded-full px-4 py-2 text-sm font-semibold opacity-50"
    >
      Admin Panel
    </button>
  )
}

type NavItemProps = {
  to: string
  label: string
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold nav-pill ${isActive ? 'nav-pill-active' : ''}`
      }
    >
      {label}
    </NavLink>
  )
}

export default App
