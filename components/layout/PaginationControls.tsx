import Link from "next/link";

type PaginationControlsProps = {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
};

function buildHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") {
      params.set(key, value);
    }
  }

  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

export default function PaginationControls({
  page,
  total,
  pageSize,
  basePath,
  searchParams = {},
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(currentPage * pageSize, total);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages && total > 0;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {start}–{end} of {total}
      </span>
      <div className="flex gap-2">
        {hasPrevious ? (
          <Link
            href={buildHref(basePath, searchParams, currentPage - 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-400">
            Previous
          </span>
        )}
        {hasNext ? (
          <Link
            href={buildHref(basePath, searchParams, currentPage + 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-400">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
