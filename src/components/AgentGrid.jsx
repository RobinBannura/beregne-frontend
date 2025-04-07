import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SHEET_ID = "2PACX-1vTi6e6OPof1gpDRsMXMhtmROv7dr1aWNtnWI53pbHSZoBOCG_dIlHkMTD8bS9QxY94MGPNbt8U4gx4Q";
const AGENTS = ["Martin", "Hassan", "Magnus", "Robin", "Espen", "Kris", "Nora"];

const AgentGrid = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    Promise.all(
      AGENTS.map(name =>
        fetch(`https://opensheet.elk.sh/${SHEET_ID}/${name}`).then(res => res.json())
      )
    ).then(results => {
      setAgents(results.flat());
    });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {agents.map((agent, idx) => (
        <Link key={idx} to={`/agent/${agent.Navn}`}>
          <div className="rounded-2xl border p-4 hover:shadow-lg">
            <img src={agent.AvatarURL} alt={agent.Navn} className="w-20 h-20 rounded-full mx-auto" />
            <h2 className="text-xl font-semibold text-center mt-2">{agent.Navn}</h2>
            <p className="text-center text-sm text-gray-500">{agent.Tittel}</p>
            <p className="text-sm mt-2 text-center">{agent.Beskrivelse}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AgentGrid;