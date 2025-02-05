
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from './App'
import './index.css'

console.log("Starting application...");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found! Make sure index.html contains a div with id='root'");
} else {
  console.log("Root element found, mounting React app");
  createRoot(root).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
  console.log("React app mounted successfully");
}
