import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SeatSelection from "./pages/SeatSelection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seats/:id" element={<SeatSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;