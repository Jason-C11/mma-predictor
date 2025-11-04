"use client"; // Must be a client module
import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => new QueryClient();
