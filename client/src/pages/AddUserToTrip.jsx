import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddUserToTrip = () => {
  const { trip_id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Enter a GitHub username.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(`/api/users-trips/create/${trip_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: trimmedUsername,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to add traveler.");
      }

      navigate(`/trip/get/${trip_id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-form">
      <h2>Add Traveler</h2>

      <p>Add a traveler using their GitHub username.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">GitHub Username</label>

        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter GitHub username"
          autoComplete="off"
          required
        />

        <label htmlFor="trip-id">Trip ID</label>

        <input
          type="number"
          id="trip-id"
          name="trip_id"
          value={trip_id}
          readOnly
        />

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Traveler"}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/trip/get/${trip_id}`)}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </form>
    </main>
  );
};

export default AddUserToTrip;
