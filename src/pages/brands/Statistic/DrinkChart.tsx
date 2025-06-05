import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

const DrinkChart = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    const sampleData = data?.salesByCategory || [];

    useEffect(() => {
        const labels = sampleData.map((item: any) => item.category);
        const values = sampleData.map((item: any) => item.amount);

        const presetColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
        ];

        const backgroundColors = labels.map((_: any, i: number) => presetColors[i % presetColors.length]);
        const borderColors = labels.map((_: any, i: number) => presetColors[i % presetColors.length].replace(/0.6/, '1'));

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Số lượng",
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1,
                }
            ]
        });
    }, [data]);

    return (
        <div className='chart'>
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
                                text: 'Thống kê số lượng bán ra của các loại sản phẩm'
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

export default DrinkChart;