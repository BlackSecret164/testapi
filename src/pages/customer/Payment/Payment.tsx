import React, { useState, useEffect } from "react";
import { Col, Container, Row, Card, ListGroup, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./Payment.scss";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Button, Tag, message } from "antd";
import LoadingOverlay from "@achmadk/react-loading-overlay";
import { MainApiRequest } from "@/services/MainApiRequest";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [discountCode, setDiscountCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const data = location?.state?.bookingData || {};
    console.log(data);
    console.log(location?.state?.tierName);
    const [price, setPrice] = useState(data.total || 0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [peachPoint, setPeachPoint] = useState(0);
    const [userId, setUserId] = useState(0);
    const [usePeachPoint, setUsePeachPoint] = useState(false);
    const roomName = data.rooms[0]?.name || "";
    const roomTier = location?.state?.tierName || "";
    const checkInDate = moment(data.checkIn).startOf("day") || moment().startOf("day").toDate();
    const checkOutDate = moment(data.checkOut).startOf("day") || moment().startOf("day").add(1, "days").toDate();

    const totalNights = checkInDate && checkOutDate ? moment(checkOutDate).diff(moment(checkInDate), "days") : 0;

    const payableNow = price / 1.1;
    const taxesAndFees = price - payableNow;

    const [paymentMethod, setPaymentMethod] = useState("creditCard");

    const handlePayment = async () => {
        if (usePeachPoint && peachPoint <= 0) {
            message.error("Not enough PeachPoint to pay!");
            return;
        }

        if (usePeachPoint) {
            const res = await MainApiRequest.post(`/booking/peach-coin/${location?.state?.bookingData?.id}`);
            if (res.status !== 200) {
                message.error("Payment failed!");
                return;
            }
        }

        const res = await MainApiRequest.post("/payment", {
            description: "Thanh toan dich vu Peach Hotel",
            userId: userId,
            bookingId: location?.state?.bookingData?.id,
        });

        if (res.status !== 200) {
            message.error("Payment failed!");
            return;
        }

        message.success("Payment successful!");
        navigate("/");
    };

    const fetchUserInfo = async () => {
        const user = await MainApiRequest.get("/auth/callback");

        if (!user?.data?.data) {
            message.error("Please login to continue payment");
            navigate("/login");
            return;
        }

        setUserId(user.data.data.id);
        setPeachPoint(user.data.data.peachCoin || 0);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchUserInfo();
    }, []);

    const applyDiscount = async () => {
        setIsLoading(true);
        const bookingId = location?.state?.bookingData?.id;
        if (!bookingId) {
            setIsLoading(false);
            message.error("Invalid booking data");
            return;
        }

        const res = await MainApiRequest.post(`/booking/coupon/${bookingId}?code=${discountCode}`).catch((err) => {
            console.error("Failed to apply discount:", err);
            return null;
        });
        if (res && res.status === 200) {
            message.success("Discount applied successfully!");
            if (res.data.coupon.promote.type === "PERCENT") {
                setDiscountedPrice(price * res.data.coupon.promote.discount / 100);
            } else {
                setDiscountedPrice(res.data.coupon.promote.discount);
            }
        } else {
            message.error("Invalid discount code!");
        }
        setIsLoading(false);
    };

    const finalPeachPoint = usePeachPoint
        ? Math.min(peachPoint, price - discountedPrice)
        : 0;

    const totalPayment = price - discountedPrice - finalPeachPoint;

    // useEffect(() => {
    //     if (usePeachPoint) {
    //         setDiscountedPrice((prev) => prev + finalPeachPoint);
    //     } else {
    //         setDiscountedPrice((prev) => prev - finalPeachPoint);
    //     }
    // }, [usePeachPoint, finalPeachPoint]);

    return (
        <LoadingOverlay active={isLoading} spinner>
            <Breadcrumbs title="Payment" pagename="Payment" />
            <section className="payment-section py-5">
                <Container>
                    <Row>
                        <Col md="8" lg="8">
                            <div className="payment-details border rounded-3 p-4">
                                <h3 className="h4 font-bold mb-4">Payment Details</h3>
                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Payment Method</Form.Label>
                                        <Form.Select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="creditCard">Credit Card</option>
                                            <option value="bankTransfer">Bank Transfer</option>
                                            <option value="paypal">PayPal</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Cardholder Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter your name" />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Card Number</Form.Label>
                                        <Form.Control type="text" placeholder="Enter your card number" />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Expiration Date</Form.Label>
                                        <Row>
                                            <Col>
                                                <Form.Control type="text" placeholder="MM" />
                                            </Col>
                                            <Col>
                                                <Form.Control type="text" placeholder="YY" />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control type="password" placeholder="Enter CVV" />
                                    </Form.Group>
                                    <button
                                        type="button"
                                        className="primaryBtn w-100 h-40"
                                        onClick={handlePayment}
                                    >
                                        Pay Now
                                    </button>
                                </Form>
                            </div>
                        </Col>
                        <Col md="4" lg="4">
                            <Card className="card-info p-0 shadow-sm bg-white">
                                <Card.Header>
                                    <h1 className="font-bold h4 mt-2">Summary</h1>
                                </Card.Header>
                                <Card.Body className="pb-0">
                                    <ListGroup>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>Room</span>
                                            <strong>{roomName} - {roomTier}</strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>Total Nights</span>
                                            <strong>{totalNights}</strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>Total Price</span>
                                            <strong>{payableNow.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>Taxes & Fees</span>
                                            <strong>{taxesAndFees.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 justify-content-between h5 pt-0">
                                            <Form.Label>Discount Code</Form.Label>
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter code"
                                                    onChange={(e) => setDiscountCode(e.target.value)}
                                                    value={discountCode}
                                                />
                                                <button className="btn btn-success" onClick={applyDiscount}>
                                                    Apply
                                                </button>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>Use PeachCoin</span>
                                            <Tag color="red">{peachPoint}</Tag>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                disabled={peachPoint <= 0}
                                                checked={usePeachPoint}
                                                onChange={(e) => setUsePeachPoint(e.target.checked)}
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>Coupon Discount</span>
                                            <strong>
                                                {discountedPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                            </strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>PeachCoin Applied</span>
                                            <strong>
                                                {finalPeachPoint.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                            </strong>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="border-0 d-flex justify-content-between h5 pt-0">
                                            <span>Total Payment</span>
                                            <strong>
                                                {totalPayment.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                            </strong>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </LoadingOverlay>
    );
};

export default Payment;
