import React from "react";
import "./ProductCard.scss";
import { Card, Button, Badge, Stack } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

interface ProductCardProps {
  val: {
    id: number,
    name: string,
    image: string,
    floor: 0,
    price: 0,
    roomTier: {
      name: string;
      description: string;
      images: string[]; // Assuming roomTier has an images array
    }
    ratings: any[],
    isBalcony: boolean,
    isBathroom: boolean,
    isAirConditioner: boolean,
    isFreeWifi: boolean,
    isTelevision: boolean,
    isRefrigerator: boolean,
    isBreakfast: boolean,
    isLunch: boolean,
    isDinner: boolean,
    isSnack: boolean,
    isDrink: boolean,
    isParking: boolean,
    isSwimmingPool: boolean,
    isGym: boolean,
    isSpa: boolean,
    isLaundry: boolean,
    isCarRental: boolean,
    isBusService: boolean
  }
  checkInDate?: string;
  checkOutDate?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ val, checkInDate, checkOutDate }) => {
  const navigate = useNavigate();
  const features = {
    isBalcony: val?.isBalcony,
    isBathroom: val?.isBathroom,
    isAirConditioner: val?.isAirConditioner,
    isFreeWifi: val?.isFreeWifi,
    isTelevision: val?.isTelevision,
    isRefrigerator: val?.isRefrigerator,
    isBreakfast: val?.isBreakfast,
    isLunch: val?.isLunch,
    isDinner: val?.isDinner,
    isSnack: val?.isSnack,
    isDrink: val?.isDrink,
    isParking: val?.isParking,
    isSwimmingPool: val?.isSwimmingPool,
    isGym: val?.isGym,
    isSpa: val?.isSpa,
    isLaundry: val?.isLaundry,
    isCarRental: val?.isCarRental,
    isBusService: val?.isBusService,
  }

  const featureIcons: { [key: string]: string } = {
    isBalcony: "bi-house",
    isTelevision: "bi-tv",
    isAirConditioner: "bi-fan",
    isBathroom: "bi-droplet",
    isFreeWifi: "bi-wifi",
    isRefrigerator: "bi-box",
    isBreakfast: "bi-cup",
    isLunch: "bi-cup",
    isDinner: "bi-cup",
    isSnack: "bi-basket",
    isDrink: "bi-cup-straw",
    isParking: "bi-car-front",
    isSwimmingPool: "bi-person-workspace",
    isGym: "bi-droplet-half",
    isSpa: "bi-person-workspace",
    isLaundry: "bi-bucket",
    isCarRental: "bi-car-front",
    isBusService: "bi-bus-front",
  };
  console.log('val', val);
  const rating = val?.ratings?.reduce((acc, cur) => acc + cur.score, 0) / val?.ratings?.length || 0;

  return (
    <Card className="rounded-3 shadow-sm product-card">
      <Card.Img
        variant="top"
        src={val.roomTier.images[0]} // Use the first image from roomTier
        className="img-fluid"
        alt={`Image of ${val.name}`}
      />
      <Card.Body>
        <Card.Title>
          <NavLink
            className="body-text text-dark text-decoration-none"
            to={`/room/${val.id}`}
          >
            {val.name}
          </NavLink>
        </Card.Title>

        {/* Rating */}
        {/* <div className="rating mb-3">
          {Array.from({ length: 5 }, (_, index) => {
            const fullStars = Math.floor(rating); // Replace 3.5 with rating
            const hasHalfStar = rating % 1 !== 0; // Replace 3.5 with rating
            if (index < fullStars) {
              return <i className="bi bi-star-fill text-warning" key={index}></i>;
            } else if (index === fullStars && hasHalfStar) {
              return <i className="bi bi-star-half text-warning" key={index}></i>;
            } else {
              return <i className="bi bi-star text-warning" key={index}></i>;
            }
          })}
          <span className="ms-2">{rating} / 5</span> {/* Replace 3.5 with rating */}
        {/* </div>} */}
        <div className="rating mb-3">
          {Array.from({ length: 5 }, (_, index) => {
            const roundedRating = Math.round(rating * 10) / 10; // Làm tròn đến chữ số thập phân thứ nhất
            const fullStars = Math.floor(roundedRating);
            const hasHalfStar = roundedRating % 1 !== 0;
            if (index < fullStars) {
              return <i className="bi bi-star-fill text-warning" key={index}></i>;
            } else if (index === fullStars && hasHalfStar) {
              return <i className="bi bi-star-half text-warning" key={index}></i>;
            } else {
              return <i className="bi bi-star text-warning" key={index}></i>;
            }
          })}
          <span className="ms-2">{(Math.round(rating * 10) / 10).toFixed(1)} / 5</span> {/* Làm tròn và hiển thị */}
        </div>

        {/* Tier */}
        <div className="tier mb-3">
          <span className="label">Tier:</span>
          <Badge className={`tier-badge ${val.roomTier.name.toLowerCase()}`}>
            {val.roomTier.name}
          </Badge>
        </div>

        {/* Features */}
        <div className="features mt-3">
          <span className="label">Features:</span>
          <div className="features-list mt-3">
            {Object.entries(features).map(([feature, value]) => {
              if (value) {
                return (
                  <span className="feature" key={feature}>
                    <i className={`bi ${featureIcons[feature]}`}></i> {feature.replace('is', '')}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Price */}
        <div className="price mt-4 mb-4">
          <span className="label">Price:</span>{" "}
          <span className="price-value">
            {val.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>{" "}
          / night
        </div>
      </Card.Body>

      {/* Footer with buttons */}
      <Card.Footer className="d-flex justify-content-between">
        <Button variant="primary" onClick={() => navigate(`/room/${val.id}`)}>
          Details
        </Button>
        <Button variant="success" onClick={() => navigate("/booking", {
          state: {
            roomId: val.id,
            roomTier: val.roomTier.name,
            roomName: val.name,
            checkInDate,
            checkOutDate,
            price: val.price
          }
        })}>
          Book now
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
