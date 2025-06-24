import "react";
import { useState, useEffect } from "react";
import { MCQChallenge } from "../challenge/MCQChallenge";
import { useAPI } from "../utils/api";

export function HistoryPanel() {
    const { makeRequest } = useAPI();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
          const data = await makeRequest("my-history")
          
          setHistory(data.challenges);
      } catch (err) {
        setError(err.message || "Failed to fetch history.");
      } finally {
        setLoading(false);
      }
  };

  if (loading) {
    return <div className="loading">Loading History...</div>;
  }
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchHistory}>Retry</button>
      </div>
    );
  }

  return (
    <div className="history-panel">
      <h2>History</h2>
      {history.length === 0 ? (
        <p>No Challenge History</p>
      ) : (
        <div className="history-list">
          {history.map((challenge) => {
            return (
              <MCQChallenge
                challenge={challenge}
                key={challenge.id}
                showExplanation
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
