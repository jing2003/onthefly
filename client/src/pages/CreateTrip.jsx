import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTrip = ({ user }) => {
  const navigate = useNavigate();

  const [trip, setTrip] = useState({
    title: "",
    description: "",
    img_url: "",
    num_days: 0,
    start_date: "",
    end_date: "",
    total_cost: 0,
    username: user?.username ?? "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTrip((previousTrip) => ({
      ...previousTrip,
      [name]: value,
    }));
  };

  const createTrip = async (event) => {
    event.preventDefault();

    if (!user?.username) {
      setError("You must be logged in to create a trip.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...trip,
          username: user.username,
          num_days: Number(trip.num_days),
          total_cost: Number(trip.total_cost),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create trip.");
      }

      navigate(`/trip/get/${data.id}`);
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div>
        <h3>Create New Trip</h3>
      </div>

      <form onSubmit={createTrip}>
        <label htmlFor="title">Title</label>

        <input
          type="text"
          id="title"
          name="title"
          value={trip.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>

        <textarea
          rows="5"
          cols="50"
          id="description"
          name="description"
          value={trip.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="img_url">Image URL</label>

        <input
          type="url"
          id="img_url"
          name="img_url"
          value={trip.img_url}
          onChange={handleChange}
        />

        <label htmlFor="num_days">Number of Days</label>

        <input
          type="number"
          id="num_days"
          name="num_days"
          min="1"
          value={trip.num_days}
          onChange={handleChange}
          required
        />

        <label htmlFor="start_date">Start Date</label>

        <input
          type="date"
          id="start_date"
          name="start_date"
          value={trip.start_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="end_date">End Date</label>

        <input
          type="date"
          id="end_date"
          name="end_date"
          value={trip.end_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="total_cost">Total Cost</label>

        <input
          type="number"
          id="total_cost"
          name="total_cost"
          min="0"
          step="0.01"
          value={trip.total_cost}
          onChange={handleChange}
          required
        />

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </main>
  );
};

export default CreateTrip;
