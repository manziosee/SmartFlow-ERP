"use client";

import { useState, useMemo } from "react";

export type SortDir = "asc" | "desc";

export interface SortState {
  column: string;
  direction: SortDir;
}

export function useTable<T>(
  data: T[],
  options: {
    defaultSort?: SortState;
    pageSize?: number;
    sortFn?: (a: T, b: T, sort: SortState) => number;
  } = {}
) {
  const { defaultSort, pageSize: defaultPageSize = 20, sortFn } = options;
  const [sort, setSort] = useState<SortState | null>(defaultSort ?? null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const toggleSort = (column: string) => {
    setSort((prev) => {
      if (prev?.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
    setPage(1);
  };

  const sorted = useMemo(() => {
    if (!sort) return data;
    return [...data].sort((a, b) => {
      if (sortFn) return sortFn(a, b, sort);
      const aVal = (a as any)[sort.column];
      const bVal = (b as any)[sort.column];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp =
        typeof aVal === "string"
          ? aVal.localeCompare(bVal)
          : aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [data, sort, sortFn]);

  const paginated = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize]
  );

  return {
    sort,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    paginated,
    total: sorted.length,
  };
}
