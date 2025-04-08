// src/App.jsx – Minimalistisk og mørk UI med typewriter-placeholder
import { useState } from 'react';
import { useTypewriter } from 'react-simple-typewriter';
import sponsorData from './sponsorData';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [sponsor, setSponsor] = useState(null);

  const examples = [
    'Lån 3 mill, 5 % rente, 25 år',
    'Hvor mye betaler jeg i renter?',
    'ROI på 100 000 i fond, 8 % rente, 5 år',
    'Sparer 5000/mnd i 10 år, 4 % rente',
    'Lease bil til 600 000?',
    'Verditap på 20 % av 600 000?',
    'Leieinntekt 15 000, boligverdi 3,6 mill',
    'Panelovn 1000W, 8 timer daglig',
    'Bytte til varmepumpe, spare 10 000 kr/år',
    '500 euro i NOK?'
  ];

  const [typewriterText] = useTypewriter({
    words: examples,
    loop: 0,
    delaySpeed: 2000,
    deleteSpeed: 40,
  });

  const getCategory = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('bil')) return 'kjøretøy';
    if (lower.includes('lån')) return 'lån';
    if (lower.includes('invest')) return 'investering';
    if (lower.includes('strøm') || lower.includes('energi')) return 'energi';
    if (lower.includes('euro') || lower.includes('dollar')) return 'valuta';
    if (lower.includes('lønn')) return 'lønn';
    return 'default';
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');

    const category = getCategory(input);
    const active = sponsorData[category] || sponsorData['default'];
    setSponsor(active);

    const prompt = `Svar som en økonomisk kalkulator. Gi et presist og kortfattet svar med klare tall, uten forklaringer eller formler. Du skal ikke invitere til samtale. Beregn det brukeren spør om, og inkluder f.eks. terminbeløp, renter og avdrag hvis relevant. På slutten av svaret legger du til teksten \'Beregningen er sponset av ${active.name}\'.`;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `${input}\n${prompt}` }),
    });

    const data = await res.json();
    setResponse(data.result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder={typewriterText || 'Hva vil du beregne?'}
        className="w-full max-w-xl px-4 py-3 text-lg bg-black border-b border-gray-600 placeholder-gray-400 text-white focus:outline-none"
        autoFocus
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 px-6 py-2 bg-white text-black rounded hover:bg-gray-100 font-semibold"
      >
        {loading ? 'Beregner...' : 'Beregne'}
      </button>

      {response && (
        <div className="mt-8 w-full max-w-2xl bg-zinc-900 p-6 rounded-xl shadow text-left whitespace-pre-wrap text-white border border-gray-700">
          <p className="text-lg leading-relaxed">{response}</p>
          {sponsor && (
            <div className="mt-4 text-sm text-gray-400">
              Beregningen er sponset av{' '}
              <a href={sponsor.link} className="underline text-blue-400" target="_blank" rel="noopener noreferrer">
                {sponsor.name}
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
