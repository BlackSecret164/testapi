import React, { useEffect } from "react";
import { Container, Row, Col, Card, CardTitle } from "react-bootstrap";
import cafeImg1 from "@/assets/coffee4.jpg";
import cafeImg2 from "@/assets/img5.jpg";
import cafeImg3 from "@/assets/juice7.jpg";
import cafeImg4 from "@/assets/img11.jpg";
import cafeImg5 from "@/assets/img1.jpg";
import about1 from "@/assets/bg8.jpg";
import about2 from "@/assets/bg9.jpg";
import about3 from "@/assets/juice9.jpg";
import icons1 from "@/assets/coffee11.jpg";
import icons2 from "@/assets/img9.jpg";
import icons3 from "@/assets/img3.jpg";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import "./About.scss";

const About = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs title="Về Chúng Tôi" pagename="Về Chúng Tôi" />
      <section className="about-section py-5">
        <Container>
          {/* Giới thiệu */}
          <Row className="mb-5">
            <Col md="12" className="text-center">
              <CardTitle className="lead mt-3">Chào mừng đến với Cafe w Fen</CardTitle>
              <p>
                Một không gian ấm cúng, sáng tạo và đậm chất nghệ thuật — nơi cà phê, con người và cảm xúc giao hòa.

                Tại Cafe w Fen, chúng tôi không chỉ phục vụ cà phê — mà còn mang đến trải nghiệm độc đáo, kết nối cộng đồng và nuôi dưỡng cảm hứng sáng tạo.
              </p>
            </Col>
          </Row>

          {/* Dịch vụ nổi bật */}
          <Row className="mb-5 align-items-center">
            <Col md="4">
              <Card className="border-0 shadow-sm rounded-3 text-center">
                <Card.Body>
                  <img src={icons1} alt="Cà phê đặc sản" className="mb-3 img-fluid" />
                  <Card.Title className="fw-bold">Cà Phê Đặc Sản</Card.Title>
                  <p>
                    Từ hạt cà phê tuyển chọn đến cách pha chế tinh tế, mỗi ly cà phê tại w Fen đều là một hành trình vị giác đầy cảm xúc.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4" >
              <Card className="border-0 shadow-sm rounded-3 text-center">
                <Card.Body>
                  <img src={icons2} alt="Không gian sáng tạo" className="mb-3 img-fluid" />
                  <Card.Title className="fw-bold">Không Gian Sáng Tạo</Card.Title>
                  <p>
                    Thiết kế mở, trang trí nghệ thuật, là nơi lý tưởng để làm việc, gặp gỡ bạn bè hay tìm kiếm cảm hứng cá nhân.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="border-0 shadow-sm rounded-3 text-center">
                <Card.Body>
                  <img src={icons3} alt="Sự kiện & triển lãm" className="mb-3 img-fluid" />
                  <Card.Title className="fw-bold">Sự Kiện & Triển Lãm</Card.Title>
                  <p>
                    Thường xuyên tổ chức workshop, âm nhạc acoustic và triển lãm nghệ thuật độc lập từ các nghệ sĩ địa phương.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Lịch sử - Sứ mệnh - Giá trị */}
          <section className="about-section py-4">
            <Container>
              {/* Lịch sử */}
              <Row className="align-items-center mb-5">
                <Col md="6">
                  <Card.Title className="fw-bold">CÂU CHUYỆN HÌNH THÀNH</Card.Title>
                  <p>
                    Cafe w Fen được thành lập từ niềm đam mê với cà phê nguyên bản và không gian sáng tạo. Ban đầu chỉ là một góc nhỏ trong khu phố cổ, nay w Fen đã trở thành điểm đến quen thuộc cho những ai yêu thích sự yên tĩnh, nghệ thuật và hương vị nguyên chất.
                  </p>
                </Col>
                <Col md="6">
                  <img src={about1} alt="Câu chuyện" className="img-fluid rounded shadow-sm" />
                </Col>
              </Row>

              {/* Sứ mệnh */}
              <Row className="align-items-center mb-5">
                <Col md="6" className="order-md-2">
                  <Card.Title className="fw-bold">SỨ MỆNH</Card.Title>
                  <p className="mb-4">
                    Sứ mệnh của chúng tôi là kiến tạo một không gian nơi mọi người có thể tạm gác lại nhịp sống vội vã để thư giãn, kết nối và tái tạo cảm hứng. Không chỉ là cà phê, mà còn là trải nghiệm tinh tế của sự tĩnh lặng, sáng tạo và cộng đồng.
                  </p>
                </Col>
                <Col md="6" className="order-md-1">
                  <img src={about2} alt="Sứ mệnh" className="img-fluid rounded shadow-sm" />
                </Col>
              </Row>

              {/* Giá trị cốt lõi */}
              <Row className="align-items-center mb-5">
                <Col md="6">
                  <Card.Title className="fw-bold mb-3 ">GIÁ TRỊ CỐT LÕI</Card.Title>
                  <p>
                    <span className="fw-bold ">CHÂN THÀNH</span> trong từng ly cà phê và từng nụ cười trao đi.
                  </p>
                  <p>
                    <span className="fw-bold">CHẤT LƯỢNG</span> là ưu tiên hàng đầu, từ nguyên liệu đến dịch vụ.
                  </p>
                  <p>
                    <span className="fw-bold">SÁNG TẠO</span> trong không gian và hoạt động gắn kết cộng đồng.
                  </p>
                  <p>
                    <span className="fw-bold">BỀN VỮNG</span> với môi trường và phát triển địa phương.
                  </p>

                </Col>
                <Col md="6">
                  <img src={about3} alt="Giá trị cốt lõi" className="img-fluid rounded shadow-sm" />
                </Col>
              </Row>
            </Container>
          </section>

          {/* Hình ảnh quán */}
          <Col md="12" className="text-center mb-4">
            <CardTitle className="fw-bold">Không Gian w Fen</CardTitle>
          </Col>
          <Col className="mb-4">
            <Card className="border-0">
              <Card.Img src={cafeImg2} alt="view" className="rounded" />
            </Card>
          </Col>
          <Col className="mb-4">
            <Card className="border-0">
              <Card.Img src={cafeImg4} alt="view" className="rounded" />
            </Card>
          </Col>
          <Row className="hotel-images-section mb-5">
            <Col md="4" className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img src={cafeImg3} alt="Không gian 1" className="rounded img-fluid" />
              </Card>
            </Col>
            <Col md="4" className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img src={cafeImg1} alt="Không gian 2" className="rounded img-fluid" />
              </Card>
            </Col>
            <Col md="4" className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img src={cafeImg5} alt="Không gian 3" className="rounded img-fluid" />
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;
