import { useState } from "react";
import "./ActivityBtn.css";

const ActivityBtn = (props) => {
  const [num_votes, setNumVotes] = useState(props.num_votes ?? 0);

  const updateCount = async () => {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ num_votes: num_votes + 1 }),
    };

    const response = fetch("/api/activities/" + props.id, options);
    if (!response.ok) {
      throw new Error("Unable to update activity vote count");
    }
    setNumVotes((num_votes) => num_votes + 1);
  };

  return (
    <button className="activityBtn" id={props.id} onClick={updateCount}>
      {props.activity} <br /> {"△ " + num_votes + " Upvotes"}
    </button>
  );
};

export default ActivityBtn;
