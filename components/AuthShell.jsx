export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full card card-static overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* LEFT: form */}
        <div className="p-8 md:col-span-7 space-y-5">
          <span className="px-3 py-1 rounded-full text-xs ai-pill">FIREBASE JWT AUTH</span>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-sm opacity-75">{subtitle}</p>
          {children}
        </div>

        {/* RIGHT: info panel (hidden on small screens) */}
        <div className="hidden md:flex md:col-span-5 p-8 flex-col justify-between auth-side">
          <div className="text-xs font-bold">{'// SYSTEM ARCHITECTURE READY'}</div>
          <div className="space-y-3 my-6">
            <div className="card p-3.5 text-xs font-bold">⬡ React / Next.js Frontend</div>
            <div className="card p-3.5 text-xs font-bold">⬡ FastAPI + Meta Prophet ML</div>
            <div className="card p-3.5 text-xs font-bold">⬡ DeepSeek AI Decision Copilot</div>
          </div>
          <div className="text-[11px] font-bold opacity-70">B.E. Final Year Project, Oct 13 Milestone Build</div>
        </div>
      </div>
    </div>
  );
}
