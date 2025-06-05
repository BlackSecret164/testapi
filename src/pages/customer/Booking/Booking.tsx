import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Card, ListGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "./Booking.scss";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { MainApiRequest } from "@/services/MainApiRequest";
import { Table, Button, Modal, message } from "antd";
import { SelectAdditionalService } from "./SelectAdditionalService";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceTiers, setServiceTiers] = useState<any[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false); // State to toggle modal visibility
  const [isLoadingTierList, setIsLoadingTierList] = useState(false);
  const [startDate, setStartDate] = useState(
    location.state?.checkInDate ? new Date(location.state?.checkInDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    location.state?.checkOutDate ? new Date(location.state?.checkOutDate) : new Date()
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  const totalNights = moment(endDate).startOf("day").diff(moment(startDate).startOf("day"), "days");
  const basePrice = location.state?.price || 0;
  const taxesAndFees = basePrice * 0.1 * totalNights;
  const totalPayable = basePrice * totalNights + taxesAndFees;

  const fetchUserInformation = async () => {
    const res = await MainApiRequest.get("/auth/callback");
    setFirstName(res.data.data.name.split(" ")[0]);
    setLastName(res.data.data.name.split(" ").slice(1).join(" "));
    setPhone(res.data.data.phone);
    setEmail(res.data.data.email);
  };

  const fetchAvailableServices = async () => {
    setIsLoadingTierList(true);
    const res = await MainApiRequest.get("/service/tier/list");
    setServiceTiers(res.data);
    setIsLoadingTierList(false);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchUserInformation();
    fetchAvailableServices(); // Gọi hàm này để tải dữ liệu mẫu
  }, []);

  const handleBookRoom = async () => {
    const user = await MainApiRequest.get("/auth/callback");

    if (!user?.data?.data) {
      // alert("Please login to continue payment");
      message.error("Please login to continue payment");
      navigate("/login");
      return;
    }

    const data = {
      userId: user.data.data.id,
      customerName: `${firstName} ${lastName}`,
      customerPhone: phone,
      checkIn: moment(startDate).startOf('day'),
      checkOut: moment(endDate).startOf('day'),
      roomIds: [location.state?.roomId],
      status: "PENDING",
      serviceIds: selectedServices.map((service) => service.id), // Sending selected services to the backend
    };

    try {
      const res = await MainApiRequest.post("/booking", data);

      if (res.status === 200) {
        // alert("Booking success, proceed to payment");
        message.success("Booking success, proceed to payment");
        navigate("/payment", { state: { bookingData: res.data, tierName: location.state?.roomTier } });
      }
    } catch (error: any) {
      // console.error("Booking error:", error);
      message.error("Failed to book room. Reason: " + error.response.data.message);
      // alert("Failed to book room. Reason: " + error.response.data.message);
    }
  };

  return (
    <>
      <SelectAdditionalService
        isLoadingTier={isLoadingTierList}
        showServiceModal={showServiceModal}
        tierList={serviceTiers}
        onOk={(service: any[]) => {
          setSelectedServices([...selectedServices, ...service]);
        }}
        onCancel={() => setShowServiceModal(false)}
      />
      <Breadcrumbs title="Booking" pagename="Booking" />
      <section className="booking-section py-5">
        <Container>
          <Row>
            <Col md="8">
              <div className="booking-form-warp border rounded-3 bg-white">
                <div className="form-title px-4 border-bottom py-3">
                  <h3 className="h4 font-bold m-0">Your Details</h3>
                  <h5 className="font-bold my-2">
                    Room: {location.state?.roomName} - Tier: {location.state?.roomTier}
                  </h5>
                </div>

                <Form className="p-4">
                  <Row>
                    <Form.Group as={Col} md="6" controlId="firstname" className="mb-4">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="lastname" className="mb-4">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </Form.Group>

                    <div className="phone-email-group">
                      <Form.Group as={Col} md="6" className="mb-4">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone Number"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-4">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                        />
                      </Form.Group>
                    </div>

                    {/* Date fields grouped in a single row */}
                    <div className="date-field-group">
                      <Form.Group as={Col} md="6" className="mb-4 date-field">
                        <Form.Label>Check In</Form.Label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date || new Date())}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          className="form-control"
                          dateFormat="dd, MMMM, yyyy"
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="6" className="mb-4 date-field">
                        <Form.Label>Check Out</Form.Label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date || new Date())}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          className="form-control"
                          dateFormat="dd, MMMM, yyyy"
                        />
                      </Form.Group>
                    </div>

                    {/* Add Service Selection Button */}
                    <Col md="12" className="mb-4">
                      <Button onClick={() => setShowServiceModal(true)}>
                        <i className="bi bi-plus-circle-fill"></i> Select Additional Services
                      </Button>
                    </Col>

                    <Col md="12">
                      <Table
                        columns={[
                          { title: "Service", dataIndex: "name" },
                          { title: "Price", dataIndex: "price", render: (price) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) },
                          {
                            title: "Action",
                            key: "action",
                            render: (_, record) => (
                              <Button
                                onClick={() => setSelectedServices(selectedServices.filter((service) => service.id !== record.id))}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            ),
                          }
                        ]}
                        dataSource={selectedServices}
                        pagination={false}
                      />
                    </Col>

                    <Col md="12">
                      <button className="primaryBtn mt-2" type="button" onClick={handleBookRoom}>
                        Next
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>

            <Col md="4">
              <Card className="card-info shadow-sm bg-white">
                <Card.Header>
                  <h1 className="font-bold h4 mt-2">Price Summary</h1>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                      <span> Base Price</span>
                      <strong>{location.state?.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                      <span> Total Nights</span>
                      <strong>
                        {moment(endDate).startOf("day").diff(moment(startDate).startOf("day"), "days")}
                      </strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                      <span> Total Accomodation</span>
                      <strong>
                        {(location.state?.price * moment(endDate).startOf("day").diff(moment(startDate).startOf("day"), "days")).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                      <span> External Services</span>
                      <strong>{
                        selectedServices.reduce((acc, service) => acc + service.price, 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                      }</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                      <span> Taxes % Fees</span>
                      <strong>
                        {(
                          (location.state?.price * 0.1 * moment(endDate).startOf("day").diff(moment(startDate).startOf("day"), "days")) +
                          selectedServices.reduce((acc, service) => acc + service.price, 0) * 0.1
                        ).toLocaleString(
                          "vi-VN",
                          { style: "currency", currency: "VND" }
                        )}
                      </strong>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between py-4">
                  <span className="font-bold h5"> Payable Now</span>
                  <strong className="font-bold h5">
                    {
                      (
                        (location.state?.price * 1.1 * moment(endDate).startOf("day").diff(moment(startDate).startOf("day"), "days")) +
                        selectedServices.reduce((acc, service) => acc + service.price, 0) * 1.1
                      ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    }
                  </strong>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Booking;
