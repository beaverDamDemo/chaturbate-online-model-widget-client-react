import { useQuery } from '@tanstack/react-query'
import { ApiError } from '../lib/api-client.ts'
import { fetchAdminStats } from '../features/admin/fetch-admin-stats.ts'

type StatsRecord = Record<string, unknown>

export function AdminPanelPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    refetchInterval: 300_000,
  })

  const scalarEntries = Object.entries(data ?? {}).filter(([, value]) =>
    ['string', 'number', 'boolean'].includes(typeof value),
  )

  const complexEntries = Object.entries(data ?? {}).filter(([, value]) =>
    value !== null && typeof value === 'object',
  )

  const errorMessage =
    error instanceof ApiError && error.status === 403
      ? 'This endpoint is restricted to admin users.'
      : error instanceof ApiError
        ? error.message
        : 'Unable to load admin statistics from the backend.'

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
          Admin Panel
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-5xl leading-none text-stone-950">
              Review platform-wide activity.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-stone-600">
              This page is reserved for admin users and reads summary stats from the backend.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm">
            <p className="text-sm text-stone-500">Refresh cadence</p>
            <p className="mt-1 text-3xl font-semibold text-stone-950">5m</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
          Endpoint status
        </p>
        <p className="mt-3 text-4xl font-semibold text-stone-950">
          {isLoading ? 'Loading...' : isError ? 'Unavailable' : 'Live admin data'}
        </p>
        <p className="mt-3 text-sm text-stone-600">
          {isError ? errorMessage : 'Data is coming from GET /api/admin/stats.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scalarEntries.length ? (
          scalarEntries.map(([key, value]) => (
            <MetricCard key={key} label={formatLabel(key)} value={String(value)} />
          ))
        ) : !isLoading && !isError ? (
          <div className="glass-panel rounded-[1.5rem] p-6 text-sm text-stone-600 shadow-[0_16px_40px_rgba(146,64,14,0.1)] md:col-span-2 xl:col-span-4">
            No top-level scalar stats were returned. The raw response is shown below.
          </div>
        ) : null}
      </div>

      {complexEntries.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {complexEntries.map(([key, value]) => (
            <article
              key={key}
              className="glass-panel rounded-[1.75rem] p-6 text-sm text-stone-600 shadow-[0_16px_40px_rgba(146,64,14,0.1)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
                {formatLabel(key)}
              </p>
              <div className="mt-4">{renderComplexValue(key, value)}</div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

type MetricCardProps = {
  label: string
  value: string
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="glass-panel rounded-[1.5rem] p-6 shadow-[0_16px_40px_rgba(146,64,14,0.1)]">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-stone-950">{value}</p>
    </div>
  )
}

function formatLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (character) => character.toUpperCase())
}

function renderComplexValue(key: string, value: unknown) {
  if (Array.isArray(value)) {
    return <StatsArraySection title={key} items={value} />
  }

  if (value && typeof value === 'object') {
    return <StatsObjectSection data={value as StatsRecord} />
  }

  return (
    <div className="rounded-2xl bg-stone-900/80 p-4 text-xs leading-6 text-emerald-200">
      {JSON.stringify(value, null, 2)}
    </div>
  )
}

type StatsArraySectionProps = {
  title: string
  items: unknown[]
}

function StatsArraySection({ title, items }: StatsArraySectionProps) {
  if (!items.length) {
    return (
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-600">
        No items returned for {formatLabel(title).toLowerCase()}.
      </div>
    )
  }

  if (items.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))) {
    const sortedItems = title.toLowerCase().includes('room')
      ? [...items].sort((leftItem, rightItem) =>
          getSortableTitle(leftItem as StatsRecord).localeCompare(
            getSortableTitle(rightItem as StatsRecord),
            undefined,
            { sensitivity: 'base' },
          ),
        )
      : items

    return (
      <div className="grid gap-3 lg:grid-cols-2">
        {sortedItems.map((item, index) => (
          <StatsObjectCard
            key={getItemKey(item as StatsRecord, index)}
            data={item as StatsRecord}
            accent={title.toLowerCase().includes('room')}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${title}-${index}`}
          className="rounded-full border border-stone-200 bg-white/70 px-3 py-1 text-xs font-medium text-stone-600"
        >
          {String(item)}
        </span>
      ))}
    </div>
  )
}

type StatsObjectSectionProps = {
  data: StatsRecord
}

function StatsObjectSection({ data }: StatsObjectSectionProps) {
  const entries = Object.entries(data)

  if (!entries.length) {
    return (
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-600">
        No data returned for this section.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map(([entryKey, entryValue]) => (
        <div
          key={entryKey}
          className="rounded-[1.25rem] border border-stone-200 bg-white/70 px-4 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            {formatLabel(entryKey)}
          </p>
          {renderObjectValue(entryValue)}
        </div>
      ))}
    </div>
  )
}

type StatsObjectCardProps = {
  data: StatsRecord
  accent?: boolean
}

function StatsObjectCard({ data, accent = false }: StatsObjectCardProps) {
  const title = getObjectTitle(data)
  const detailEntries = Object.entries(data).filter(([key]) => key !== title.key)

  return (
    <div
      className={`rounded-[1.5rem] border p-4 shadow-sm ${
        accent
          ? 'border-amber-200 bg-amber-50/70'
          : 'border-stone-200 bg-white/70'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            {title.key ? formatLabel(title.key) : 'Entry'}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-950">{title.value}</h3>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {detailEntries.map(([entryKey, entryValue]) => (
          <div key={entryKey} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-stone-500">{formatLabel(entryKey)}</span>
            <span className="text-right font-semibold text-stone-900">
              {formatInlineValue(entryValue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderObjectValue(value: unknown) {
  if (Array.isArray(value)) {
    return <div className="mt-3"><StatsArraySection title="items" items={value} /></div>
  }

  if (value && typeof value === 'object') {
    return <div className="mt-3"><StatsObjectCard data={value as StatsRecord} /></div>
  }

  return <p className="mt-2 text-sm font-semibold text-stone-900">{formatInlineValue(value)}</p>
}

function formatInlineValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value === null || value === undefined) {
    return '—'
  }

  return JSON.stringify(value)
}

function getObjectTitle(data: StatsRecord) {
  const titleKeys = ['roomName', 'name', 'title', 'username', 'email', 'id']

  for (const key of titleKeys) {
    const value = data[key]

    if (typeof value === 'string' || typeof value === 'number') {
      return { key, value: String(value) }
    }
  }

  return { key: '', value: 'Stats entry' }
}

function getItemKey(item: StatsRecord, index: number) {
  const candidateKeys = ['id', 'roomName', 'name', 'title', 'username']

  for (const key of candidateKeys) {
    const value = item[key]

    if (typeof value === 'string' || typeof value === 'number') {
      return `${key}-${value}`
    }
  }

  return `item-${index}`
}

function getSortableTitle(data: StatsRecord) {
  const candidateKeys = ['roomName', 'name', 'title', 'username', 'email', 'id']

  for (const key of candidateKeys) {
    const value = data[key]

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }
  }

  return ''
}