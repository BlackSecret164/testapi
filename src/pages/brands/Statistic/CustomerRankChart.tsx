import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const CustomerRankChart = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    
    useEffect(() => {
        const sampleData = data?.rankMap || {};
        const arr = Object.entries(sampleData).map(([key, value]) => ({ rank: key, customers: value }));
        
        if (arr.length > 0) {
            const labels = arr.map(item => item.rank);
            const values = arr.map(item => item.customers);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Số lượng',
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)', // Vàng
                            'rgba(54, 162, 235, 0.6)', // Bạc
                            'rgba(255, 206, 86, 0.6)', // Đồng
                            'rgba(75, 192, 192, 0.6)'  // Thường
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            });
        } else {
            setChartData(null);
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
                                text: 'Phân bố khách hàng theo hạng'
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

export default CustomerRankChart;
