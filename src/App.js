import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentGrid from "./components/AgentGrid";
import AgentPage from "./pages/AgentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="p-6 max-w-screen-lg mx-auto">
            <h1 className="text-4xl font-bold text-center mb-6">Beregne.no</h1>
            <AgentGrid />
          </div>
        } />
        <Route path="/agent/:navn" element={<AgentPage />} />
      </Routes>
    </Router>
  );
}

export default App;