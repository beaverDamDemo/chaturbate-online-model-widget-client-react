export function NotFoundPage() {
  return (
    <section className="flex justify-center items-center min-h-[60vh] w-full">
      <div className="glass-panel rounded-[2rem] p-8 shadow-[0_24px_70px_rgba(146,64,14,0.12)] sm:p-10 text-center">
        <h1 className="text-6xl font-bold text-amber-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="mb-6 text-stone-600">Sorry, the page you are looking for does not exist.</p>
        <a href="/" className="primary-button rounded-full px-6 py-3 font-semibold">Go Home</a>
      </div>
    </section>
  )
}
