"use client"; // Must be a client module
import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60, // keep in cache for 1 hour
        refetchOnWindowFocus: false, // prevent refetch when tab is focused
      },
    },
  });
