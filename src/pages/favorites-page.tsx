import { useState } from 'react'
import type { FormEvent } from 'react'
import { useFavorites } from '../features/favorites/use-favorites.ts'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function FavoritesPage() {
  const {
    favorites,
    createFavorite,
    removeFavorite,
    isLoading,
    isError,
    errorMessage,
    actionErrorMessage,
    isCreating,
    isRemoving,
    activeRoomName,
  } = useFavorites()
  const [roomName, setRoomName] = useState('')
  const [formErrorMessage, setFormErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedRoomName = roomName.trim()

    if (!normalizedRoomName) {
      setFormErrorMessage('Room name is required.')
      return
    }

    try {
      setFormErrorMessage('')
      await createFavorite(normalizedRoomName)
      setRoomName('')
    } catch {
      return
    }
  }

  const handleRemoveFavorite = async (favoriteRoomName: string) => {
    const shouldRemove = window.confirm(
      `Remove ${favoriteRoomName} from your favorites?`,
    )

    if (!shouldRemove) {
      return
    }

    await removeFavorite(favoriteRoomName)
  }

  if (isLoading) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-sm text-stone-600 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
        Loading favorites from the Spring Boot backend...
      </section>
    )
  }

  if (isError) {
    return (
      <section className="glass-panel rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700 shadow-[0_24px_70px_rgba(146,64,14,0.08)]">
        {errorMessage}
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
          Favorites
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-5xl leading-none text-stone-950">
              Save rooms you want to track.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-stone-600">
              Favorites now come directly from your backend and are stored per authenticated user.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm">
            <p className="text-sm text-stone-500">Saved favorites</p>
            <p className="mt-1 text-3xl font-semibold text-stone-950">{favorites.length}</p>
          </div>
        </div>
      </div>

      <div className="page-grid">
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[2rem] border border-white/60 p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Add favorite
          </p>
          <p className="mt-2 text-sm text-stone-600">
            Enter a room name and save it to your favorites list.
          </p>

          <label className="mt-6 block text-sm font-semibold text-stone-700">
            Room name
            <input
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              type="text"
              placeholder="room_name"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/70"
            />
          </label>

          {formErrorMessage ? (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formErrorMessage}
            </p>
          ) : null}

          {actionErrorMessage ? (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {actionErrorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isCreating}
            className="primary-button mt-6 w-full rounded-full px-5 py-3 text-sm font-semibold"
          >
            {isCreating ? 'Adding favorite...' : 'Add favorite'}
          </button>
        </form>

        <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Backend shape
          </p>
          <div className="mt-5 space-y-4 text-sm text-stone-600">
            <p>Each favorite includes a room name, current online flag, last status check, and optional created timestamp.</p>
            <p>The remove action calls the backend using the room name in the URL.</p>
          </div>
        </div>
      </div>

      <section className="glass-panel overflow-hidden rounded-[2rem] shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
        <div className="border-b border-stone-200/70 px-6 py-5 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Saved rooms
          </p>
          <p className="mt-2 text-sm text-stone-600">
            A compact overview of all rooms currently stored in favorites.
          </p>
        </div>

        {favorites.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200/70 bg-white/40 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  <th className="px-4 py-3 sm:px-6">Room</th>
                  <th className="px-4 py-3 sm:px-6">Status</th>
                  <th className="px-4 py-3 sm:px-6">Status Checked</th>
                  <th className="px-4 py-3 sm:px-6">Added</th>
                  <th className="px-4 py-3 text-right sm:px-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((favorite) => {
                  const isOnline = favorite.online

                  return (
                    <tr
                      key={favorite.id}
                      className="border-b border-stone-200/70 align-middle text-sm text-stone-600 transition-colors hover:bg-white/25"
                    >
                      <td className="px-4 py-3 sm:px-6">
                        <div className="min-w-36">
                          <p className="font-semibold text-stone-950">{favorite.roomName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {isOnline ? 'online' : 'offline'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs sm:px-6 sm:text-sm">
                        {formatStatusCheckedTimestamp(favorite.statusCheckedAt)}
                      </td>
                      <td className="px-4 py-3 text-xs sm:px-6 sm:text-sm">
                        {formatOptionalTimestamp(favorite.createdAt, 'date not available')}
                      </td>
                      <td className="px-4 py-2 text-right sm:px-6">
                        <button
                          type="button"
                          disabled={isRemoving && activeRoomName === favorite.roomName}
                          onClick={() => void handleRemoveFavorite(favorite.roomName)}
                          aria-label={`Remove ${favorite.roomName} from favorites`}
                          title="Remove favorite"
                          className="icon-danger-button ml-auto flex h-8 w-8 items-center justify-center rounded-full"
                        >
                          {isRemoving && activeRoomName === favorite.roomName ? (
                            <span className="text-[10px] font-semibold">...</span>
                          ) : (
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4.75A1.75 1.75 0 0 1 9.75 3h4.5A1.75 1.75 0 0 1 16 4.75V6" />
                              <path d="M18 6l-1 13.25A1.75 1.75 0 0 1 15.26 21H8.74A1.75 1.75 0 0 1 7 19.25L6 6" />
                              <path d="M10 10.5v6" />
                              <path d="M14 10.5v6" />
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-6 text-sm text-stone-600 sm:px-8">
            No favorites were returned by the backend yet.
          </div>
        )}
      </section>
    </section>
  )
}

function formatOptionalTimestamp(value: string | null, fallback: string) {
  if (!value) {
    return fallback
  }

  const timestamp = Date.parse(value)

  if (Number.isNaN(timestamp)) {
    return value
  }

  return dateFormatter.format(timestamp)
}

function formatStatusCheckedTimestamp(value: string | null) {
  if (!value) {
    return 'not checked yet'
  }

  const timestamp = Date.parse(value)

  if (Number.isNaN(timestamp)) {
    return value
  }

  return `${dateFormatter.format(timestamp)} (${formatMinutesAgo(timestamp)})`
}

function formatMinutesAgo(timestamp: number) {
  const differenceInMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000))

  if (differenceInMinutes < 1) {
    return 'just now'
  }

  if (differenceInMinutes === 1) {
    return '1 minute ago'
  }

  return `${differenceInMinutes} minutes ago`
}