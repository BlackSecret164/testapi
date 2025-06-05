import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const OrderRevenue14 = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    const sampleData = data?.last14DaysOrder || [];


    useEffect(() => {
        const labels = sampleData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
        const orderValues = sampleData.map((item: any) => item.amount);
        const revenueValues = (data?.last14DaysOrderValue || []).map((item: any) => item.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Số lượng sản phẩm',
                    data: orderValues,
                    backgroundColor: 'rgba(8, 230, 82, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y-axis-1',
                },
                {
                    type: 'bar',
                    label: 'Doanh thu hàng ngày (VND)',
                    data: revenueValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 0.6)',
                    fill: false,
                    yAxisID: 'y-axis-2',
                }
            ]
        });
    }, [data]);

    return (
        <div className="chart">
            {chartData ? (
                <Chart
                    type="bar"
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Số lượng sản phẩm được đặt và doanh thu trong 14 ngày qua'
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Ngày'
                                }
                            },
                            'y-axis-1': {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Số lượng sản phẩm được đặt'
                                },
                                beginAtZero: true,
                            },
                            'y-axis-2': {
                                type: 'linear',
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Doanh thu (VND)'
                                },
                                beginAtZero: true,
                                grid: {
                                    drawOnChartArea: false,
                                },
                            }
                        }
                    }}
                />
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
}

export default OrderRevenue14;
