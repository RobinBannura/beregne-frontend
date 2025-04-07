import React, { useState } from "react";

const API_URL = "https://api.beregne.no/chat";

const AgentChat = ({ prompt }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}\n\nBrukerspørsmål: ${input}`
        })
      });
      const data = await res.json();
      setResponse(data.response || "Ugyldig svar.");
    } catch (err) {
      setError("Kunne ikke koble til beregneren.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hva vil du vite?"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Beregner..." : "Spør"}
        </button>
      </form>

      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded text-left whitespace-pre-wrap">
          {response}
        </div>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AgentChat;