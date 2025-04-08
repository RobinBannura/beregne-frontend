import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AgentGrid = () => {
  const [agents, setAgents] = useState([]);
  const sheetURL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTi6e6OPof1gpDRsMXMhtmROv7dr1aWNtnWI53pbHSZoBOCG_dIlHkMTD8bS9QxY94MGPNbt8U4gx4Q/pub?output=csv&sheet=Agenter';

  // Hardkodede avatarer
  const avatarOverrides = {
    martin: 'https://i.imgur.com/hbyMIvJ.png',
    // kris: 'https://i.imgur.com/...png',
    // magnus: 'https://i.imgur.com/...png'
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(sheetURL);
        const csv = await res.text();

        const [headerLine, ...rows] = csv.trim().split('\n');
        const headers = headerLine.split(',');

        const parsed = rows.map((row) => {
          const values = row.split(',');
          const data = headers.reduce((acc, key, i) => {
            acc[key.trim()] = values[i]?.trim();
            return acc;
          }, {});
          return data;
        });

        setAgents(parsed);
      } catch (err) {
        console.error('Feil ved henting av agentoversikt:', err);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Våre agenter</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {agents.map((agent, index) => {
          const navnKey = agent.Navn?.toLowerCase() || '';
          const avatar = avatarOverrides[navnKey] || agent.AvatarURL || 'https://via.placeholder.com/150';

          return (
            <Link
              to={`/agent/${navnKey}`}
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-6 text-center"
            >
              <img
                src={avatar}
                alt={agent.Navn}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{agent.Navn}</h3>
              <p className="text-gray-500">{agent.Tittel}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AgentGrid;