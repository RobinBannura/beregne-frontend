import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const AgentChat = ({ prompt }) => {
  const { navn } = useParams(); // henter agentnavn fra URL
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = 'https://api.beregne.no/chat';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input || loading) return;

    setResponse('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${prompt} ${input}` }),
      });

      const data = await res.json();
      setResponse(data?.response || 'Noe gikk galt. Prøv igjen.');
    } catch (err) {
      setResponse('Feil ved henting av beregning.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hva vil du beregne?"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Beregner...' : 'Beregne'}
        </button>
      </form>

      {response && (
        <div className="mt-6 max-w-2xl bg-gray-100 p-4 rounded-lg shadow text-left whitespace-pre-wrap">
          {response}

          {/* Sponsor for Jørgen */}
          {navn.toLowerCase() === 'jørgen' && (
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
              <img
                src="/sponsors/varebil-logo.png"
                alt="Varebil.no"
                className="h-6 w-auto"
              />
              <span>
                Beregningen er sponset av{' '}
                <a
                  href="https://varebil.no"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'click', {
                        event_category: 'Sponsorlenke',
                        event_label: 'Varebil.no',
                      });
                    }
                  }}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Varebil.no
                </a>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentChat;