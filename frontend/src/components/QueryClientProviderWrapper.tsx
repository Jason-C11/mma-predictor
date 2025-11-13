"use client"; // Client component
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/queryClient";

export default function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  // Create a QueryClient per app instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60,    // keep in cache for 1 hour
        refetchOnWindowFocus: false, // prevent refetch when tab is focused
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
