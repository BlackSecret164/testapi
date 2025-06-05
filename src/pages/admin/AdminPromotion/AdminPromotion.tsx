import { Button,  Form, Input, message, Modal, Popconfirm,  Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import "./AdminPromotion.scss";
import { AdminApiRequest } from '@/services/AdminApiRequest';
import FloatingLabelInput from '@/components/adminsytem/FloatingInput/FloatingLabelInput';
import { m } from 'framer-motion';

const AdminPromotion = () => {
    const [promoteForm] = Form.useForm();
    const [couponForm] = Form.useForm();
    const [adminPromoteList, setAdminPromoteList] = useState<any[]>([]);
    const [adminCouponList, setAdminCouponList] = useState<any[]>([]);
    const [openCreatePromoteModal, setOpenCreatePromoteModal] = useState(false);
    const [openCreateCouponModal, setOpenCreateCouponModal] = useState(false);
    const [editPromote, setEditPromote] = useState<any>(null);
    const [editCoupon, setEditCoupon] = useState<any>(null);


    const fetchAdminPromoteList = async () => {
        try {
            const res = await AdminApiRequest.get('/promote/list');
            setAdminPromoteList(res.data);
        } catch (error) {
            console.error('Error fetching promote list:', error);
            message.error('Failed to fetch promote list.');
        }
        
    }

    const fetchAdminCouponList = async () => {
        try{
        const res = await AdminApiRequest.get('/promote/coupon/list');
        setAdminCouponList(res.data);
        } catch (error) {
            console.error('Error fetching coupon list:', error);
            message.error('Failed to fetch coupon list.');
        }
    }

    useEffect(() => {
        fetchAdminPromoteList();
        fetchAdminCouponList();
    }, []);

    // Hàm random mã CouponCode
    const generateRandomCode = () => {
        const codes = [
            "TET",       // Tết
            "FLASH",     // Flash Sale
            "SCHOOL",    // Vui tới trường
            "STUDENT",   // Học sinh
            "QK",        // Quốc Khánh
            "XMAS",      // Giáng Sinh
            "WOMEN",     // Quốc tế Phụ nữ / 20-10
            "LOVE",      // Valentine
            "CHILD",     // Thiếu nhi 1/6
            "TEACH",     // 20/11
            "SALE",      // Chung chung
            "BLACK",     // Black Friday
            "HALLO",     // Halloween
            "MID",       // Trung thu
            "APRIL",     // 30/4
            "LABOR",     // 1/5
        ];

        // Lọc danh sách chỉ giữ các chuỗi có độ dài <= 6 ký tự
        const filteredCodes = codes.filter(code => code.length <= 6);

        // Random một mã từ danh sách
        const randomIndex = Math.floor(Math.random() * filteredCodes.length);
        return filteredCodes[randomIndex];
    };




    //Hàm ánh xạ màu sắc cho trạng thái
    const mappingColor = (status: string) => {
        switch (status) {
            case 'Có hiệu lực': return 'green';
            case 'Hết hạn': return 'red';

        }
    }

    // Các hàm xử lý cho Promote
    const onOpenCreatePromoteModal = (record: any = null) => {
        setEditPromote(record);
        if (record) {
            promoteForm.setFieldsValue({
                ...record,
                startAt: moment(record.startAt),
                endAt: moment(record.endAt),
            });
        } else {
            promoteForm.resetFields();
        }
        setOpenCreatePromoteModal(true);
    }
    
    const onOKCreatePromote = async () => {
        try {
            const data = promoteForm.getFieldsValue();
            if (data.startAt) {
                data.startAt = data.startAt.toISOString();
            } else {
                message.error("Start date is required!");
                return;
            }
            if (data.endAt) {
                data.endAt = data.endAt.toISOString();
            } else {
                message.error("End date is required!");
                return;
            }
            
            if (editPromote) {
                const { id, ...rest } = data;
                await AdminApiRequest.put(`/promote/${editPromote.id}`, rest);
            } else {
                await AdminApiRequest.post('/promote', data);
            }

            console.log("Promote data:", data);
            fetchAdminPromoteList();
            setOpenCreatePromoteModal(false);
            promoteForm.resetFields();
            message.success("Promote saved successfully!");
            setEditPromote(null);
        } catch (error) {
            console.error('Error saving promote:', error);
            message.error('Failed to save promote. Please try again.');
        }
    }

    const onCancelCreatePromote = () => {
        setOpenCreatePromoteModal(false);
        promoteForm.resetFields();
    }

    const onOpenEditPromote = (record: any) => {
        setEditPromote(record);
        promoteForm.setFieldsValue({
            ...record,
            startAt: moment(record.startAt),
            endAt: moment(record.endAt),
        });
        setOpenCreatePromoteModal(true);
    }

    const onDeletePromote = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/promote/${id}`);
            fetchAdminPromoteList();
            message.success('Promote deleted successfully!');
        } catch (error) {
            console.error('Error deleting promote:', error);
            message.error('Failed to delete promote. Please try again.');
        }
    }


    //Các hàm xử lý cho Coupon
    const onOpenCreateCouponModal = (record: any = null) => {
        setEditCoupon(record);
        if (record) {
            couponForm.setFieldsValue(record);
            couponForm.setFieldsValue({ promoteId: record.promote.id });
        } 
        setOpenCreateCouponModal(true);
    }

    const onOKCreateCoupon = async () => {
        try {
            const data = couponForm.getFieldsValue();
            const now = moment();
            const promote = adminPromoteList.find(p => p.id === data.promoteId);
            if (promote && moment(promote.endAt).isBefore(now)) {
                data.status = 'Hết hạn';
            } else {
                data.status = 'Có hiệu lực';
            }
            if (editCoupon) {
                const { id, ...rest } = data;
                await AdminApiRequest.put(`/promote/coupon/${editCoupon.id}`, rest);
            } else {
                await AdminApiRequest.post('/promote/coupon', data);
            }
            fetchAdminCouponList();
            setOpenCreateCouponModal(false);
            couponForm.resetFields();
            message.success('Coupon saved successfully!');
            setEditCoupon(null);
        } catch (error) {
            console.error('Error saving coupon:', error);
            message.error('Failed to save coupon. Please try again  ');
        }
    }; 


    const onCancelCreateCoupon = () => {
        setOpenCreateCouponModal(false);
        couponForm.resetFields();
    }

    const onOpenEditCoupon = (record: any) => {
        setEditCoupon(record);
        couponForm.setFieldsValue(record);
        couponForm.setFieldsValue({ promoteId: record.promote.id });
        setOpenCreateCouponModal(true);
    }

    const onDeleteCoupon = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/promote/coupon/${id}`);
            fetchAdminCouponList();
            message.success('Coupon deleted successfully!');
        } catch (error) {
            console.error('Error deleting coupon:', error);
            message.error('Failed to delete coupon. Please try again.');
        }
    }


    return (
        <div className="container-fluid m-2">
            <div className='sticky-header-wrapper'>
                <h2 className="h2 header-custom">QUẢN LÝ KHUYẾN MÃI</h2>
            </div>  
            {/* Modal for creating or editing promote */}
            <Modal
                className="custom-modal promote-modal"
                title={editPromote ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreatePromoteModal}
                onCancel={onCancelCreatePromote}
                footer= {null}        
            >
            <Form form={promoteForm} layout="vertical">
                <div className="grid-2">
                    <FloatingLabelInput 
                        name="name"
                        label="Tên khuyến mãi"
                        component='input'
                        rules={[{ required: true, message: 'Tên khuyến mãi là bắt buộc' }]}
                    />
                    <FloatingLabelInput
                        name="promoteType"
                        label='Loại khuyến mãi'
                        component='select'
                        rules={[{ required: true, message: 'Loại khuyến mãi là bắt buộc' }]}
                        options={[
                            { value: 'Phần trăm', label: 'Phần trăm' },
                            { value: 'Cố định', label: 'Cố định' },]}
                    />
                </div>
                <div className="grid-2">
                    <FloatingLabelInput 
                        name='description'
                        label='Mô tả'
                        component='input'
                        type='textarea'
                        rules={[{ required: true, message: 'Mô tả là bắt buộc' }]}
                    />
                    <FloatingLabelInput 
                        name="discount" 
                        label='Giảm giá'
                        component='input'
                        type='number'
                        rules={[{ required: true, message: 'Giảm giá là bắt buộc' }]}
                    />
                </div>
                <div className="grid-2">
                    <FloatingLabelInput 
                        name="startAt"
                        label="Ngày bắt đầu"
                        component='date'
                        rules={[{ required: true, message: 'Ngày bắt đầu là bắt buộc' }]}
                    />
                    <FloatingLabelInput
                        name="endAt"
                        label="Ngày kết thúc"
                        component='date'
                        rules={[{ required: true, message: 'Ngày kết thúc là bắt buộc' }]}
                    />
                </div>
                <div className='modal-footer-custom d-flex justify-content-end align-items-center gap-3'>
                    <Button 
                        type='default'
                        onClick={onCancelCreatePromote}
                    >
                        Hủy
                    </Button>
                    <Button 
                        type='primary'
                        onClick={onOKCreatePromote}
                    >
                        {editPromote ? "Lưu thay đổi" : "Tạo mới"}
                    </Button>
                </div>
            </Form>
        </Modal>


            {/* Modal for creating or editing coupon */}
            <Modal
                className='custom-modal coupon-modal'
                title={editCoupon ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateCouponModal}
                onCancel={() => onCancelCreateCoupon()}
                footer={null}
            >
                <Form
                    form={couponForm}
                    layout="vertical"
                >
                    <FloatingLabelInput
                        name='promoteId'
                        label="Chọn khuyến mãi"
                        component='select'
                        rules={[{ required: true, message: 'Khuyến mãi là bắt buộc' }]}
                        options={adminPromoteList.map(promote => ({
                            value: promote.id,
                            label: promote.name,
                        }))}
                        />
                    <div className='field-row mt-4'>
                        <Form.Item 
                            name='code'
                            label="Mã Code"
                            rules={[{ required: true, message: 'Mã Code là bắt buộc' }]}>
                            <Input
                                addonAfter={
                                    <Button
                                        type="link"
                                        className='random-button'
                                        onClick={() => {
                                            const randomCode = generateRandomCode();
                                            couponForm.setFieldsValue({ code: randomCode });
                                        }}

                                    >
                                        Random
                                    </Button>
                                }
                            />
                        </Form.Item>
                    </div>
                    <div className='modal-footer-custom d-flex justify-content-end align-items-center gap-3'>
                        <Button 
                            type='default'
                            onClick={onCancelCreateCoupon}
                        >
                            Hủy
                        </Button>
                        <Button 
                            type='primary'
                            onClick={onOKCreateCoupon}
                        >
                            {editPromote ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </div>
                </Form>
            </Modal>


            {/* Danh sách Khuyến mãi và Coupon */}
            <div className="d-flex me-2 align-items-center">
                <h4 className='h4 mt-3'>Danh sách Khuyến mãi</h4>
                <div className="d-flex" >
                    <Button 
                        type="primary" 
                        icon={<i className="fas fa-plus"></i>}
                        onClick={() => onOpenCreatePromoteModal()}
                    >
                    </Button>
                </div>
            </div>

            <Table
                dataSource={adminPromoteList}
                pagination={{
                    pageSize: 5, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }
                }    
                            
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên khuyến mãi', dataIndex: 'name', key: 'name' },
                    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
                    { title: 'Giảm giá', dataIndex: 'discount', key: 'discount',
                        render: (discount: number, record) => {
                            return record.promoteType === 'Phần trăm'
                                ? `${Math.round(discount)}%`
                                : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(discount));
                        }
                     },
                    { title: 'Loại', dataIndex: 'promoteType', key: 'promoteType'},
                    { title: 'Ngày bắt đầu', dataIndex: 'startAt', key: 'startAt', render: (startAt: string) => moment(startAt).format('YYYY-MM-DD HH:mm:ss') },
                    { title: 'Ngày kết thúc', dataIndex: 'endAt', key: 'endAt', render: (endAt: string) => moment(endAt).format('YYYY-MM-DD HH:mm:ss') },
                    {
                        title: 'Actions', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onOpenEditPromote(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa khuyến mãi này?"
                                    onConfirm={() => onDeletePromote(record.id)}
                                    okText="Đồng ý"
                                    cancelText="Hủy"

                                >
                                    <Button className='ant-btn-danger'>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />

            <div className="d-flex me-2 align-items-center">
                <h4 className='h4'>Danh sách Coupon</h4>
                <div className="d-flex" >
                    <Button 
                        type="primary" 
                        icon={<i className="fas fa-plus"></i>}
                        onClick={() => onOpenCreateCouponModal()}
                    >
                    </Button>
                </div>
            </div>
            <Table
                dataSource={adminCouponList}
                pagination={{
                    pageSize: 5, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }
                }  
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Tên khuyến mãi', dataIndex: 'promote', key: 'promote', render: (promote) => promote?.name || 'N/A' },
                    { title: 'Trạng thái', dataIndex: 'status', key: 'status', 
                        render: (status: string) => {
                            return <Tag color={mappingColor(status)}>{status}</Tag>
                        }
                    },
                    { title: 'Mã Code', dataIndex: 'code', key: 'code' },
                    {
                        title: 'Actions', key: 'actions', render: (text, record) => (
                            <Space size="middle">
                                <Button 
                                    type="default"
                                    onClick={() => onOpenEditCoupon(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa coupon này?"
                                    onConfirm={() => onDeleteCoupon(record.id)}
                                    okText="Đồng ý"
                                    cancelText="Hủy"
                                >
                                    <Button className='ant-btn-danger'>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )
                    },
                ]}
            />
        </div>
    );
};

export default AdminPromotion;