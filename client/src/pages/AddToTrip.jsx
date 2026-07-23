import { useEffect, useState } from "react";
import AddTripOptionCard from "../components/AddTripOptionCard";

const AddToTrip = ({ data = [] }) => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(data);
  }, [data]);

  return (
    <div className="AddToTrip">
      {trips.length > 0 ? (
        trips.map((trip) => (
          <AddTripOptionCard
            key={trip.id}
            id={trip.id}
            title={trip.title}
            description={trip.description}
            img_url={trip.img_url}
          />
        ))
      ) : (
        <h3 className="noResults">No Trips Yet 😞</h3>
      )}
    </div>
  );
};

export default AddToTrip;
