import { useState } from "react";
import { useParams } from "react-router-dom";

const CreateDestination = () => {
  const { trip_id } = useParams();
  const [destination, setDestination] = useState({
    destination: "",
    description: "",
    city: "",
    country: "",
    img_url: "",
    flag_img_url: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDestination((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createDestination = async (event) => {
    event.preventDefault();

    try {
      const destinationResponse = await fetch("/api/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(destination),
      });

      if (!destinationResponse.ok) {
        throw new Error("Failed to create destination");
      }

      const createdDestination = await destinationResponse.json();
      setDestination(createdDestination);

      const tripDestinationResponse = await fetch("/api/trips-destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id,
          destination_id: createdDestination.id,
        }),
      });

      if (!tripDestinationResponse.ok) {
        throw new Error("Failed to add destination to trip");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Error creating destination:", error);
    }
  };

  return (
    <form>
      <center>
        <h3>Add Destination</h3>
      </center>
      <label>Destination</label> <br />
      <input
        type="text"
        id="destination"
        name="destination"
        value={destination.destination}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Description</label>
      <br />
      <textarea
        rows="5"
        cols="50"
        id="description"
        name="description"
        value={destination.description}
        onChange={handleChange}
      ></textarea>
      <br />
      <label>City</label>
      <br />
      <input
        type="text"
        id="city"
        name="city"
        value={destination.city}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Country</label>
      <br />
      <input
        type="text"
        id="country"
        name="country"
        value={destination.country}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Image URL</label>
      <br />
      <input
        type="text"
        id="img_url"
        name="img_url"
        value={destination.img_url}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Flag Image URL</label>
      <br />
      <input
        type="text"
        id="flag_img_url"
        name="flag_img_url"
        value={destination.flag_img_url}
        onChange={handleChange}
      />
      <br />
      <br />
      <label>Trip ID</label>
      <br />
      <input type="text" id="trip_id" name="trip_id" value={trip_id} readOnly />
      <br />
      <br />
      <input type="submit" value="Submit" onClick={createDestination} />
    </form>
  );
};

export default CreateDestination;
