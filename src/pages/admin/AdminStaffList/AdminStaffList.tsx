import { Button, Form, Input, message, Table, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import "./AdminStaffList.scss";
import SearchInput from '@/components/adminsytem/Search/SearchInput';
import { AdminApiRequest } from '@/services/AdminApiRequest';

const AdminStaffList = () => {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');

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


    const handleSearchKeyword = () => {
        if (!searchKeyword.trim()) {
            fetchStaffList(); // Lấy lại danh sách đầy đủ nếu không có từ khóa tìm kiếm
            return;
        }
        const keyword = searchKeyword.toLowerCase();
        const filtered = staffList.filter(staff =>
            staff.name.toLowerCase().includes(keyword) ||
            staff.typeStaff.toLowerCase().includes(keyword) ||
            staff.phone.toLowerCase().includes(keyword)
        );
        setStaffList(filtered);
    }

    const handleImportExcel = (file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log("Imported Excel data:", jsonData);
            message.success("Import thành công (chỉ hiển thị, không lưu vào hệ thống).");
            // Có thể thêm logic hiển thị hoặc xử lý khác nếu cần
        };
        reader.readAsArrayBuffer(file);
        return false; // Ngăn AntD upload mặc định
    };

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
                        <Upload
                        beforeUpload={handleImportExcel}
                        showUploadList={false}
                        accept=".xlsx, .xls"
                        >
                        <Button 
                            type="default" icon={<UploadOutlined />}
                            title='Tải lên file Excel'
                        />
                        </Upload>
                        <Button 
                        type="default" icon={<DownloadOutlined />}
                        onClick={exportExcel}
                        title='Tải xuống danh sách'
                        />
                    </div>
                </div>
            </div>

            <Table
                dataSource={staffList}
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
                ]}
            />
        </div>
    );
};

export default AdminStaffList;
