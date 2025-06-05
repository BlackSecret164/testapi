import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Rate, message } from 'antd';
import './FeedbackPage.scss';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

const FeedbackPage = () => {
  const { reservationCode } = useParams<{ reservationCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Feedback submitted successfully!');
      setLoading(false);
      navigate('/history-booking'); // Điều hướng về trang lịch sử đặt phòng
    }, 1000);
    console.log('Feedback data:', { reservationCode, ...values });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Breadcrumbs title="Feedback" pagename="Feedback" />
      <section className="feedback-section py-5">
        <div className="container">
          <h2 className="mb-4">Feedback for Reservation: {reservationCode}</h2>
          <Form
            name="feedbackForm"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: 'Please provide a rating!' }]}
            >
              <Rate />
            </Form.Item>
            <Form.Item
              label="Comments"
              name="comments"
              rules={[{ required: true, message: 'Please provide your comments!' }]}
            >
              <Input.TextArea rows={4} placeholder="Write your feedback here..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit Feedback
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
};

export default FeedbackPage;
