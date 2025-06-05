import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Revenue14Days = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    // Dữ liệu doanh thu mẫu
    const sampleData = data?.last14DaysOrderValue || [];

    useEffect(() => {
        const labels = sampleData.map((item: any) => moment(item.date).format('DD/MM/YYYY'));
        const values = sampleData.map((item: any) => item.amount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu hàng ngày',
                    data: values,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
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
                                text: 'Doanh thu hàng ngày trong 14 ngày qua'
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

export default Revenue14Days;
