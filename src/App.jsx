import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Start from "./pages/Start";
import Room from "./pages/Room";

import { cleanupExpiredRooms } from "./utils/cleanupRooms";

function App() {
  useEffect(() => {
    // Run once when app starts
    cleanupExpiredRooms();

    // Run every 10 minutes
    const interval = setInterval(() => {
      cleanupExpiredRooms();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/s/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;