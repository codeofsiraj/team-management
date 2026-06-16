type PageLoaderProps = {
  title?: string;
};

export default function PageLoader({ title = "Loading" }: PageLoaderProps) {
  const rows = Array.from({ length: 6 }, (_, index) => index);
  const cards = Array.from({ length: 4 }, (_, index) => index);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-56 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
      </header>

      <div className="sr-only">{title}</div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-8 w-16 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-3 w-full animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="divide-y divide-slate-200">
          {rows.map((row) => (
            <div
              key={row}
              className="grid gap-4 px-4 py-4 sm:grid-cols-[1.4fr_1fr_1fr_120px]"
            >
              <div className="h-4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
