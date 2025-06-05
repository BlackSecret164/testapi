import { MainApiRequest } from "@/services/MainApiRequest";
import { Button, Modal, Table, Tag } from "antd"
import { useEffect, useState } from "react";

export const SelectAdditionalService = ({
    isLoadingTier,
    tierList,
    showServiceModal,
    onCancel,
    onOk,
}: {
    isLoadingTier: boolean;
    tierList: any[];
    showServiceModal: boolean;
    onCancel: () => void;
    onOk: (service: any[]) => void;
}) => {
    const [isLoadingService, setIsLoadingService] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [serviceList, setServiceList] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<number[]>([]);

    const onSelectTier = async (id: number) => {
        setShowModal2(true);
        setIsLoadingService(true);
        setSelectedService([]);

        const res = await MainApiRequest.get(`/service/tier/${id}`);
        setServiceList(res.data.services);
        setIsLoadingService(false);
    }

    const onSelectService = (id: number) => {
        if (selectedService.includes(id)) {
            setSelectedService(selectedService.filter((item) => item !== id));
        }
        else {
            setSelectedService([...selectedService, id]);
        }
    }

    const onCancelTier = () => {
        onCancel();
    }

    const onCancelService = () => {
        setShowModal2(false);
    }

    const handleOkService = () => {
        if (!selectedService)
            return;
        onOk(serviceList.filter((item) => selectedService.includes(item.id)));
        setShowModal2(false);
    }

    return (
        <>
            <Modal
                title="Select Additional Services"
                open={showServiceModal && !showModal2}
                loading={isLoadingTier}
                // onOk={handleOkTier}
                okButtonProps={{ hidden: true }}
                onCancel={onCancelTier}
                width={"70%"}
            >
                <Table
                    columns={[
                        {
                            title: "Image",
                            dataIndex: "images",
                            render: (images: string[]) => ({
                                props: {
                                    style: {
                                        verticalAlign: "middle"
                                    }
                                },
                                children: (
                                    <img src={images[0]} alt="service" style={{ width: "150px" }} />
                                )
                            }),
                        },
                        {
                            title: "Service Name",
                            dataIndex: "name",
                            key: "name",
                        },
                        {
                            title: "Type",
                            dataIndex: "type",
                            key: "type",
                            render: (type: string) => (
                                <Tag color="blue">{type}</Tag>
                            ),
                        },
                        {
                            title: "Description",
                            dataIndex: "description",
                            key: "description",
                        },
                        {
                            title: "Action",
                            key: "action",
                            render: (_: any, record: any) => (
                                <Button onClick={() => onSelectTier(record.id)}>Select</Button>
                            ),
                        }
                    ]}
                    dataSource={tierList}
                />
            </Modal>

            <Modal
                title="Select Additional Services"
                open={showServiceModal && showModal2}
                onOk={handleOkService}
                onCancel={onCancelService}
                loading={isLoadingService}
            >
                <Table
                    columns={[
                        {
                            title: "Service Name",
                            dataIndex: "name",
                            key: "name",
                        },
                        {
                            title: "Pricing",
                            dataIndex: "price",
                            key: "price",
                            render: (price: number) => (
                                <span>{price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                            ),
                        },
                        {
                            title: "Action",
                            key: "action",
                            render: (_: any, record: any) => (
                                <Button onClick={() => onSelectService(record.id)}>{
                                    selectedService.includes(record.id) ? "Selected" : "Select"
                                }</Button>
                            ),
                        }
                    ]}
                    dataSource={serviceList}
                />
            </Modal>
        </>
    )
}