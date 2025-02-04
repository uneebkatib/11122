
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/Login";
import TenMinuteMail from "./pages/TenMinuteMail";
import ThirtyMinuteMail from "./pages/ThirtyMinuteMail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/10minutemail" element={<TenMinuteMail />} />
          <Route path="/30minutemail" element={<ThirtyMinuteMail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  </QueryClientProvider>
);

export default App;
