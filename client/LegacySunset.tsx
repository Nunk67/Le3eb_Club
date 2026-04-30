export default function LegacySunset() {
  return (
    <main className="min-h-screen bg-[#0f071a] text-white p-6">
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 backdrop-blur-xl">
        <h1 className="text-3xl font-black">Legacy Demo Retired</h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          The legacy demo page is no longer available because it depended on simulated data flows.
          Use the real portals below.
        </p>
        <div className="grid gap-3 pt-2">
          <a
            href="/"
            className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-center font-bold"
          >
            Go to Client Portal
          </a>
          <a
            href="/admin"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-center font-bold text-gray-200"
          >
            Go to Admin Portal
          </a>
        </div>
      </div>
    </main>
  );
}
