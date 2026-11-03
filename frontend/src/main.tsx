import { StrictMode, createRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider, closeSnackbar, type SnackbarKey } from "notistack";
import { X } from "lucide-react";
import { AuthProvider } from "./features/auth/context/AuthContext";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();
const notistackRef = createRef<SnackbarProvider>();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SnackbarProvider
          ref={notistackRef}
          maxSnack={4}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          action={(snackbarKey: SnackbarKey) => (
            <button
              type="button"
              onClick={() => {
                if (notistackRef.current) {
                  notistackRef.current.closeSnackbar(snackbarKey);
                } else {
                  closeSnackbar(snackbarKey);
                }
              }}
              className="inline-flex items-center justify-center p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          )}
        >
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
