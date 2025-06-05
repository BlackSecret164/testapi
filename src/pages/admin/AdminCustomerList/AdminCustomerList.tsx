import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import "./AdminCustomerList.scss";
import SearchInput from '@/components/adminsytem/Search/SearchInput';
import { AdminApiRequest } from '@/services/AdminApiRequest';

const AdminCustomerList = () => {
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [membershipList, setMembershipList] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openCreateCustomerModal, setOpenCreateCustomerModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
    const [form] = Form.useForm();

    const fetchCustomerList = async () => {
        try {
            const res = await AdminApiRequest.get('/customer/list');
            setCustomerList(res.data);
        } catch (error) {
            console.error('Error fetching customer list:', error);
            message.error('Failed to fetch customer list.');
        }
    };

    useEffect(() => {
        fetchCustomerList();
    }, []);


    const handleSearchKeyword = () => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) {
            fetchCustomerList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
            return;
        }

        const filtered = customerList.filter(customer => {
            const name = (customer.name ?? '').toLowerCase();
            const id = String(customer.id ?? '').toLowerCase();
            const phone = (customer.phone ?? '').toLowerCase();

            return name.includes(keyword) || id.includes(keyword) || phone.includes(keyword);
        });
        setCustomerList(filtered);
    }
    useEffect(() => {
        if (!searchKeyword.trim()) {
            fetchCustomerList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
        }
    }, [searchKeyword]);

    const exportExcel = () => {
        const exportData = customerList.map((customer) => ({
            'ID': customer.id,
            'Tên khách hàng': customer.name,
            'Giới tính': customer.gender,
            'Số điện thoại': customer.phone,
            'Tổng tiền': customer.total,
            'Ngày đăng ký': moment(customer.registrationDate).format('DD-MM-YYYY HH:mm:ss'),
            "Hạng thành viên": customer.rank,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachKhachHang");
        XLSX.writeFile(workbook, "DanhSachKhachHang.xlsx");
    };

    const onOpenCreateCustomerModal = (record: any = null) => {
        setEditingCustomer(null);
        if (record){
            setEditingCustomer(record);
            form.setFieldsValue({
                ...record,
                registrationDate: moment(record.registrationDate),
            });
        }
        setOpenCreateCustomerModal(true);
    };


    const onOKCreateCustomer = async () => {
        try {
            const data = form.getFieldsValue();
            data.registrationDate = data.registrationDate.toISOString();

            if (editingCustomer) {
                const { id, ...rest } = data;
                await AdminApiRequest.put(`/customer/${editingCustomer.id}`, rest);
            } else {
                await AdminApiRequest.post('/customer', data);
            }

            fetchCustomerList();
            setOpenCreateCustomerModal(false);
            form.resetFields();
            setEditingCustomer(null);
        } catch (error) {
            console.error('Lỗi khi tạo khách hàng:', error);
            message.error('Không thể tạo khách hàng. Vui lòng thử lại.');
        }
    };


    const onCancelCreateCustomer = () => {
        setOpenCreateCustomerModal(false);
        form.resetFields();
    };

    const onEditCustomer = (record:any) => {
        setEditingCustomer(record);
        form.setFieldsValue({
            ...record,
            registrationDate: moment(record.registrationDate),
        });
        setOpenCreateCustomerModal(true);
    };

    const onDeleteCustomer = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/customer/${id}`);
            fetchCustomerList();
            message.success('Xóa khách hàng thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa khách hàng:', error);
            message.error('Không thể xóa khách hàng. Vui lòng thử lại.');
        }
    };



    return (
        <div className="container-fluid m-2">
            <div className='sticky-header-wrapper'>
                <h2 className="h2 header-custom">QUẢN LÝ KHÁCH HÀNG</h2>
                {/* Tìm kiếm và Import + Export */}
                <div className="header-actions d-flex me-2 py-2 align-items-center justify-content-between">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        <Form layout="inline" className="search-form d-flex">
                        <SearchInput
                            placeholder="Tìm kiếm theo id, tên khách hàng hoặc SĐT"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onSearch={handleSearchKeyword}
                            allowClear
                        />
                        </Form>
                    </div>
                    <div className="d-flex" >
                        {/* <Button 
                            type="primary" 
                            icon={<i className="fas fa-plus"></i>}
                            onClick={() => onOpenCreateCustomerModal()}
                        >
                        </Button> */}
                        <Button 
                            type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportExcel}
                            title='Tải xuống danh sách'
                        />
                    </div>
                </div>
            </div>

            <Modal
                title={editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}
                open={openCreateCustomerModal}
                onOk={onOKCreateCustomer}
                onCancel={onCancelCreateCustomer}
                okText={editingCustomer ? 'Cập nhật' : 'Tạo mới'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <div className="field-row">
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                        >
                            <Select>
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                                <Select.Option value="Khác">Khác</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        >
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item
                        label="Ngày đăng ký"
                        name="registrationDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày đăng ký!" }]}
                    >
                        <DatePicker showTime/>
                    </Form.Item>
                    </div>
                    <div className="field-row">
                        <Form.Item
                            label="Tổng mức chi tiêu"
                            name="total"
                        >
                            <Input type="number"  disabled/>
                        </Form.Item>
                        <Form.Item
                            label="Hạng thành viên"
                            name="rank"
                        >
                            <Select  disabled>
                                {membershipList.map((membership) => (
                                    <Select.Option key={membership.id} value={membership.rank}>
                                        {membership.rank}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Table
                dataSource={customerList}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
                    { title: 'Tên', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', sorter: (a,b) => a.gender.localeCompare(b.gender)},
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    { title: 'Tổng chi tiêu', dataIndex: 'total', key: 'total', sorter: (a, b) => a.total - b.total,
                        render: (total: number) => total ? new Intl.NumberFormat('vi-VN',
                             { style: 'currency', currency: 'VND' }).format(total).replace('₫', 'đ') : '0đ'
                     },
                    { title: 'Hạng thành viên', dataIndex: 'rank', key: 'rank', sorter: (a, b) => a.rank.localeCompare(b.rank),
                        render: (rank: string) => (rank ? rank : 'Thường'),
                     },
                    { title: 'Ngày đăng ký', dataIndex: 'registrationDate', key: 'registrationDate', sorter: (a, b) => moment(a.registrationDate).unix() - moment(b.registrationDate).unix(),
                        render: (registrationDate: string) => (registrationDate ? moment(registrationDate).format('DD-MM-YYYY HH:mm:ss') : '-')
                     },
                    // {
                    //     title: 'Hành động',
                    //     key: 'actions',
                    //     render: (_, record) => (
                    //         <Space size="middle">
                    //             <Button type="default" onClick={() => onEditCustomer(record)}>
                    //                 <i className="fas fa-edit"></i>
                    //             </Button>
                    //             <Popconfirm
                    //                 title="Bạn có chắc chắn muốn xóa khách hàng này không?"
                    //                 onConfirm={() => onDeleteCustomer(record.id)}
                    //                 okText="Có"
                    //                 cancelText="Không"
                    //             >
                    //                 <Button className="ant-btn-danger">
                    //                     <i className="fas fa-trash"></i>
                    //                 </Button>
                    //             </Popconfirm>
                    //         </Space>
                    //     ),
                    // },
                ]}
            /> 
        </div>
    );
};

export default AdminCustomerList;
