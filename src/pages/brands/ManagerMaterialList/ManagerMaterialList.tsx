import React, { useEffect, useState } from 'react';
import { Button, Form, Input, DatePicker, Modal, Table, Space, Popconfirm, message, Select } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx';
import "./ManagerMaterialList.scss";
import { DownloadOutlined } from '@ant-design/icons';
import { AdminApiRequest } from '@/services/AdminApiRequest';
import SearchInput from '@/components/adminsytem/Search/SearchInput';
import FloatingLabelInput from '@/components/adminsytem/FloatingInput/FloatingLabelInput';


const ManagerMaterialList = () => {
    const [form] = Form.useForm();
    const [materialList, setMaterialList] = useState<any[]>([]);
    const [openCreateMaterialModal, setOpenCreateMaterialModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    const fetchMaterialList = async () => {
        try {
            const res = await AdminApiRequest.get('/material/list');
            setMaterialList(res.data);
        } catch (error) {
            console.error('Error fetching material list:', error);
            message.error('Không thể tải danh sách nguyên liệu. Vui lòng thử lại.');
        }
    }

    useEffect(() => {
        fetchMaterialList();
    }, []);

        const exportExcel = () => {
            const exportData = materialList.map((material) => ({
                'ID': material.id,
                'Tên nguyên liệu': material.name,
                'Số lượng nhập': material.quantityImported,
                'Số lượng tồn': material.quantityStock,
                'Giá': new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(material.price),
                'Loại bảo quản': material.storageType,
                'Ngày nhập': moment(material.importDate).format('YYYY-MM-DD HH:mm:ss'),
                'Ngày hết hạn': moment(material.expiryDate).format('YYYY-MM-DD HH:mm:ss'),
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachNguyenLieu");
            XLSX.writeFile(workbook, "DanhSachNguyenLieu.xlsx");
        };


    const onOpenCreateMaterialModal = (record: any = null) => {
        setEditingMaterial(record); // Gán record vào trạng thái đang chỉnh sửa
        if (record) {
            form.setFieldsValue({
                ...record,
                price: record.price.toFixed(0),
                importDate: moment(record.importDate), 
                expiryDate: moment(record.expiryDate), 
            });
        }
        setOpenCreateMaterialModal(true);
    };


    const onOKCreateMaterial = async () => {
        try {
            const data = form.getFieldsValue();
            if (data.importDate) {
                data.importDate = data.importDate.toISOString();
            } else {
                message.error('Vui lòng chọn ngày nhập!');
                return;
            }
            if (data.expiryDate) {
                data.expiryDate = data.expiryDate.toISOString();
            } else {
                message.error('Vui lòng chọn ngày hết hạn!');
                return;
            }

            if (editingMaterial) {
                const { id, ...rest } = data;
                await AdminApiRequest.put(`/material/${editingMaterial.id}`, rest);
            } else {
                await AdminApiRequest.post('/material', data);
            }

            fetchMaterialList();
            setOpenCreateMaterialModal(false);
            form.resetFields();
            message.success('Nguyên liệu đã được lưu thành công!');
            setEditingMaterial(null);

        } catch (error) {
            console.error('Lỗi khi tạo nguyên liệu:', error);
            message.error('Không thể tạo nguyên liệu. Vui lòng thử lại.');
        }
    }

    const onCancelCreateMaterial = () => {
        setOpenCreateMaterialModal(false);
        form.resetFields();
    };

    const onDeleteMaterial = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/material/${id}`);
            fetchMaterialList();
            message.success('Nguyên liệu đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa nguyên liệu:', error);
            message.error('Không thể xóa nguyên liệu. Vui lòng thử lại.');
        }
    };

        const handleSearchKeyword = () => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) {
            fetchMaterialList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
            return;
        }

        const filtered = materialList.filter(material => {
            const name = (material.name ?? '').toLowerCase();
            const storageType = (material.storageType ?? '').toLowerCase();
            return name.includes(keyword) || storageType.includes(keyword) ||
                String(material.id).toLowerCase().includes(keyword)           
        });
        setMaterialList(filtered);
    }
    useEffect(() => {
        if (!searchKeyword.trim()) {
            fetchMaterialList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
        }
    }, [searchKeyword]);

    return (
        <div className="container-fluid m-2">
            <div className='sticky-header-wrapper'>
                <h2 className="h2 header-custom">QUẢN LÝ NGUYÊN LIỆU</h2>
                {/* Tìm kiếm và Import + Export */}
                <div className="header-actions d-flex me-2 py-2 align-items-center justify-content-between">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        <Form layout="inline" className="search-form d-flex">
                        <SearchInput
                            placeholder="Tìm kiếm theo tên, loại bảo quản hoặc ID"
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
                            onClick={() => onOpenCreateMaterialModal()}
                        >
                        </Button>
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
                className='material-modal'
                title={editingMaterial ? "Chỉnh sửa" : "Thêm mới"}
                open={openCreateMaterialModal}
                onCancel = {() => onCancelCreateMaterial()}
                footer={null}
            >
                <Form form={form} layout="vertical">
                    <FloatingLabelInput
                        name="name"
                        label="Tên nguyên liệu"
                        component='input'
                        rules={[{ required: true, message: 'Tên nguyên liệu là bắt buộc' }]}
                    />
                    <div className='grid-2'>
                        <FloatingLabelInput
                            name="quantityImported"
                            label="Số lượng nhập"
                            component='input'
                            type='number'
                            rules={[{ required: true, message: 'Số lượng nhập là bắt buộc' }]}
                        />
                        <FloatingLabelInput
                            name="quantityStock"
                            label="Số lượng tồn"
                            component='input'
                            type='number'
                            rules={[{ required: true, message: 'Số lượng tồn là bắt buộc' }]}
                        />
                    </div>
                    <div className='grid-2'>
                        <FloatingLabelInput
                            name="price"
                            label="Giá"
                            component='input'
                            type='number'
                            rules={[{ required: true, message: 'Giá là bắt buộc' }]}
                        />
                        <FloatingLabelInput
                            name="storageType"
                            label="Loại bảo quản"
                            component='select'
                            rules={[{ required: true, message: 'Loại bảo quản là bắt buộc' }]}
                            options={[
                                { value: 'Cấp đông', label: 'Cấp đông' },
                                { value: 'Để ngoài', label: 'Để ngoài' },
                            ]}
                        />
                    </div>
                    <div className='grid-2'>
                        <FloatingLabelInput
                            name="importDate"
                            label="Ngày nhập"
                            component='date'
                            rules={[{ required: true, message: 'Ngày nhập là bắt buộc' }]}
                        />
                        <FloatingLabelInput
                            name="expiryDate"
                            label="Ngày hết hạn"
                            component='date'
                            rules={[{ required: true, message: 'Ngày hết hạn là bắt buộc' }]}
                        />
                    </div>
                    <div className='modal-footer-custom d-flex justify-content-end align-items-center gap-3'>
                        <Button
                            type='default'
                            onClick={() => onCancelCreateMaterial()}
                        >
                            Hủy
                        </Button>
                        <Button
                            type='primary'
                            onClick={onOKCreateMaterial}
                        >
                            {editingMaterial ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </div>  
                </Form>
            </Modal>
            <Table
                dataSource={materialList}
                pagination={{
                    pageSize: 9, // Số lượng item trên mỗi trang
                    showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                     // Các tùy chọn cho số item mỗi trang
                    }}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
                    { title: 'Tên nguyên liệu', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
                    { title: 'Số lượng nhập', dataIndex: 'quantityImported', key: 'quantityImported', sorter: (a, b) => a.quantityImported - b.quantityImported },
                    { title: 'Số lượng tồn', dataIndex: 'quantityStock', key: 'quantityStock', sorter: (a, b) => a.quantityStock - b.quantityStock },
                    { title: 'Giá', dataIndex: 'price', key: 'price', sorter: (a, b) => a.price - b.price,
                        render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
                     },
                    { title: 'Loại bảo quản', dataIndex: 'storageType', key: 'storageType', sorter: (a, b) => a.storageType.localeCompare(b.storageType) },
                    { title: 'Ngày nhập', dataIndex: 'importDate', key: 'importDate', sorter: (a, b) => moment(a.importDate).unix() - moment(b.importDate).unix(),
                        render: (importDate: string) => moment(importDate).format('YYYY-MM-DD HH:mm:ss')
                     },
                    { title: 'Ngày hết hạn', dataIndex: 'expiryDate', key: 'expiryDate', sorter: (a, b) => moment(a.expiryDate).unix() - moment(b.expiryDate).unix(),
                        render: (expiryDate: string) => moment(expiryDate).format('YYYY-MM-DD HH:mm:ss'),
                     },
                    { title: 'Hành động',
                        key: 'actions',
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="default" onClick={() => onOpenCreateMaterialModal(record)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa nguyên liệu này không?"
                                    onConfirm={() => onDeleteMaterial(record.id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button className="ant-btn-danger">
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default ManagerMaterialList;
