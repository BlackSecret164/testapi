import { Button,  Form, Input, message, Modal, Popconfirm,  Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import "./AdminBranchList.scss";
import { AdminApiRequest } from '@/services/AdminApiRequest';
import FloatingLabelInput from '@/components/adminsytem/FloatingInput/FloatingLabelInput';
import SearchInput from '@/components/adminsytem/Search/SearchInput';

const AdminBranchList = () => {
    const [branchForm] = Form.useForm();
    const [adminBranchList, setAdminBranchList] = useState<any[]>([]);
    const [openCreateBranchModal, setOpenCreateBranchModal] = useState(false);
    const [editBranch, setEditBranch] = useState<any>(null);


    const fetchAdminBranchList = async () => {
        try {
            const res = await AdminApiRequest.get('/branch/list');
            setAdminBranchList(res.data);
        } catch (error) {
            console.error('Error fetching branch list:', error);
            message.error('Failed to fetch branch list.');
        }
        
    }

    useEffect(() => {
        fetchAdminBranchList();
    }, []);

    // Các hàm xử lý cho Branch
    const onOpenCreateBranchModal = (record: any = null) => {
        setEditBranch(record);
        if (record) {
            branchForm.setFieldsValue({
                ...record,
                createAt: moment(record.createAt),
            });
        } else {
            branchForm.resetFields();
        }
        setOpenCreateBranchModal(true);
    }
    
    const onOKCreateBranch = async () => {
        try {
            const data = branchForm.getFieldsValue();
            if (data.createAt) {
                data.createAt = data.createAt.toISOString();
            } else {
                message.error("Create date is required!");
                return;
            }
            
            if (editBranch) {
                const { id, ...rest } = data;
                await AdminApiRequest.put(`/branch/${editBranch.id}`, rest);
            } else {
                await AdminApiRequest.post('/branch', data);
            }

            console.log("Branch data:", data);
            fetchAdminBranchList();
            setOpenCreateBranchModal(false);
            branchForm.resetFields();
            message.success("Branch saved successfully!");
            setEditBranch(null);
        } catch (error) {
            console.error('Error saving branch:', error);
            message.error('Failed to save branch. Please try again.');
        }
    }

    const onCancelCreateBranch = () => {
        setOpenCreateBranchModal(false);
        branchForm.resetFields();
    }

    const onOpenEditBranch = (record: any) => {
        setEditBranch(record);
        branchForm.setFieldsValue({
            ...record,
            createAt: moment(record.createAt),
        });
        setOpenCreateBranchModal(true);
    }

    const onDeleteBranch = async (id: number) => {
        try {
            await AdminApiRequest.delete(`/branch/${id}`);
            fetchAdminBranchList();
            message.success('Branch deleted successfully!');
        } catch (error) {
            console.error('Error deleting branch:', error);
            message.error('Failed to delete branch. Please try again.');
        }
    }


    // Hàm tìm kiếm theo từ khóa
    const [searchKeyword, setSearchKeyword] = useState('');
    const handleSearchKeyword = () => {
        const keyword = searchKeyword.trim().toLowerCase();
        if (!keyword) {
            fetchAdminBranchList();
            return;
        }
        const filtered = adminBranchList.filter(branch => {
            const name = (branch.name || '').toLowerCase();
            const address = (branch.address || '').toLowerCase();
            return name.includes(keyword) || address.includes(keyword);
        });
        setAdminBranchList(filtered);
    };
    // Reset search when keyword is empty
    useEffect(() => {
        if (!searchKeyword.trim()) {
            fetchAdminBranchList();
        }
    }, [searchKeyword]);

    return (
        <div className="container-fluid m-2">
            <div className='sticky-header-wrapper'>
                <h2 className="h2 header-custom">QUẢN LÝ CHI NHÁNH</h2>
                <div className="header-actions d-flex me-3 py-2 align-items-center justify-content-between">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        <Form layout="inline" className="search-form d-flex">
                        <SearchInput
                            placeholder="Tìm kiếm theo id, tên chi nhánh hoặc địa chỉ"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onSearch={handleSearchKeyword}
                            allowClear
                        />
                        </Form>
                    </div>
                    <div className="d-flex">
                        <Button 
                            type="primary" 
                            icon={<i className="fas fa-plus"></i>}
                            onClick={() => onOpenCreateBranchModal()}
                        >
                        </Button>
                    </div>
                </div>
            </div>

        {/* Modal for creating or editing branch */}
        <Modal
            className="custom-modal branch-modal"
            title={editBranch ? "Chỉnh sửa" : "Thêm mới"}
            open={openCreateBranchModal}
            onCancel={onCancelCreateBranch}
            footer= {null}        
            >
            <Form form={branchForm} layout="vertical">
                <FloatingLabelInput 
                    name="name"
                    label="Tên chi nhánh"
                    component='input'
                    rules={[{ required: true, message: 'Tên chi nhánh là bắt buộc' }]}
                />
                <FloatingLabelInput 
                    name='address'
                    label='Địa chỉ'
                    component='input'
                    type='textarea'
                    rules={[{ required: true, message: 'Địa chỉ là bắt buộc' }]}
                />
                <FloatingLabelInput 
                    name="phone" 
                    label='Số điện thoại'
                    component='input'
                    type='number'
                    rules={[{ required: true, message: 'Số điện thoại là bắt buộc' }]}
                />
                <FloatingLabelInput 
                    name="createAt"
                    label="Ngày tạo"
                    component='date'
                    rules={[{ required: true, message: 'Ngày tạo là bắt buộc' }]}
                />
                <div className='modal-footer-custom d-flex justify-content-end align-items-center gap-3'>
                    <Button 
                        type='default'
                        onClick={onCancelCreateBranch}
                    >
                        Hủy
                    </Button>
                    <Button 
                        type='primary'
                        onClick={onOKCreateBranch}
                    >
                        {editBranch ? "Lưu thay đổi" : "Tạo mới"}
                    </Button>
                </div>
            </Form>
        </Modal>

        <Table
            dataSource={adminBranchList}
            pagination={{
                pageSize: 8, // Số lượng item trên mỗi trang
                showSizeChanger: true, // Hiển thị tùy chọn thay đổi số item trên mỗi trang
                    // Các tùy chọn cho số item mỗi trang
                }
            }    
                        
            columns={[
                { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
                { title: 'Tên chi nhánh', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
                { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                { title: 'Địa chỉ', dataIndex: 'address', key: 'address'},
                { title: 'Ngày tạo', dataIndex: 'createAt', key: 'createAt', sorter: (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
                    render: (startAt: string) => moment(startAt).format('YYYY-MM-DD HH:mm:ss') },
                {
                    title: 'Actions', key: 'actions', render: (text, record) => (
                        <Space size="middle">
                            <Button type="default" onClick={() => onOpenEditBranch(record)}>
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa chi nhánh này?"
                                onConfirm={() => onDeleteBranch(record.id)}
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

export default AdminBranchList;