import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import App from "./App";

export default function Root() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* ALL PAGES GO BELOW NAVBAR */}
        <div className="workspace">
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
