// src/components/ResultCard.jsx
export function ResultCard({ response, sponsor }) {
    return (
      <div className="mt-8 w-full max-w-2xl bg-zinc-900 p-6 rounded-xl shadow text-center text-white border border-gray-700 space-y-4">
        <div className="text-2xl font-mono">{response}</div>
  
        {sponsor && (
          <>
            <hr className="border-zinc-700" />
            <div className="text-sm text-gray-400 font-mono">
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
              <div className="flex justify-center mt-2">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-8 object-contain"
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }