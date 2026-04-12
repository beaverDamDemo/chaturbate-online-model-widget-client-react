import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ApiError } from '../../lib/api-client.ts'
import { fetchBackendProbe } from './fetch-backend-probe.ts'

type BackendProbePanelProps = {
  title?: string
  description?: string
}

export function BackendProbePanel({
  title = 'Call a sample backend endpoint from the frontend.',
  description = 'Use this to quickly test a Spring Boot endpoint such as /health or any other GET path exposed through the frontend proxy.',
}: BackendProbePanelProps) {
  const [probePath, setProbePath] = useState('/health')
  const backendProbe = useMutation({
    mutationFn: fetchBackendProbe,
  })

  const probeResult = backendProbe.data
    ? JSON.stringify(backendProbe.data, null, 2)
    : null
  const probeErrorMessage =
    backendProbe.error instanceof ApiError
      ? backendProbe.error.message
      : backendProbe.error
        ? 'The sample backend request failed.'
        : null

  return (
    <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
            Backend Probe
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-stone-950">{title}</h3>
          <p className="mt-3 max-w-2xl text-sm text-stone-600">{description}</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm">
          <p className="text-sm text-stone-500">Current default path</p>
          <p className="mt-1 text-2xl font-semibold text-stone-950">{probePath || '/health'}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <input
          value={probePath}
          onChange={(event) => setProbePath(event.target.value)}
          placeholder="/health"
          className="w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-200/70 lg:flex-1"
        />
        <button
          type="button"
          onClick={() => backendProbe.mutate(probePath)}
          disabled={backendProbe.isPending}
          className="primary-button rounded-full px-5 py-3 text-sm font-semibold lg:min-w-48"
        >
          {backendProbe.isPending ? 'Calling backend...' : 'Call sample endpoint'}
        </button>
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white/70 px-5 py-4 text-sm text-stone-600">
        <p>
          Browser request: <span className="font-semibold text-stone-900">http://localhost:3000/api{probePath.startsWith('/') ? probePath : `/${probePath || 'health'}`}</span>
        </p>
        <p className="mt-1">
          Actual backend target via Vite proxy: <span className="font-semibold text-stone-900">http://localhost:8080/api{probePath.startsWith('/') ? probePath : `/${probePath || 'health'}`}</span>
        </p>
      </div>

      {/* Suggested paths removed as requested */}

      <div className="rounded-[1.5rem] border border-stone-200 bg-stone-950 p-5 text-stone-100 shadow-inner">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">
          Last response
        </p>
        {probeErrorMessage ? (
          <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
            {probeErrorMessage}
          </p>
        ) : null}
        {probeResult ? (
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-stone-900/80 p-4 text-xs leading-6 text-emerald-200">
            {probeResult}
          </pre>
        ) : !probeErrorMessage ? (
          <p className="mt-4 text-sm text-stone-300">
            Click the button to make a sample GET request through the frontend API client.
          </p>
        ) : null}
      </div>
    </div>
  )
}