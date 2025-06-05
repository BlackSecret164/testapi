import React, { useEffect, useState } from 'react';
import './HistoryBooking.scss';
import { Table, Tag, Button, Modal, Form, Input, Rate, message } from 'antd';
import { Container } from 'react-bootstrap';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { MainApiRequest } from '@/services/MainApiRequest';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const HistoryBooking = () => {
  const navigate = useNavigate();
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentReservationCode, setCurrentReservationCode] = useState<number | null>(null);
  const [feedbackForm] = Form.useForm();
  const [rating, setRating] = useState(0);
  const [originalBookingList, setOriginalBookingList] = useState<any[]>([]);
  const [userId, setUserId] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const mappingColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'blue';
      case 'CONFIRMED': return 'green';
      case 'CANCELLED': return 'red';
      case 'CHECKED_IN': return 'orange';
      case 'CHECKED_OUT': return 'purple';
      default: return 'black';
    }
  }

  const handleSearchKeyword = () => {
    if (searchKeyword === '') {
      setBookingList(originalBookingList);
    } else {
      const filteredList = originalBookingList.filter(booking => {
        return booking.customerName.toLowerCase().includes(searchKeyword.toLowerCase())
          || booking.reservationCode.toLowerCase().includes(searchKeyword.toLowerCase())
          || booking.customerPhone.toLowerCase().includes(searchKeyword.toLowerCase());
      });
      setBookingList(filteredList);
    }
  }

  const fetchBookingList = async () => {
    const res = await MainApiRequest.get('/booking/list');
    setBookingList(res.data)
    setOriginalBookingList(res.data);
  }

  useEffect(() => {
    window.scroll(0, 0);

    fetchBookingList()
  }, [])

  const handleOpenFeedbackModal = (id: number) => {
    setCurrentReservationCode(id);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    const values = await feedbackForm.getFieldsValue();

    const user = await MainApiRequest.get("/auth/callback");

    if (!user?.data?.data) {
      // alert("Please login to continue payment");
      message.error("Please login to continue payment");
      navigate("/login");
      return;
    }

    setUserId(user.data.data.id);

    const res = await MainApiRequest.post('/rating', {
      score: rating,
      comment: values.comment,
      userId: user.data.data.id,
      roomId: currentReservationCode,
    });
    feedbackForm.resetFields();
    setIsFeedbackModalOpen(false);
    message.success('Thank you for your feedback!');
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleCancel = async (id: number) => {
    const res = await MainApiRequest.post(`/booking/cancel/${id}`);
    if (res) {
      message.success('Booking has been cancelled successfully');
      fetchBookingList();
    }
  }

  const isRated = (ratings: any[]) => {
    return ratings.length > 0 && ratings.some(rating => rating.user.id === userId);
  }

  const downloadInvoice = async (id: number) => {
    const res = await MainApiRequest.post(`/payment/pdf/${id}`, {}, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
  }

  return (
    <>
      <Breadcrumbs title="History Booking" pagename="History Booking" />
      <section className="history-section py-5">
        <div className='w-75 container-fluid'>
          <Form
            layout='inline'
            className='d-flex justify-content-end mb-3'
          >
            <Form.Item label='Search (Customer Name, Reservation code, Number)' className='d-flex flex-1'>
              <Input placeholder='Search Keyword' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={handleSearchKeyword}>Search</Button>
            </Form.Item>
          </Form>
          <Table
            dataSource={bookingList}
            showSorterTooltip={{ target: 'sorter-icon' }}
            columns={[
              {
                sorter: (a: any, b: any) => a.customerName.localeCompare(b.customerName),
                title: 'Guest', dataIndex: 'customerName', key: 'customerName'
              },
              {
                sorter: (a: any, b: any) => a.reservationCode.localeCompare(b.reservationCode),
                title: 'Reservation Code', dataIndex: 'reservationCode', key: 'reservationCode'
              },
              {
                sorter: (a: any, b: any) => a.customerPhone.localeCompare(b.customerPhone),
                title: 'Phone Number', dataIndex: 'customerPhone', key: 'customerPhone'
              },
              // { sorter:true, title: 'Check In', dataIndex: 'checkIn', key: 'checkIn', render: (checkIn: string) => moment(checkIn).format('DD-MM-YYYY') },
              // { sorter:true, title: 'Check Out', dataIndex: 'checkOut', key: 'checkOut', render: (checkOut: string) => moment(checkOut).format('DD-MM-YYYY') },
              {
                title: 'Booking Time', key: 'bookingTime', render: (record: any) => {
                  return (
                    <div className='text-left d-flex flex-column'>
                      <span><strong className="fw-bold">Arrive:</strong> {moment(record.checkIn).format('DD-MM-YYYY')}</span>
                      <span><strong className="fw-bold">Leave: </strong> {moment(record.checkOut).format('DD-MM-YYYY')}</span>
                    </div>
                  )
                }
              },
              {
                title: 'Checkin Time', key: 'checkinTime', render: (record: any) => {
                  return (
                    <div className='text-left d-flex flex-column'>
                      <span><strong className="fw-bold">Check In:</strong> {record.realCheckIn ? moment(record.realCheckIn).format('DD-MM-YYYY HH:mm:ss') : '-'}</span>
                      <span><strong className="fw-bold">Check Out:</strong> {record.realCheckOut ? moment(record.realCheckOut).format('DD-MM-YYYY HH:mm:ss') : '-'}</span>
                    </div>
                  )
                }
              },
              {
                sorter: (a: any, b: any) => a.rooms[0]?.roomTier?.name.localeCompare(b.rooms[0]?.roomTier?.name),
                title: 'Room Type', dataIndex: 'rooms', key: 'roomType', render: (rooms: any[]) => rooms[0]?.roomTier?.name
              },
              {
                sorter: (a: any, b: any) => a.rooms[0]?.name.localeCompare(b.rooms[0]?.name),
                title: 'Room Name', dataIndex: 'rooms', key: 'roomName', render: (rooms: any[]) => rooms[0]?.name
              },
              {
                sorter: (a: any, b: any) => a.createdAt.localeCompare(b.createdAt),
                title: 'Booking Date', dataIndex: 'createdAt', key: 'createdAt', render: (bookingDate: string) => moment(bookingDate).format('DD-MM-YYYY HH:mm:ss')
              },
              {
                sorter: (a: any, b: any) => a.status.localeCompare(b.status),
                title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={mappingColor(status)}>{status}</Tag>
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <div>
                    {record.status === 'CONFIRMED' && (
                      <Button type="primary" onClick={() => handleOpenFeedbackModal(record.rooms[0].id)}>
                        Feedback
                      </Button>
                    )}
                    {
                      record.status === 'PENDING' && (
                        <Button className='btn btn-danger' onClick={() => handleCancel(record.id)}>
                          Cancel
                        </Button>
                      )
                    }
                    {
                      record.status === 'CONFIRMED' && (
                        <Button className='btn btn-primary mt-2' onClick={() => downloadInvoice(record.paymentHistory[0].id)}>
                          Invoice
                        </Button>
                      )
                    }
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      <Modal
        title="Feedback"
        open={isFeedbackModalOpen}
        onOk={handleFeedbackSubmit}
        onCancel={() => setIsFeedbackModalOpen(false)}
      >
        <Form form={feedbackForm} layout="vertical">
          <Form.Item
            label="Rating"
            name="score"
            rules={[{ required: true, message: 'Please give a rating!' }]}
          >
            <div className="rating-container gap-2">
              <Rate
                allowHalf
                value={rating}
                onChange={handleRatingChange}
                style={{ display: 'flex', justifyContent: 'center' }}
              />
              <span className="rating-value">{rating} / 5</span>
            </div>
          </Form.Item>
          <Form.Item
            label="Feedback"
            name="comment"
            rules={[{ required: true, message: 'Please provide your feedback!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter your feedback here..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default HistoryBooking;
