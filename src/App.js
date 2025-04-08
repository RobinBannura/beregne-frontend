// ✅ NY HOVEDKOMPONENT FOR BEREGNE.NO – FULL OPPDATERING
// Inkluderer: typewriter + rullerende forslag + styling + kort prompt + sponsorvisning

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import sponsorData from './sponsorData';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [activeSponsor, setActiveSponsor] = useState(null);

  const examples = [
    'Boliglån 3 mill med 5 % rente over 25 år',
    'Hva koster det å lease en bil til 600 000?',
    'Strømforbruk ved panelovn 1000W',
    'Hva er 500 EUR i NOK?',
    'ROI på 100 000 investert med 8 % over 5 år?',
    'Kostnad for nytt bad på 5 m²?',
    'Nettolønn av 700 000?',
    'Hva er 27 % av 4 950 kr?',
    'Terminbeløp med 4 % rente i 20 år',
  ];

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');

    const category = getCategory(input);
    const sponsor = sponsorData[category] || sponsorData['default'];
    setActiveSponsor(sponsor);

    const prompt = `Svar som en økonomisk kalkulator. Gi et presist og kortfattet svar med klare tall, uten forklaringer eller formler. Du skal ikke invitere til samtale. Beregn det brukeren spør om, og inkluder f.eks. terminbeløp, renter og avdrag hvis relevant. På slutten av svaret legger du til teksten "Beregningen er sponset av ${sponsor.name}".`;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: `${input}\n${prompt}` }),
    });

    const data = await res.json();
    setResponse(data.result);
    setLoading(false);
  };

  const getCategory = (text) => {
    text = text.toLowerCase();
    if (text.includes('bil') || text.includes('leasing')) return 'kjøretøy';
    if (text.includes('lån')) return 'lån';
    if (text.includes('invest') || text.includes('fond')) return 'investering';
    if (text.includes('strøm') || text.includes('energi')) return 'energi';
    if (text.includes('euro') || text.includes('dollar')) return 'valuta';
    if (text.includes('lønn')) return 'lønn';
    return 'default';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 p-6 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Beregne.no</h1>

      <p className="text-center text-lg mb-6 max-w-xl text-gray-600">
        <Typewriter
          words={examples}
          loop={0}
          cursor
          cursorStyle="_"
          typeSpeed={50}
          deleteSpeed={40}
          delaySpeed={2000}
        />
      </p>

      <div className="flex w-full max-w-2xl items-center space-x-2">
        <Input
          type="text"
          placeholder="Hva vil du beregne?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : 'Beregne'}
        </Button>
      </div>

      {response && (
        <Card className="mt-6 p-6 w-full max-w-2xl text-left bg-white shadow-lg">
          <p className="whitespace-pre-line text-lg leading-relaxed font-medium">{response}</p>

          {activeSponsor && (
            <div className="flex items-center gap-2 mt-6 border-t pt-4 text-sm text-gray-500">
              <span>Beregningen er sponset av</span>
              {activeSponsor.logo && (
                <img src={activeSponsor.logo} alt={activeSponsor.name} className="h-6" />
              )}
              {activeSponsor.link && (
                <a
                  href={activeSponsor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500"
                >
                  {activeSponsor.name}
                </a>
              )}
            </div>
          )}
        </Card>
      )}
    </main>
  );
}
