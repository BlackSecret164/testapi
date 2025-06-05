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

const Top5Drinks = ({ data }: { data: any }) => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        // Kiểm tra và xử lý dữ liệu trước khi cập nhật trạng thái
        if (data?.topProducts?.length > 0) {
            const sampleData = data.topProducts.slice(0, 5); // Lấy tối đa 5 sản phẩm
            const labels = sampleData.map((item: any) => item.name || "Chưa xác định");
            const values = sampleData.map((item: any) => Number(item.amount) || 0);

            const presetColors = [
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
            ];

            const backgroundColors = labels.map((_: any, i: number) => presetColors[i % presetColors.length]);
            const borderColors = labels.map((_: any, i: number) => presetColors[i % presetColors.length].replace(/0.6/, '1'));

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Số lượng',
                        data: values,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                    }
                ]
            });
        } else {
            // Nếu không có dữ liệu, đặt chartData về null để hiển thị thông báo
            setChartData(null);
        }
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
                                text: 'Top 5 thức uống được bán chạy nhất'
                            }
                        }
                    }}
                />
            ) : (
                <p>Không có dữ liệu để hiển thị...</p>
            )}
        </div>
    );
};

export default Top5Drinks;
