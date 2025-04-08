import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AgentChat from '../components/AgentChat';

const AgentPage = () => {
  const { navn } = useParams();
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const sheetBase =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTi6e6OPof1gpDRsMXMhtmROv7dr1aWNtnWI53pbHSZoBOCG_dIlHkMTD8bS9QxY94MGPNbt8U4gx4Q/pub?output=csv&sheet=';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${sheetBase}${navn}`);
        const csv = await res.text();

        const [headerLine, ...rows] = csv.trim().split('\n');
        const headers = headerLine.split(',');
        const values = rows[0].split(',');

        const data = headers.reduce((acc, key, i) => {
          acc[key.trim()] = values[i]?.trim();
          return acc;
        }, {});

        setAgentData(data);
      } catch (err) {
        console.error('Feil ved henting av agentdata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navn]);

  if (loading) return <div className="text-center mt-10">Laster agent...</div>;
  if (!agentData) return <div className="text-center mt-10 text-red-600">Fant ikke agenten.</div>;

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <img src={agentData.AvatarURL} alt={agentData.Navn} className="w-32 h-32 rounded-full mb-4 shadow" />
      <h1 className="text-3xl font-bold">{agentData.Navn}</h1>
      <p className="text-gray-600">{agentData.Tittel}</p>
      <p className="mt-4 max-w-xl text-center text-gray-700">{agentData.Beskrivelse}</p>

      <div className="w-full max-w-2xl mt-10">
        <AgentChat prompt={agentData.Prompt} />
      </div>
    </div>
  );
};

export default AgentPage;