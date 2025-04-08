// src/App.jsx
import React, { useState, useEffect } from "react";
import sponsorData from "./sponsorData"; // Mapping søkeord -> sponsor

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sponsor, setSponsor] = useState(null);
  const API_URL = "https://api.beregne.no/chat";

  const handleSponsorMatch = (query) => {
    const match = sponsorData.find((item) =>
      item.keywords.some((kw) => query.toLowerCase().includes(kw))
    );
    const fallback = sponsorData.find((item) => item.default);
    setSponsor(match || fallback || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    setIsLoading(true);
    setResponse("");
    handleSponsorMatch(prompt);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.response || "Noe gikk galt. Prøv igjen.");

      // Logg beregningen til Google Sheets
      fetch("https://script.google.com/macros/s/AKfycbwrx9ToGQ-BoIZ1oUQCLvjsp1SkFCDkP2pB-cjKymdruBkHLHZGOd2A-bOyKpwNYIeTAg/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          sponsorName: sponsor?.sponsor || "Uten sponsor",
          sponsorLink: sponsor?.link || ""
        }),
      });

    } catch (err) {
      setResponse("Kunne ikke koble til API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Beregne.no</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <input
          className="w-full p-3 border rounded-lg mb-4 shadow"
          placeholder="Hva vil du beregne?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          type="submit"
        >
          {isLoading ? "Beregner..." : "Beregne"}
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow max-w-2xl">
          <div className="whitespace-pre-wrap text-left">{response}</div>
          {sponsor && (
            <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
              {sponsor.logo && (
                <img src={sponsor.logo} alt={sponsor.name} className="h-6" />
              )}
              <span>
                Beregningen er sponset av{' '}
                <a
                  href={sponsor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {sponsor.name}
                </a>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
