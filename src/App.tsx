
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import TenMinuteMail from "./pages/TenMinuteMail";
import ThirtyMinuteMail from "./pages/ThirtyMinuteMail";
import Admin from "./pages/Admin";
import Katib from "./pages/Katib";
import NotFound from "./pages/NotFound";

const App = () => (
  <div className="min-h-screen">
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/10minutemail" element={<TenMinuteMail />} />
      <Route path="/30minutemail" element={<ThirtyMinuteMail />} />
      <Route path="/admin" element={<NotFound />} />
      <Route path="/katib" element={<Katib />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default App;
