import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const AgentChat = ({ prompt }) => {
  const { navn } = useParams();
  const agentName = navn?.toLowerCase();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = 'https://api.beregne.no/chat';

  const agentTips = {
    martin: [
      'Hva blir terminbeløpet på et lån på 3 millioner med en rente på 5%?',
      'Hvor mye må jeg betale i renter?',
    ],
    hassan: [
      'Hva er ROI på investering i fond med 100 000 kr og 8 % årlig avkastning?',
      'Hvor mye vil jeg ha om 10 år om jeg sparer 5000 kr per måned med 4% rente?',
    ],
    jørgen: [
      'Hva koster det å lease en bil?',
      'Hva utgjør et verditap på 20% av 600.000?',
    ],
    marie: [
      'Hva er yield på en utleiebolig med leieinntekt 15.000 og kjøpesum 4 mill?',
      'Hva er netto leieinntekt etter 20 % fratrekk og 3.000 i felleskostnader?',
    ],
    nora: [
      'Hvor mye strøm bruker en panelovn på 1 000 watt i 5 timer?',
      'Hvor mye kan jeg spare på varmepumpe som kutter strøm med 30 %?',
    ],
    kristine: [
      'Hva er 500 euro i norske kroner?',
      'Hvor mye får jeg for 10 000 NOK i USD?',
    ],
    espen: [
      'Hva er nettolønn av 600 000?',
      'Hva er timelønnen min om jeg tjener 600.000 i året?',
    ],
    magnus: [
      'Hvor mye maling trenger jeg til 40 m²?',
      'Hva koster det å pusse opp bad i Oslo?',
    ],
    felix: [
      'Hva er 27 % av 4 950 kr?',
      'Konverter 100 miles til km',
    ],
  };

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

  const tips = agentTips[agentName] || [];

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

      {tips.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-1">💡 Eksempler:</p>
          <ul className="list-disc pl-5 space-y-1">
            {tips.map((tip, idx) => (
              <li
                key={idx}
                className="cursor-pointer hover:text-black transition"
                onClick={() => setInput(tip)}
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {response && (
        <div className="mt-6 max-w-2xl bg-gray-100 p-4 rounded-lg shadow text-left whitespace-pre-wrap">
          {response}

          {/* Sponsor for Jørgen */}
          {agentName === 'jørgen' && (
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