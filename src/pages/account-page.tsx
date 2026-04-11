import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/auth-context.tsx'

export function AccountPage() {
  const { user, deleteAccount, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedPassword = password.trim()

    if (!normalizedPassword) {
      setErrorMessage('Enter your password to delete your account.')
      return
    }

    const confirmed = window.confirm(
      'Delete your account permanently? This will also delete all of your favorites.',
    )

    if (!confirmed) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await deleteAccount(normalizedPassword)
      void navigate('/login', { replace: true })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to delete your account.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
          Account
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-5xl leading-none text-stone-950">
              Manage your account access.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-stone-600">
              You can permanently delete your own account here. The backend will also remove every favorite linked to this user.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm">
            <p className="text-sm text-stone-500">Signed in as</p>
            <p className="mt-1 text-xl font-semibold text-stone-950">{user?.name}</p>
            <p className="text-sm text-stone-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="page-grid">
        <div className="glass-panel rounded-[2rem] border border-rose-200 bg-rose-50/80 p-8 shadow-[0_24px_70px_rgba(190,24,93,0.10)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-700">
            Permanent action
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-rose-950">Delete this account</h3>
          <div className="mt-5 space-y-3 text-sm text-rose-900">
            <p>Your profile will be removed permanently.</p>
            <p>All favorites stored for this account will be deleted by the backend.</p>
            <p>You will be signed out immediately after the request succeeds.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[2rem] border border-white/60 p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Confirm password
          </p>
          <p className="mt-2 text-sm text-stone-600">
            Enter your current password to send a DELETE request to /api/auth/me.
          </p>

          <label className="mt-6 block text-sm font-semibold text-stone-700">
            Current password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/70"
            />
          </label>

          {errorMessage ? (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full border border-rose-300 bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Deleting account...' : 'Delete my account'}
          </button>
        </form>
      </div>
    </section>
  )
}