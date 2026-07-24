import { useState } from "react";

const ActivityBtn = ({ id, activity, num_votes, API_URL }) => {
  const [numVotes, setNumVotes] = useState(num_votes);
  const [error, setError] = useState("");

  const updateCount = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/activities/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          num_votes: numVotes + 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update the vote count.");
      }

      setNumVotes((currentVotes) => currentVotes + 1);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <button
        type="button"
        className="activityBtn"
        id={id}
        onClick={updateCount}
      >
        {activity}
        <br />△ {numVotes} Upvotes
      </button>

      {error && <p className="error">{error}</p>}
    </>
  );
};

export default ActivityBtn;
