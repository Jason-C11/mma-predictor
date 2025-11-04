"use client"; // Client component
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/queryClient";

export default function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  // Create a QueryClient per app instance
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
