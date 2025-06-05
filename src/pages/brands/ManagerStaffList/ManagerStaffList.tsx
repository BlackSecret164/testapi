import { Button, Form, Input, message, Modal, Popconfirm, Space, Table, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import "./ManagerStaffList.scss";
import SearchInput from '@/components/adminsytem/Search/SearchInput';
import { AdminApiRequest } from '@/services/AdminApiRequest';
import { on } from 'events';
import { set } from 'react-datepicker/dist/date_utils';
import FloatingLabelInput from '@/components/adminsytem/FloatingInput/FloatingLabelInput';

const ManagerStaffList = () => {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openCreateStaffModal, setOpenCreateStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [form] = Form.useForm();

    const fetchStaffList = async () => {
        try {
            const res = await AdminApiRequest.get('/staff/list');
            setStaffList(res.data);
        } catch (error) {
            console.error('Error fetching staff list:', error);
            message.error('Failed to fetch staff list.');
        }
    };

    useEffect(() => {
        fetchStaffList();
    }, []);

    const exportExcel = () => {
        const exportData = staffList.map((staff) => ({
            'ID': staff.id,
            'Tên nhân viên': staff.name,
            'Giới tính': staff.gender,
            'Ngày sinh': moment(staff.birth).format('DD-MM-YYYY'),
            'Số điện thoại': staff.phone,
            'Loại nhân viên': staff.typeStaff,
            'Địa chỉ': staff.address,
            'Giờ làm việc': staff.workHours,
            'Lương': staff.salary,
            'Ngày bắt đầu': moment(staff.startDate).format('DD-MM-YYYY HH:mm:ss'),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachNhanVien");
        XLSX.writeFile(workbook, "DanhSachNhanVien.xlsx");
    };

    const handleSearchKeyword = () => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) {
            fetchStaffList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
            return;
        }

        const filtered = staffList.filter(staff => {
            const name = staff.name.toLowerCase();
            const typeStaff = staff.typeStaff.toLowerCase();
            const phone = staff.phone.toLowerCase();
            return name.includes(keyword) || typeStaff.includes(keyword) || phone.includes(keyword);
        });
        setStaffList(filtered);
    }
    // Reset search when keyword is empty
    useEffect(() => {
        if (!searchKeyword.trim()) {
            fetchStaffList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
        }
    }, [searchKeyword]);

    const onOpenCreateStaffModal = (record: any = null) => {
        setEditingStaff(record);
        if (record) {
            setEditingStaff(record);
            form.setFieldsValue({
                ...record,
                birth: record.birth ? moment(record.birth) : null,
                startDate: record.startDate ? moment(record.startDate) : null,
            });
        }
        setOpenCreateStaffModal(true);
    }

    const onOkCreateStaffModal = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                birth: values.birth ? moment(values.birth).format('YYYY-MM-DD') : null,
                startDate: values.startDate ? moment(values.startDate).format('YYYY-MM-DD HH:mm:ss') : null,
            };

            if (editingStaff) {
                // Update existing staff
                await AdminApiRequest.put(`/staff/${editingStaff.id}`, formattedValues);
                message.success('Cập nhật nhân viên thành công.');
            } else {
                // Create new staff
                await AdminApiRequest.post('/staff', formattedValues);
                message.success('Tạo mới nhân viên thành công.');
            }
            setOpenCreateStaffModal(false);
            fetchStaffList();
            form.resetFields();
            setEditingStaff(null);
        } catch (error) {
            console.error('Error saving staff:', error);
            message.error('Lỗi khi lưu nhân viên. Vui lòng thử lại.');
        }
    }

    const onCancelCreateStaffModal = () => {
        setOpenCreateStaffModal(false);
        form.resetFields();
        setEditingStaff(null);
    }

    const onOpenEditStaffModal = (record: any) => {
        setEditingStaff(record);
        form.setFieldsValue({
            ...record,
            birth: record.birth ? moment(record.birth) : null,
            startDate: record.startDate ? moment(record.startDate) : null,
        });
        setOpenCreateStaffModal(true);
    }
    // Xóa nhân viên
    const onDeleteStaff = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/staff/${id}`);
            message.success('Xóa nhân viên thành công.');
            fetchStaffList();
        } catch (error) {
            console.error('Error deleting staff:', error);
            message.error('Lỗi khi xóa nhân viên. Vui lòng thử lại.');
        }
    };


    return (
        <div className="container-fluid m-2">
            <div className='sticky-header-wrapper'>
                <h2 className="h2 header-custom">DANH SÁCH NHÂN VIÊN</h2>
                {/* Tìm kiếm và Import + Export */}
                <div className="header-actions d-flex me-2 py-2 align-items-center justify-content-between">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        <Form layout="inline" className="search-form d-flex">
                        <SearchInput
                            placeholder="Tìm kiếm theo tên, loại nhân viên hoặc SĐT"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onSearch={handleSearchKeyword}
                            allowClear
                        />
                        </Form>
                    </div>
                    <div className="d-flex" >
                        <Button
                            type="primary"
                            icon={<i className="fas fa-plus"></i>}
                            onClick={() => onOpenCreateStaffModal}
                        />
                        <Button 
                        type="default" icon={<DownloadOutlined />}
                        onClick={exportExcel}
                        title='Tải xuống danh sách'
                        />

                    </div>
                </div>
            </div>

            {/* Modal tạo mới hoặc chỉnh sửa nhân viên */}
            <Modal
                className="custom-modal manager-staff-modal"
                title={editingStaff ? 'Chỉnh sửa nhân viên' : 'Tạo mới nhân viên'}
                open={openCreateStaffModal}
                onCancel={onCancelCreateStaffModal}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <div className='grid-2'>
                        <FloatingLabelInput
                            name="name"
                            label="Tên nhân viên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
                            component='input'
                        />
                        <FloatingLabelInput
                            name="type"
                            label="Loại nhân viên"
                            rules={[{ required: true, message: 'Vui lòng chọn loại nhân viên!' }]}
                            component='select'
                            options={[
                                { value: 'Quản lý', label: 'Quản lý' },
                                { value: 'Nhân viên phục vụ', label: 'Nhân viên phục vụ' },
                                { value: 'Thu ngân', label: 'Thu ngân' },
                                { value: 'Nhân viên pha chế', label: 'Nhân viên pha chế' },
                                { value: 'Bảo vệ', label: 'Bảo vệ' },
                            ]}
                        />
                    </div>
                    <div className='grid-2'>
                        <FloatingLabelInput
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            component='select'
                            options={[
                                { value: 'Nam', label: 'Nam' },
                                { value: 'Nữ', label: 'Nữ' },
                                { value: 'Khác', label: 'Khác' },
                            ]}
                        />
                        <FloatingLabelInput
                            name="birth"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                            component='date'
                        />
                    </div>
                    <div className='grid-2'>
                        <FloatingLabelInput
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            component='input'
                        />
                        <FloatingLabelInput
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            component='input'
                        />
                    </div>
                    <div className='grid-2'>
                        <FloatingLabelInput
                            name="salary"
                            label="Lương (VND)"
                            rules={[{ required: true, message: 'Vui lòng nhập lương!' }]}
                            component='input'
                            type='number'
                            disabled={editingStaff ? true : false}
                        />
                        <FloatingLabelInput
                            name="startDate"
                            label="Ngày bắt đầu làm việc"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu làm việc!' }]}
                            component='date'
                        />
                    </div>
                </Form>
            </Modal>

            <Table
                dataSource={staffList}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true
                }}
                rowKey="id"
                rowClassName={(_, index) => index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
                    { title: 'Tên nhân viên', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
                    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', sorter: (a,b) => a.gender.localeCompare(b.gender) },
                    {
                        title: 'Ngày sinh',
                        dataIndex: 'birth',
                        key: 'birth',
                        sorter: (a, b) => moment(a.birth).unix() - moment(b.birth).unix(),
                        render: (birth: string) =>
                            birth ? moment(birth).format('DD-MM-YYYY') : '-',
                    },
                    { title: 'Loại nhân viên', dataIndex: 'typeStaff', key: 'typeStaff', sorter: (a, b) => a.typeStaff.localeCompare(b.typeStaff) },
                    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
                    {
                        title: 'Giờ làm việc',
                        dataIndex: 'workHours',
                        key: 'workHours',
                        sorter: (a, b) => a.workHours - b.workHours,
                        render: (value: number) => `${value} giờ`,
                    },
                    {
                        title: 'Lương',
                        dataIndex: 'salary',
                        key: 'salary',
                        sorter: (a, b) => a.salary - b.salary,
                        render: (value: number) =>
                            new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(value),
                    },
                    {
                        title: 'Ngày bắt đầu',
                        dataIndex: 'startDate',
                        key: 'startDate',
                        sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
                        render: (value: string) =>
                            value ? moment(value).format('DD-MM-YYYY HH:mm:ss') : '-',
                    },
                    
                    {
                        title: 'Hành động',
                        key: 'action',
                        render: (text, record) => (
                            <Space size="middle">
                                <Button
                                    type="default"
                                    icon={<i className="fas fa-edit"></i>}
                                    onClick={() => onOpenCreateStaffModal(record)}>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa nhân viên này?"
                                    onConfirm={() => onDeleteStaff(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button className='ant-btn-danger'>
                                        icon={<i className="fas fa-trash"></i>}
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

export default ManagerStaffList;
