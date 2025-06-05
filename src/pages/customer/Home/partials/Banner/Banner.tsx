import React from "react";
import sliderImg1 from "@/assets/bg9.jpg";
import sliderImg2 from "@/assets/bg1.jpg";
import sliderImg3 from "@/assets/bg2.jpg";
import sliderImg4 from "@/assets/bg1.jpg";
import "./Banner.scss";
import { Carousel } from "react-bootstrap";

const Banner = () => {
  return (
    <>
      <section className="slider">
        <Carousel variant="dark">
          <Carousel.Item>
            <img src={sliderImg1} className="d-block w-100" alt="CafewFen slide 1" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  CHÀO MỪNG ĐẾN VỚI <span>CAFEWFEN</span>
                </h5>
                <p className="sub_text">
                  Đội ngũ phục vụ tận tình, nhanh chóng – sẵn sàng mang đến cho bạn trải nghiệm đặt hàng tuyệt vời ngay khi ghé thăm CafewFen.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src={sliderImg2} className="d-block w-100" alt="CafewFen slide 2" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  ĐA DẠNG <span>ĐỒ UỐNG VÀ BÁNH NGỌT</span>
                </h5>
                <p className="sub_text">
                  Từ ly cà phê truyền thống, trà thanh mát đến trà sữa thơm béo – chúng tôi luôn sẵn sàng phục vụ gu vị của bạn.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src={sliderImg3} className="d-block w-100" alt="CafewFen slide 3" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  HẸN HÒ, LÀM VIỆC, <span>THƯ GIÃN</span>
                </h5>
                <p className="sub_text">
                  CafewFen – nơi lý tưởng để gặp gỡ bạn bè, làm việc sáng tạo và tận hưởng từng khoảnh khắc yên bình với thức uống yêu thích.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Carousel.Item>
          <img src={sliderImg4} className="d-block w-100" alt="CafewFen slide 4" />
          <Carousel.Caption>
            <div className="slider_des">
              <h5 className="heading">
              THƯỞNG THỨC <span>TRÀ SỮA & BÁNH NGỌT</span>
              </h5>
              <p className="sub_text">
              Khám phá hương vị trà sữa tươi ngon kết hợp cùng bánh ngọt hấp dẫn, mang đến trải nghiệm tuyệt vời cho mọi khách hàng tại CafewFen.
              </p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </section>
    </>
  );
};

export default Banner;
