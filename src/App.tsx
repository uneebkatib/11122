
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/Login";
import TenMinuteMail from "./pages/TenMinuteMail";
import ThirtyMinuteMail from "./pages/ThirtyMinuteMail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

const App = () => (
  <div className="min-h-screen">
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/10minutemail" element={<TenMinuteMail />} />
      <Route path="/30minutemail" element={<ThirtyMinuteMail />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default App;
