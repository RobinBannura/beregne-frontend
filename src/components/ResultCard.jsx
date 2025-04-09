export function ResultCard({ response, sponsor }) {
    // Fjern sponsor-tekst fra responsen hvis den finnes
    const cleanResponse = response.replace(/Beregningen er sponset av .*/gi, '').trim();
  
    return (
      <div className="mt-8 w-full max-w-2xl mx-auto bg-zinc-900 p-6 rounded-xl shadow text-white border border-gray-700 text-center">
        <p className="text-xl font-mono mb-6">{cleanResponse}</p>
  
        <div className="border-t border-gray-700 pt-4 text-sm text-gray-400">
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
  
        {sponsor.logo && (
          <div className="mt-4 flex justify-center">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="h-6 object-contain"
            />
          </div>
        )}
      </div>
    );
  }