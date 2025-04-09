// src/components/ResultCard.jsx
export function ResultCard({ response, sponsor }) {
    return (
      <div className="mt-8 w-full max-w-2xl mx-auto bg-zinc-900 p-6 rounded-xl shadow text-center text-white border border-gray-700">
        <p className="text-xl font-mono mb-6">{response}</p>
        
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
          <div className="mt-4">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="mx-auto w-auto h-6 object-contain"
            />
          </div>
        )}
      </div>
    );
  }