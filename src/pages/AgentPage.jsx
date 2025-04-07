import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AgentChat from "../components/AgentChat";

const SHEET_ID = "2PACX-1vTi6e6OPof1gpDRsMXMhtmROv7dr1aWNtnWI53pbHSZoBOCG_dIlHkMTD8bS9QxY94MGPNbt8U4gx4Q";

const AgentPage = () => {
  const { navn } = useParams();
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    fetch(`https://opensheet.elk.sh/${SHEET_ID}/${navn}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setAgent(data[0]);
      });
  }, [navn]);

  if (!agent) return <p className="text-center mt-10">Laster agent...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center">
        <img src={agent.AvatarURL} alt={agent.Navn} className="w-24 h-24 rounded-full mx-auto" />
        <h1 className="text-3xl font-bold mt-4">{agent.Navn}</h1>
        <p className="text-gray-600">{agent.Tittel}</p>
        <p className="mt-4 text-sm text-gray-800">{agent.Beskrivelse}</p>
      </div>

      <AgentChat prompt={agent.Prompt} />
    </div>
  );
};

export default AgentPage;