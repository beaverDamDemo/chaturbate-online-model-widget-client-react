import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/auth-context.tsx'

export function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextPath = (location.state as { from?: string } | null)?.from ?? '/'

  if (isAuthenticated) {
    return <Navigate to={nextPath} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await signIn(email, password)
      void navigate(nextPath, { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-grid">
      <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-700/80">
          Access Portal
        </p>
        <h2 className="mt-4 font-display text-5xl leading-none text-stone-950">
          Sign in to manage rooms, favorites, and performance.
        </h2>
        <p className="mt-5 max-w-xl text-base text-stone-600">
          This form posts credentials to your Spring Boot backend and stores the returned JWT for authenticated API calls.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Backend" value="Spring Boot" />
          <StatCard label="Dev proxy" value="/api" />
          <StatCard label="Default target" value="localhost:8080" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel rounded-[2rem] border border-white/60 p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)] sm:p-10"
      >
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            JWT login
          </p>
          <p className="mt-2 text-sm text-stone-600">
            The frontend will save the access token returned by the Spring Boot auth endpoint and send it as a bearer token.
          </p>
        </div>

        <label className="mb-4 block text-sm font-semibold text-stone-700">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/70"
          />
        </label>

        <label className="mb-4 block text-sm font-semibold text-stone-700">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/70"
          />
        </label>

        {errorMessage ? (
          <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="primary-button w-full rounded-full px-5 py-3 text-sm font-semibold"
        >
          {isSubmitting || isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="mt-5 text-sm text-stone-600">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-amber-700 hover:text-amber-900">
            Create one here
          </Link>
          .
        </p>
      </form>
    </section>
  )
}

type StatCardProps = {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-stone-950">{value}</p>
    </div>
  )
}