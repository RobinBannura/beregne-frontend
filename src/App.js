import { useState } from 'react';
import { useTypewriter } from 'react-simple-typewriter';
import sponsorData from './sponsorData';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [sponsor, setSponsor] = useState(null);

  const examples = [
    'Lån 3 000 000 kr, 5 % rente, 25 år – hva er terminbeløpet?',
    'Sparing 5 000 kr/mnd i 10 år med 4 % rente – hva får jeg?',
    'Avkastning på 100 000 kr investert i fond med 8 % rente i 5 år',
    'Hva koster det å lease en bil til 600 000 kr i 3 år?',
    'Verditap på 20 % av en bil til 600 000 kr – hva er ny verdi?',
    'Yield på bolig: verdi 3,6 mill, leieinntekter 15 000 kr/mnd',
    'Panelovn 1000W brukt 8 timer daglig – hva er strømforbruket?',
    'Bytte til varmepumpe – hvor mye sparer jeg hvis jeg bruker 25 000 kr på strøm per år?',
    'Valutakurs: hva er 500 euro i norske kroner?',
    'Lån 2 500 000 kr, 4,5 % rente, 30 år – hvor mye renter totalt?'
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

    const prompt = `Svar som en økonomisk kalkulator. Gi et presist og kortfattet svar med klare tall, uten forklaringer eller formler. Du skal ikke invitere til samtale. Beregn det brukeren spør om, og inkluder f.eks. terminbeløp, renter og avdrag hvis relevant. På slutten av svaret legger du til teksten 'Beregningen er sponset av ${active.name}'.`;

    try {
      const res = await fetch('https://api.beregne.no/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${input}\n${prompt}` }),
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
        setResponse(result.trim());
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
        <div className="mt-8 w-full max-w-2xl bg-zinc-900 p-6 rounded-xl shadow text-left whitespace-pre-wrap text-white border border-gray-700">
          <p className="text-lg leading-relaxed">{response}</p>
          {sponsor && (
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
              {sponsor.logo && (
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-16 h-6 object-contain"
                />
              )}
              <div>
                Beregningen er sponset av{' '}
                <a
                  href={sponsor.link}
                  className="underline text-blue-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sponsor.name}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}