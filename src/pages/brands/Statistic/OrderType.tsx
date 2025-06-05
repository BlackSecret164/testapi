import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const OrderType = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        if (data?.serviceType) {
            const { takeAway, dineIn } = data.serviceType;
            const total = takeAway + dineIn;

            const takeAwayPercentage = ((takeAway / total) * 100).toFixed(2);
            const dineInPercentage = ((dineIn / total) * 100).toFixed(2);

            const sampleData = [
                { type: 'Take away', percentage: parseFloat(takeAwayPercentage) },
                { type: 'Dine in', percentage: parseFloat(dineInPercentage) },
            ];


            const labels = sampleData.map(item => item.type);
            const values = sampleData.map(item => item.percentage);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Phần trăm',
                        data: values,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.6)', // Take away
                            'rgba(255, 206, 86, 0.6)', // Dine in
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)', // Take away
                            'rgba(255, 206, 86, 1)', // Dine in
                        ],
                        borderWidth: 1
                    }
                ]
            });
        }
    }, [data]);

    return (
        <div className="chart">
            {chartData ? (
                <Doughnut
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Thống kê loại phục vụ'
                            }
                        }
                    }}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default OrderType;
