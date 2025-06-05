import {
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
import { Line } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Revenue30Days = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    // Dữ liệu doanh thu mẫu
    const sampleData = data?.last30DaysOrderValue || [];

    useEffect(() => {
        const labels = sampleData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
        const values = sampleData.map((item: any) => item.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu hàng ngày',
                    data: values,
                    backgroundColor: 'rgba(255, 111, 97, 100)',
                    borderColor: 'rgba(255, 111, 97, 100)',
                    fill: false,
                    tension: 0.1,
                }
            ]
        });
    }, [data]);

    return (
        <div className="chart">
            {chartData ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Doanh thu hàng ngày trong 30 ngày qua'
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
                                    text: 'Doanh thu (VND)'
                                },
                                beginAtZero: true
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

export default Revenue30Days;
