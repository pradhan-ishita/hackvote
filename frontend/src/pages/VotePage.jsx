import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API_BASE_URL from "../config";

const socket = io(API_BASE_URL, {
  transports: ["websocket", "polling"],
});

export default function VotePage() {
  const [eventTitle, setEventTitle] = useState("");
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();

    socket.on("leaderboard_update", (data) => {
      setLeaderboard(data);
    });

    socket.on("event_update", (event) => {
      if (event?.title) setEventTitle(event.title);
    });

    return () => {
      socket.off("leaderboard_update");
      socket.off("event_update");
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const eventRes = await fetch(`${API_BASE_URL}/api/event`);
      const eventData = await eventRes.json();

      setEventTitle(eventData?.event?.title || "Hackathon Event");
      setTeams(eventData?.teams || []);

      const leaderboardRes = await fetch(`${API_BASE_URL}/api/leaderboard`);
      const leaderboardData = await leaderboardRes.json();
      setLeaderboard(leaderboardData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (teamId) => {
    try {
      let voterId = localStorage.getItem("voterId");

      if (!voterId) {
        voterId = crypto.randomUUID();
        localStorage.setItem("voterId", voterId);
      }

      const res = await fetch(`${API_BASE_URL}/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voterId, teamId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || "Vote failed");
        return;
      }

      setMessage(`Vote submitted for ${data.teamName}`);
    } catch (error) {
      console.error("Vote error:", error);
      setMessage("Vote failed");
    }
  };

  if (loading) {
    return <div style={{ color: "white", padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", color: "white", background: "#050816", minHeight: "100vh" }}>
      <h1>{eventTitle}</h1>

      {message && <p>{message}</p>}

      <h2>Teams</h2>
      {teams.length === 0 ? (
        <p>No teams found</p>
      ) : (
        teams.map((team) => (
          <div
            key={team._id}
            style={{
              border: "1px solid #333",
              marginBottom: "10px",
              padding: "12px",
              borderRadius: "10px",
              background: "#1b1b35",
            }}
          >
            <p>{team.name}</p>
            <button onClick={() => handleVote(team._id)}>Vote</button>
          </div>
        ))
      )}

      <h2 style={{ marginTop: "30px" }}>Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No votes yet</p>
      ) : (
        leaderboard.map((item, index) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #333",
              marginBottom: "10px",
              padding: "12px",
              borderRadius: "10px",
              background: "#1b1b35",
            }}
          >
            <p>
              #{index + 1} {item.name} - {item.votes} votes
            </p>
          </div>
        ))
      )}
    </div>
  );
}