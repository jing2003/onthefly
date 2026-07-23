import DestinationCard from "../components/DestinationCard";

const ReadDestinations = ({ data = [] }) => {
  return (
    <div className="ReadDestinations">
      {data.length > 0 ? (
        data.map((destination) => (
          <DestinationCard
            key={destination.id}
            id={destination.id}
            destination={destination.destination}
            description={destination.description}
            city={destination.city}
            country={destination.country}
            img_url={destination.img_url}
            flag_img_url={destination.flag_img_url}
          />
        ))
      ) : (
        <h3 className="noResults">No Destinations Yet 😞</h3>
      )}
    </div>
  );
};

export default ReadDestinations;
