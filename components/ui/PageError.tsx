"use client";

import { useRouter } from "next/navigation";

type PageErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PageError({ error, reset }: PageErrorProps) {
  const router = useRouter();
  const description =
    error.message || "The page could not be loaded. Please try again.";

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
          !
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      </section>
    </div>
  );
}
