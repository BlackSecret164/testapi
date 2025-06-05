import { AdminApiRequest } from '@/services/AdminApiRequest';
import { Button, Form, message, Table, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './AdminOrderList.scss';
import SearchInput from '@/components/adminsytem/Search/SearchInput';

export const AdminOrderList = () => {
  const [adminOrderList, setAdminOrderList] = useState<any[]>([]);
  const [originalAdminOrderList, setOriginalAdminOrderList] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchAdminOrderList = async () => {
    const res = await AdminApiRequest.get('/order/list');
    setAdminOrderList(res.data);
    setOriginalAdminOrderList(res.data);
  };

  useEffect(() => {
    fetchAdminOrderList();
  }, []);

  const handleSearchKeyword = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      fetchAdminOrderList();
      return;
    }
    const filtered = originalAdminOrderList.filter(order => {
      const id = String(order.id ?? '').toLowerCase();
      const phone = (order.phone ?? '').toLowerCase();
      const staffName = (order.staffName ?? '').toLowerCase();

      return id.includes(keyword) || phone.includes(keyword) || staffName.includes(keyword);
    });
    setAdminOrderList(filtered);
  };

  // Reset search when keyword is empty
  useEffect(() => {
    if(!searchKeyword.trim()) {
      fetchAdminOrderList();
    }
  },[searchKeyword]);

  const handleExportAdminOrderList = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      adminOrderList.map(order => ({
        'Mã đơn': order.id,
        'Số điện thoại': order.phone,
        'Loại phục vụ': order.serviceType,
        'Tổng tiền': order.totalPrice,
        'Ngày đặt': moment(order.orderDate).format('DD-MM-YYYY HH:mm:ss'),
        'Nhân viên': order.staffName,
        'Trạng thái': order.status
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh Sách Đơn Hàng');
    XLSX.writeFile(workbook, 'DanhSachDonHang.xlsx');
    message.success('Xuất danh sách đơn hàng thành công.');
  };

  return (
    <div className="container-fluid m-2">
      <div className='sticky-header-wrapper'>
        <h2 className="h2 header-custom">DANH SÁCH ĐƠN HÀNG</h2>
        {/* Tìm kiếm và  Export */}
        <div className="header-actions d-flex me-3 py-2 align-items-center justify-content-between">
          <div className="flex-grow-1 d-flex justify-content-center">
            <Form layout="inline" className="search-form d-flex">
              <SearchInput
                  placeholder="Tìm kiếm theo SĐT, mã đơn hoặc nhân viên"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onSearch={handleSearchKeyword}
                  allowClear
              />
            </Form>
          </div>
          <div className="d-flex" >
            <Button 
              type="default" icon={<DownloadOutlined />}
              onClick={handleExportAdminOrderList}
              title='Tải xuống danh sách'
            />
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <Table
        dataSource={adminOrderList}
        rowKey="id"
        columns={[
          {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id
          },
          {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone'
          },
          {
            title: 'Loại phục vụ',
            dataIndex: 'serviceType',
            key: 'serviceType',
            sorter: (a, b) => a.serviceType.localeCompare(b.serviceType)
          },
          {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice
          },
          {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date: string) => moment(date).format('DD-MM-YYYY HH:mm:ss'),
            sorter: (a, b) => moment(a.orderDate).unix() - moment(b.orderDate).unix()
          },
          {
            title: 'Nhân viên',
            dataIndex: 'staffName',
            key: 'staffName',
            sorter: (a, b) => a.staffName.localeCompare(b.staffName)
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
              let color = 'default';
              if (status === 'Đang thực hiện') color = 'purple';
              else if (status === 'Hoàn thành') color = 'green';
              else if (status === 'Đã hủy') color = 'red';
              return <Tag color={color}>{status}</Tag>;
            },
            sorter: (a, b) => a.status.localeCompare(b.status)
          }
        ]}
      />
    </div>
  );
};

export default AdminOrderList;
