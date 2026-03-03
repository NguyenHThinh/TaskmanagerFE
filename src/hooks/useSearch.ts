"use client";

import { useQuery } from "@tanstack/react-query";
import { search } from "@/services/searchService";
import { useDebounce } from "./useDebounce";

export const SEARCH_QUERY_KEY = ["search"];

export const useSearch = (query: string, debounceMs = 300) => {
  const debouncedQuery = useDebounce(query, debounceMs);

  const queryResult = useQuery({
    queryKey: [...SEARCH_QUERY_KEY, debouncedQuery],
    queryFn: () => search(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  return {
    ...queryResult,
    debouncedQuery,
  };
};
