"use client";

import { SessionProvider } from "next-auth/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={false}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          closeButton={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          theme="light"
        />
      </QueryClientProvider>
    </SessionProvider>
  )
}