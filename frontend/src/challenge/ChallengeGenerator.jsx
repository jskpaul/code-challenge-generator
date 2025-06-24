import "react";
import { useState, useEffect } from "react";
import { MCQChallenge } from "./MCQChallenge";
import { useAPI } from "../utils/api";

export function ChallengeGenerator() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [quota, setQuota] = useState(null);
  const { makeRequest } = useAPI();
  useEffect(() => {
    fetchQuota();
  }, []);

  const fetchQuota = async () => {
    try {
      const data = await makeRequest("quota");
      console.log(data);
      setQuota(data);
    } catch (err) {
      console.error("Error fetching quota:", err);
    }
  };

  const generateChallenge = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await makeRequest("generate-challenge", {
        method: "POST",
        body: JSON.stringify({ difficulty }),
      });
      console.log("Generated Challenge:", data);
      setChallenge(data);
      fetchQuota(); // Refresh quota after generating a challenge
    } catch (err) {
      setError(err.message || "Failed to generate challenge.");
    } finally {
      setLoading(false);
    }
  };

  const getNextResetTime = () => {
    if (!quota?.last_reset_date) return null;
    const resetDate = new Date(quota.last_reset_date);
    resetDate.setHours(resetDate.getHours() + 24);
    return resetDate;
  };

  return (
    <div className="challenge-container">
      <h2>Coding Challenge Generator</h2>

      <div className="quota-display">
        <p>Challenge remaining today: {quota?.quota_remaining || 0}</p>
        {quota?.quota_remaining === 0 && (
          <p>Next reset: {getNextResetTime()?.toLocaleString}</p>
        )}
      </div>

      <div className="difficulty-selector">
        <label htmlFor="difficulty">Select Difficulty</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={loading}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        onClick={generateChallenge}
        disabled={false}
        className="generate-button"
      >
        {loading ? "Generating..." : "Generate Challenge"}
      </button>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {challenge && <MCQChallenge challenge={challenge} />}
    </div>
  );
}
