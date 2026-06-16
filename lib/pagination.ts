export const PAGE_SIZE = 10;

export function getPage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function getPagination(page: number) {
  return {
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  };
}

export function getShowingRange(page: number, total: number) {
  if (total === 0) {
    return { start: 0, end: 0 };
  }

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  return { start, end };
}
