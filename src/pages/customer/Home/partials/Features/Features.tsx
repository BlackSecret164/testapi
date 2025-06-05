import React from "react";
import "./Features.scss";

import feature1 from "@/assets/bg7.jpg";
import feature2 from "@/assets/service3.jpg";
import feature3 from "@/assets/img5.jpg";
import { Card, Col, Container, Row } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";

const Features = () => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 1500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: true,
          arrows: false,
        },
      },
    ],
  };

  const featureList = [
    {
      id: 1,
      image: feature1,
      title: "Dịch vụ tận tâm",
      des: "Nhân viên phục vụ chu đáo, sẵn sàng hỗ trợ khách hàng tại quán để mang lại trải nghiệm tốt nhất.",
    },
    {
      id: 2,
      image: feature2,
      title: "Đặt hàng trực tuyến",
      des: "Khách hàng dễ dàng đặt món ăn nhẹ và thức uống yêu thích ngay trên website, nhanh chóng và tiện lợi.",
    },
    {
      id: 3,
      image: feature3,
      title: "Không gian thoải mái",
      des: "Quán cà phê với không gian ấm cúng, phù hợp để gặp gỡ bạn bè hoặc làm việc, thư giãn.",
    },
  ];

  return (
    <>
      <section className="feature-section">
        <Container>
          <Row>
            <Col md="12">
              <Slider {...settings}>
                {featureList.map((feature, inx) => {
                  return (
                    <Card key={inx}>
                      <Card.Img
                        variant="top"
                        src={feature.image}
                        className="feature-image"
                        width={300}
                        height={100}
                        alt={feature.title}
                      />
                      <Card.Title>{feature.title}</Card.Title>
                      <Card.Text>{feature.des}</Card.Text>
                    </Card>
                  );
                })}
              </Slider>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Features;
