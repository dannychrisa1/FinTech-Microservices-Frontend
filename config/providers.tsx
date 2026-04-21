import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner-native";
import { queryClient } from "./query-client";

const QueryClient = queryClient;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={QueryClient}>
      {children}
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
