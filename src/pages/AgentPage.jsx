// src/pages/AgentPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AgentChat from "../components/AgentChat";

const AgentPage = () => {
  const { name } = useParams();
  const [agent, setAgent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vTi6e6OPof1gpDRsMXMhtmROv7dr1aWNtnWI53pbHSZoBOCG_dIlHkMTD8bS9QxY94MGPNbt8U4gx4Q/pub?output=csv"
        );
        const csv = await response.text();
        const lines = csv.split("\n").map((line) => line.trim()).filter(Boolean);
        const headers = lines[0].split(",").map((h) => h.trim());
        const agents = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
        });

        const match = agents.find(
          (a) => a.Navn.toLowerCase() === decodeURIComponent(name).toLowerCase()
        );

        if (match) {
          setAgent(match);
        } else {
          setError("Fant ikke agenten.");
        }
      } catch (err) {
        setError("Kunne ikke hente data.");
      }
    };

    fetchAgentData();
  }, [name]);

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!agent) {
    return <div className="text-center mt-10">Laster agent...</div>;
  }

  return <AgentChat agent={agent} />;
};

export default AgentPage;