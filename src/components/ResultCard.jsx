// src/components/ResultCard.jsx

import React from "react";

export function ResultCard({ result, sponsor }) {
  if (!result) return null;

  return (
    <div className="flex flex-col items-center justify-center text-center mt-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-md max-w-lg w-full">
        <p className="text-white text-xl mb-4">{result}</p>
        <hr className="border-zinc-700 w-full my-2" />
        <p className="text-sm text-zinc-400 mb-2">
          Beregningen er sponset av{" "}
          {sponsor?.link ? (
            <a
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {sponsor.name}
            </a>
          ) : (
            sponsor?.name
          )}
        </p>
        {sponsor?.logo && (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="h-8 object-contain mt-2"
          />
        )}
      </div>
    </div>
  );
}