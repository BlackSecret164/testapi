import React from "react";
import { Card } from "react-bootstrap";
import "./Cards.scss";
import { NavLink, useNavigate } from "react-router-dom";
import moment from "moment";

const Cards = ({ tier }: any) => {
  const navigate = useNavigate();
  const handleClickTier = () => {
    if (!tier.id) {
      navigate("/rooms");
      return;
    }

    navigate("/rooms", {
      state: {
        tier: tier.id,
        startDate: moment().toDate(),
        endDate: moment().add(1, 'days').toDate(),
      },
    })
  }

  return (
    <>
      <div className="img-box">
        <div className="body-text text-dark text-decoration-none" onClick={handleClickTier}>
          <Card>
            <Card.Img
              variant="top"
              src={tier.image || tier.images[0] || ""}
              className="img-fluid"
              alt={tier.name}
            />
            <Card.Title>

              {tier.name}
            </Card.Title>

            <span className="rooms">{tier?.rooms?.length || tier?.rooms || ""}</span>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Cards;