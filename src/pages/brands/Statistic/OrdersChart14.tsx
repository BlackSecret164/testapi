import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const OrdersChart14 = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);
    const sampleData = data?.last14DaysOrder || [];

    useEffect(() => {
        if (sampleData.length > 0) {
            const labels = sampleData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
            const values = sampleData.map((item: any) => item.amount);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Số lượng',
                        data: values,
                        backgroundColor: 'rgba(184, 113, 249, 0.6)',
                        borderColor: 'rgba(200, 155, 242, 0.6)',
                        borderWidth: 1
                    }
                ]
            });
        }
    }, [sampleData]);

    return (
        <div className="chart">
            {chartData && chartData.labels.length > 0 ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Số lượng đơn trong 14 ngày qua'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Ngày'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Số lượng sản phẩm được đặt'
                                },
                                beginAtZero: true
                            }
                        }
                    }}
                />
            ) : (
                <p>Không có dữ liệu để hiển thị</p>
            )}
        </div>
    );
};

export default OrdersChart14;
