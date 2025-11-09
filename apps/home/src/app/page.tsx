import { apps } from "@/constants/apps";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      <main className="w-full max-w-5xl px-6 py-20 sm:px-8">
        <div className="mb-16 text-center">
          <h1
            className="text-6xl font-normal tracking-tight text-[#1a1a1a] sm:text-7xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Show Me How
          </h1>
          <p className="mt-6 text-lg text-[#666] max-w-2xl mx-auto leading-relaxed">
            A repository of well crafted app UX flows
          </p>
          <div className="mt-8 h-px w-24 bg-[#1a1a1a] mx-auto" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.href}
              className="group relative block rounded-sm border border-[#e5e5e5] bg-white p-8 transition-all hover:border-[#1a1a1a] hover:shadow-[4px_4px_0_0_#1a1a1a]"
            >
              <h2
                className="mb-3 text-2xl font-normal text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {app.name}
              </h2>
              <p className="text-sm text-[#666] leading-relaxed">
                {app.description}
              </p>
              <div className="mt-4 text-[#1a1a1a] opacity-0 transition-opacity group-hover:opacity-100">
                →
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
