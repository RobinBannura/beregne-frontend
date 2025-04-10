import { useState } from 'react';
import { useTypewriter } from 'react-simple-typewriter';
import { ResultCard } from './components/ResultCard';
import sponsorData from './sponsorData';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [sponsor, setSponsor] = useState(null);

  const examples = [
    'Lån 3 mill – 5 % rente, 25 år. Terminbeløp?',
    'Sparing 5 000/mnd i 10 år med 4 % rente',
    'Avkastning: 100 000 kr i fond, 8 % rente, 5 år',
    'Leasing 600 000 kr bil over 3 år. Kostnad?',
    'Bilverdi etter 20 % fall fra 600 000 kr',
    'Yield: bolig 3,6 mill, leie 15 000/mnd',
    'Panelovn 1000W, 8 t/dag. Strømforbruk?',
    'Varmepumpe: strømbruk 25 000 kr/år. Sparing?',
    '500 euro i NOK (valutakurs)',
    'Lån 2,5 mill – 4,5 % rente, 30 år. Renter totalt?'
  ];

  const [typewriterText] = useTypewriter({
    words: examples,
    loop: 0,
    delaySpeed: 2000,
    deleteSpeed: 40,
  });

  const getCategory = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('boliglån')) return 'boliglån';
    if (lower.includes('billån')) return 'kjøretøy';
    if (lower.includes('forbrukslån')) return 'kjøretøy';
    if (lower.includes('lån')) return 'lån';
    if (lower.includes('invest')) return 'investering';
    if (lower.includes('strøm') || lower.includes('energi') || lower.includes('panelovn')) return 'energi';
    if (lower.includes('euro') || lower.includes('dollar') || lower.includes('nok')) return 'valuta';
    if (lower.includes('lønn')) return 'lønn';
    return 'default';
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    setSponsor(null);

    const category = getCategory(input);
    const active = sponsorData[category] || sponsorData['default'];
    setSponsor(active);

    const prompt = `Svar som en økonomisk kalkulator. Gi et strukturert svar med linjeskift og tydelige inndelinger. Beregn og oppgi:
- Terminbeløp per måned
- Renter og avdrag per måned
- Totale renter og totalkostnad for lånet
- Nominell og effektiv rente (inkludert termingebyr på 50 kr)
Bruk formatet:
Terminbeløp per måned: ...\nRenter per måned: ...\nAvdrag per måned: ...\nTotalt renter: ...\nTotalkostnad: ...\nNominell rente: ...\nEffektiv rente: ...
Svar kortfattet og uten forklaringer. På slutten av svaret legger du til teksten 'Beregningen er sponset av ${active.name}'.`;

    try {
      const res = await fetch('https://api.beregne.no/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (jsonError) {
        console.error('❌ Ugyldig JSON fra API:', text);
        throw new Error('Ugyldig svar fra API');
      }

      const result = data?.result || data?.response;

      if (result) {
        const split = result.trim().split(/Beregningen er sponset av/i);
        setResponse(split[0].trim());
      } else {
        setResponse('Ingen beregning mottatt fra server.');
      }
    } catch (err) {
      console.error('Feil ved API-kall:', err.message);
      setResponse('Beklager, det oppsto en feil. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
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
        <ResultCard response={response} sponsor={sponsor} />
      )}
    </main>
  );
}
