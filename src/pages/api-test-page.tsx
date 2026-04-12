import { BackendProbePanel } from '../features/status/backend-probe-panel.tsx'

export function ApiTestPage() {
  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
          Public API Test
        </p>
        <h2 className="mt-4 font-display text-5xl leading-none text-stone-950">
          Test backend connectivity without logging in.
        </h2>
        <p className="mt-4 max-w-3xl text-base text-stone-600">
          This page is intentionally public so you can verify that the frontend can reach your Spring Boot app before the auth flow is working.
        </p>
      </div>

      <BackendProbePanel
        title="Probe the backend from a public route."
        description="Try a GET endpoint such as /health. This does not require frontend login because this page is outside the protected routes."
      />
    </section>
  )
}