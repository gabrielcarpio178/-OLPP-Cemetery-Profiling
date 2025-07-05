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
    RadialLinearScale,
} from 'chart.js';
import type React from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import moment from 'moment';
import { useMemo } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';

type TBarGraph = {
    month: string,
    total_amount: number
}

interface IDataBar {
    datas: TBarGraph[]
}

function generateRGBAColorArray(count: number, alpha = 0.5) {
    return Array.from({ length: count }, (_, i) => {
        const hue = Math.floor((360 / count) * i); // evenly spaced hue
        return `hsla(${hue}, 70%, 50%, ${alpha})`;
    });
}

export const BarGraph: React.FC<IDataBar> = ({datas}) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ChartDataLabels
    );

    const options: ChartOptions<'bar'>  = {
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
    const labels: string[] = datas.map((data: TBarGraph)=>{
        return (moment(data.month, 'YYYY-MM').format('MMMM'))
    });
    const data = {
    labels,
    datasets: [
        {
            label: 'Monthly Collection',
            data: datas.map((data: TBarGraph)=>{return (data.total_amount)}),
            backgroundColor: useMemo(() => generateRGBAColorArray(labels.length), [labels.length]),
        },
    ],};
    return (
        <div className="w-full h-[200px]">
            <Bar options={options} data={data} />
        </div>
    )
}

type TPieGraph ={
    group_name: string
    record_count: number
}

interface IDataCircle {
    datas: TPieGraph[]
}

export const CircleGraph: React.FC<IDataCircle> = ({datas}) =>{
    ChartJS.register(ArcElement, Tooltip, Legend, );

    const labels = datas.map((data: TPieGraph)=>{return data.group_name.toLocaleUpperCase()})

    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Burial Count',
            data: datas.map((data: TPieGraph)=>{
                return data.record_count
            }),
            backgroundColor:  useMemo(() => generateRGBAColorArray(labels.length), [labels.length]),
            borderWidth: 0.5,
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

type TLineGraph = {
    death_count: number,
    death_year: number
}

interface IDataLine {
    datas: TLineGraph[]
}

export const LineGraph: React.FC<IDataLine> = ({datas}) =>{
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
                legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Total Burials per Year',
            },
        },
    };

    const labels: number[] = datas.map((data: TLineGraph)=>{
        return data.death_year
    });

    const data = {
        labels,
        datasets: [
        {
            label: 'Annual Burial Count',
            data: datas.map((data: TLineGraph)=>{
                return data.death_count
            }),
            borderColor: useMemo(() => generateRGBAColorArray(labels.length), [labels.length])[0],
            backgroundColor: useMemo(() => generateRGBAColorArray(labels.length), [labels.length])[0],
        }],
    };
    return (
        <div className="w-full h-[200px]">
            <Line options={options} data={data} />
        </div>
    );
}

type TDoughnutGraph = {
    group_name: string,
    total_amount: number
}

interface IDoughnutGraph {
    datas: TDoughnutGraph[]
}
export const DoughnutGraph: React.FC<IDoughnutGraph> = ({datas})=>{
    ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

    const labels: string[] = datas.map((data: TDoughnutGraph)=>{
        return (data.group_name.toLocaleUpperCase())
    })

    const data = {
        labels: labels,
        datasets: [
            {
            label: '# of Votes',
            data: datas.map((data: TDoughnutGraph)=>{
                return (data.total_amount)
            }),
            backgroundColor: useMemo(() => generateRGBAColorArray(labels.length), [labels.length]),
            },
        ],
    };
    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true,
            animateRotate: true,
        },
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Total Amount per Group',
            },
        },
    };
    return (
        <div className="w-full h-[200px]">
            <Doughnut data={data} options={options} />;
        </div>
    )
}
