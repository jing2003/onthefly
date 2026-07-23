import { Link } from "react-router-dom";
import more from "../assets/more.png";

const Card = ({
  id,
  title,
  description,
  img_url,
  total_cost = 0,
  num_days = 0,
}) => {
  const formattedCost = Number(total_cost).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <article className="Card" style={{ backgroundImage: `url(${img_url})` }}>
      <div className="card-info">
        <Link
          to={`/edit/${id}`}
          className="moreButtonLink"
          aria-label={`Edit ${title}`}
        >
          <img className="moreButton" alt="" src={more} />
        </Link>

        <h2 className="card-title">{title}</h2>
        <p className="description">{description}</p>

        <div className="card-details">
          <span className="priceBtn">{formattedCost}</span>
          <span className="daysBtn">
            {num_days} {num_days === 1 ? "day" : "days"}
          </span>
        </div>

        <Link className="seeMoreBtn" to={`/trip/get/${id}`}>
          See More
        </Link>
      </div>
    </article>
  );
};

export default Card;
