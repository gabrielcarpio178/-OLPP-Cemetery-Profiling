import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    type ChartOptions,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

export const BarGraph = () => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly Total Amount',
            },
        },
    };
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 2',
            data: [1,2,3,4,5,6,7],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],};
    return (
        <div className="w-full h-[200px]">

        <Bar options={options} data={data} />
        </div>
    )
}

export const CircleGraph = () =>{
    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],};
    
    const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Total Burial per Group',
            },
        },
    };

    return (
        <div className="w-full h-[200px]">
            <Pie data={data} options={options} />
        </div>
    )
}

export const LineGraph = () =>{
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
                legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Total Burials per Month',
            },
        },
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
        {
            label: 'Dataset 1',
            data: [1,2,3,4,5,6,7],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }],
    };
    return <Line options={options} data={data} />;
}
