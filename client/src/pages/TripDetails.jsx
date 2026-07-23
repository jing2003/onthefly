import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./TripDetails.css";

const TripDetails = ({ data }) => {
  const { id } = useParams();
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const trip = data?.find((trip) => trip.id.toString() === id);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/activities/" + id);
      const data = await response.json();
      setActivities(data);
    };

    const fetchDestinations = async () => {
      const response = await fetch(
        "/api/trips-destinations/destinations/" + id,
      );
      const data = await response.json();
      setDestinations(data);
    };

    fetchActivities();
    fetchDestinations();
  }, [id]);

  return (
    <div className="trip-details">
      <h2>{trip?.title || trip?.name || "Trip Details"}</h2>

      <h3>Destinations</h3>
      {destinations.length > 0 ? (
        destinations.map((destination) => (
          <div key={destination.id}>
            <p>{destination.destination}</p>
          </div>
        ))
      ) : (
        <p>No destinations added yet.</p>
      )}

      <h3>Activities</h3>
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id}>
            <p>{activity.activity}</p>
          </div>
        ))
      ) : (
        <p>No activities added yet.</p>
      )}
    </div>
  );
};

export default TripDetails;
