import { useQuery } from '@tanstack/react-query'
import { ApiError } from '../lib/api-client.ts'
import { BackendProbePanel } from '../features/status/backend-probe-panel.tsx'
import { fetchStatusOverview } from '../features/status/fetch-status-overview.ts'

const alertToneClasses = {
  critical: 'border-rose-200 bg-rose-50 text-rose-800',
  watch: 'border-amber-200 bg-amber-50 text-amber-800',
  healthy: 'border-emerald-200 bg-emerald-50 text-emerald-800',
} as const

export function StatusDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['status-overview'],
    queryFn: fetchStatusOverview,
    refetchInterval: 15_000,
  })

  const alerts = data?.alerts ?? []
  const timeline = data?.timeline ?? []
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : 'Unable to load dashboard data from the backend.'

  return (
    <section className="space-y-6">
      <div className="page-grid">
        <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
            Status Dashboard
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-5xl leading-none text-stone-950">
                Monitor studio health in one place.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-stone-600">
                React Query is now calling your Spring Boot dashboard endpoint and refreshing the response every 15 seconds.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-sm text-stone-500">Refresh cadence</p>
              <p className="mt-1 text-3xl font-semibold text-stone-950">15s</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Query status
          </p>
          <p className="mt-3 text-4xl font-semibold text-stone-950">
            {isLoading ? 'Loading...' : isError ? 'Backend unavailable' : 'Live data connected'}
          </p>
          <p className="mt-3 text-sm text-stone-600">
            {isError
              ? errorMessage
              : 'Data is coming from the Spring Boot API through the configured frontend client.'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active models" value={data?.activeModels ?? '--'} />
        <MetricCard label="Online favorites" value={data?.onlineFavorites ?? '--'} />
        <MetricCard label="Avg. response" value={data ? `${data.averageResponseSeconds}s` : '--'} />
        <MetricCard label="Conversion rate" value={data ? `${data.conversionRate}%` : '--'} />
      </div>

      <BackendProbePanel />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
                Revenue timeline
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-stone-950">Peak windows</h3>
            </div>
            <div className="text-right text-sm text-stone-500">
              <p>Rendered from backend response</p>
              <p>Still easy to replace with a chart lib later</p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/75 p-5">
            <div className="flex h-64 items-end gap-3">
              {timeline.map((point) => (
                <div key={point.hour} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-44 w-full items-end rounded-full bg-stone-100 px-2 py-2">
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-stone-950 via-amber-600 to-amber-300"
                      style={{ height: `${Math.min(point.revenue, 180)}px` }}
                    />
                  </div>
                  <div className="text-center text-xs text-stone-500">
                    <p className="font-semibold text-stone-700">{point.hour}</p>
                    <p>${point.revenue}</p>
                  </div>
                </div>
              ))}

              {!timeline.length && !isLoading ? (
                <div className="flex h-full w-full items-center justify-center text-sm text-stone-500">
                  No timeline data returned by the backend.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className={`rounded-[1.75rem] border p-5 shadow-sm ${alertToneClasses[alert.tone]}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                {alert.tone}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{alert.title}</h3>
              <p className="mt-2 text-sm leading-6">{alert.detail}</p>
            </article>
          ))}

          {!alerts.length && !isLoading ? (
            <article className="glass-panel rounded-[1.75rem] p-5 text-sm text-stone-600 shadow-sm">
              No alerts were returned by the backend.
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}

type MetricCardProps = {
  label: string
  value: number | string
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="glass-panel rounded-[1.5rem] p-6 shadow-[0_16px_40px_rgba(146,64,14,0.1)]">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-stone-950">{value}</p>
    </div>
  )
}