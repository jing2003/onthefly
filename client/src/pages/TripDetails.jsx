import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ActivityBtn from "../components/ActivityBtn";
import DestinationBtn from "../components/DestinationBtn";

const TripDetails = ({ data = [] }) => {
  const { id } = useParams();

  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [travelers, setTravelers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [trip, setTrip] = useState({
    id: 0,
    title: "",
    description: "",
    img_url: "",
    num_days: 0,
    start_date: "",
    end_date: "",
    total_cost: 0,
  });

  useEffect(() => {
    const result = data.find((item) => item.id === Number(id));

    if (result) {
      setTrip({
        id: Number(result.id),
        title: result.title,
        description: result.description,
        img_url: result.img_url,
        num_days: Number(result.num_days),
        start_date: result.start_date?.slice(0, 10) ?? "",
        end_date: result.end_date?.slice(0, 10) ?? "",
        total_cost: result.total_cost,
      });
    }
  }, [data, id]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const [activitiesResponse, destinationsResponse, travelersResponse] =
          await Promise.all([
            fetch(`/api/activities/${id}`),
            fetch(`/api/trips-destinations/destinations/${id}`),
            fetch(`/api/users-trips/users/${id}`, {
              credentials: "include",
            }),
          ]);

        if (!activitiesResponse.ok) {
          throw new Error("Failed to fetch activities.");
        }

        if (!destinationsResponse.ok) {
          throw new Error("Failed to fetch destinations.");
        }

        if (!travelersResponse.ok) {
          throw new Error("Failed to fetch travelers.");
        }

        const [activitiesData, destinationsData, travelersData] =
          await Promise.all([
            activitiesResponse.json(),
            destinationsResponse.json(),
            travelersResponse.json(),
          ]);

        setActivities(activitiesData);
        setDestinations(destinationsData);
        setTravelers(travelersData);
      } catch (error) {
        console.error("Error loading trip details:", error);
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  return (
    <main className="trip-details">
      <section className="trip-overview">
        <div className="trip-information">
          <span className="trip-label">Trip details</span>

          <h1>{trip.title}</h1>

          <div className="trip-metadata">
            <span>
              🗓️ {trip.num_days} {trip.num_days === 1 ? "day" : "days"}
            </span>

            <span>🛫 {trip.start_date}</span>
            <span>🛬 {trip.end_date}</span>
          </div>

          <p className="trip-description">{trip.description}</p>
        </div>

        <div className="trip-image-container">
          {trip.img_url ? (
            <img
              className="trip-image"
              src={trip.img_url}
              alt={trip.title || "Trip destination"}
            />
          ) : (
            <div className="trip-image-placeholder">No image available</div>
          )}
        </div>
      </section>

      {loadError && (
        <p className="trip-error-message" role="alert">
          {loadError}
        </p>
      )}

      <section className="trip-content-grid">
        <div className="trip-content-section">
          <div className="trip-section-header">
            <div>
              <span className="trip-section-label">Itinerary</span>
              <h2>Activities</h2>
            </div>

            <Link className="trip-add-link" to={`/activity/create/${id}`}>
              + Add Activity
            </Link>
          </div>

          <div className="trip-item-list">
            {isLoading ? (
              <p className="trip-empty-message">Loading activities...</p>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityBtn
                  key={activity.id}
                  id={activity.id}
                  activity={activity.activity}
                  num_votes={activity.num_votes}
                />
              ))
            ) : (
              <p className="trip-empty-message">
                No activities have been added yet.
              </p>
            )}
          </div>
        </div>

        <div className="trip-content-section">
          <div className="trip-section-header">
            <div>
              <span className="trip-section-label">Locations</span>
              <h2>Destinations</h2>
            </div>

            <Link className="trip-add-link" to={`/destination/new/${id}`}>
              + Add Destination
            </Link>
          </div>

          <div className="trip-item-list">
            {isLoading ? (
              <p className="trip-empty-message">Loading destinations...</p>
            ) : destinations.length > 0 ? (
              destinations.map((destination) => (
                <DestinationBtn
                  key={destination.id}
                  id={destination.id}
                  destination={destination.destination}
                />
              ))
            ) : (
              <p className="trip-empty-message">
                No destinations have been added yet.
              </p>
            )}
          </div>
        </div>

        <div className="trip-content-section">
          <div className="trip-section-header">
            <div>
              <span className="trip-section-label">Travel group</span>
              <h2>Travelers</h2>
            </div>

            <Link className="trip-add-link" to={`/users/add/${id}`}>
              + Add Traveler
            </Link>
          </div>

          <div className="trip-item-list travelers">
            {isLoading ? (
              <p className="trip-empty-message">Loading travelers...</p>
            ) : travelers.length > 0 ? (
              travelers.map((traveler) => (
                <div
                  className="traveler-item"
                  key={
                    traveler.id ?? `${traveler.trip_id}-${traveler.username}`
                  }
                >
                  <span className="traveler-avatar-placeholder">
                    {traveler.username?.charAt(0).toUpperCase()}
                  </span>

                  <span className="traveler-username">{traveler.username}</span>
                </div>
              ))
            ) : (
              <p className="trip-empty-message">
                No travelers have been added yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TripDetails;
