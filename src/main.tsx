
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'

console.log("Starting application");

const queryClient = new QueryClient();

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, mounting React app");
  createRoot(root).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/test/11122">
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
