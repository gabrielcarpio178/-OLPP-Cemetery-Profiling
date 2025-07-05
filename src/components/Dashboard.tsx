import UserData from '../UserData'
import Sidebar from './subpage/Sidebar'
import 'animate.css'
import ourLadyOfPeaceFull from './images/our-lady-of-peace-full.png'
import { TbCurrencyPeso } from 'react-icons/tb'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { IconContext } from 'react-icons/lib'
import { FaClock } from 'react-icons/fa6'
import {BarGraph, CircleGraph, DoughnutGraph, LineGraph} from './subpage/Graph'
import axios from 'axios'

type Ttotal = {
    total_payment: number,
    total_burial: number
}

type TPieGraph ={
    group_name: string
    record_count: number
}

type TBarGraph = {
    month: string,
    total_amount: number
}

type TLineGraph = {
    death_count: number,
    death_year: number
}

type TDoughnutGraph = {
    group_name: string,
    total_amount: number
}

export default function Dashboard() {
    const userAccount = UserData().user
    const token = UserData().token
    const API_LINK = import.meta.env.VITE_APP_API_LNK+"/auth"
    //interaction
    const [datetime, setDatetime] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    //datas
    const [totals, setTotals] = useState<Ttotal|null>(null)
    const [bardata, setBarData] = useState<TBarGraph[]>([])
    const [pieData, setPieData] = useState<TPieGraph[]>([])
    const [lineData, setLineData] = useState<TLineGraph[]>([])
    const [doughnutData, setDoughnutData]  = useState<TDoughnutGraph[]>([])

    const getDatas = async ()=>{
        setIsLoading(true)
        try {
            const res = await axios.get(`${API_LINK}/getDashboard`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            
            setTotals(res.data.totals)
            setBarData(res.data.barGraph)
            setPieData(res.data.pieGraph)
            setLineData(res.data.lineGraph)
            setDoughnutData(res.data.doughnutGraph)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    const getCurrentDatetime = () =>{
        const now = moment();
        const formattedDateTime = now.format('MMMM DD, YYYY h:mm:ss a');
        setDatetime(formattedDateTime);
    }

    useEffect(()=>{
        setInterval(function() {
            getCurrentDatetime()
        }, 1000);
    },[])

    useEffect(()=>{
        getDatas()
    },[])


    return (
        <>
            <Sidebar />
            <div className="pt-28 px-5 sm:mt-0 sm:pt-20 sm:ml-64 capitalize animate__animated animate__fadeIn min-h-screen bg-gray-100">
                <h1 className='font-bold text-2xl'>
                    Dashboard
                </h1>
                <div className='mt-6'>
                    <div className='flex flex-col md:flex-row gap-2'>
                        <div className='grid md:grid-rows-2 gap-3 md:w-1/3 w-full grid-rows-1'>
                            <div className='before:content-[""] before:h-full before:bg-white/50 relative before:absolute before:w-full before:rounded-lg before:z-[999]'>
                                <div className='h-[35vh] w-full flex flex-row gap-x-2 p-2 rounded-lg shadow-lg relative overflow-hidden ' style={{ backgroundColor: 'var(--body-color)' }}>
                                    <div className='z-[999]'>
                                        <div className='flex flex-col justify-between p-3 h-full'>
                                            <div>
                                                <h1 className='text-3xl'>
                                                    Welcome
                                                </h1>
                                                <div className='font-bold text-4xl'>
                                                    {`${userAccount.firstname} ${userAccount.lastname}`}
                                                </div>
                                            </div>
                                            <div className='text-lg w-1/2 text-center rounded shadow-lg text-white' style={{ backgroundColor: 'var(--sidebar-color)' }}>
                                                {userAccount.role}
                                            </div>
                                        </div>
                                        <div className='absolute -bottom-10 -right-10'>
                                            <img src={ourLadyOfPeaceFull} alt="Our lady of peace image" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='h-[35vh] w-full  grid grid-cols-2 gap-2'>
                                <div className='rounded-lg shadow-lg flex flex-col items-center justify-center'>
                                    <div className='flex flex-col items-center gap-y-1'>
                                        <h2 className='text-xl font-bold'>
                                            Total Payment
                                        </h2>
                                        <div className='text-2xl flex items-center'>
                                            {!isLoading?<><TbCurrencyPeso/><span>{totals?.total_payment}</span></>:<p>Loading..</p>}
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className='rounded-lg shadow-lg flex flex-col items-center justify-center'>
                                    <div className='flex flex-col items-center  gap-y-1'>
                                        <div className='text-xl font-bold'>
                                            Total Burial
                                        </div>
                                        <div className='text-2xl'>
                                            {!isLoading?<>{totals?.total_burial}</>:<p>Loading..</p>}
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className='rounded-lg shadow-lg col-span-2 flex flex-row items-center'>
                                    <div className='w-1/4 flex flex-row justify-center'>
                                        <IconContext.Provider value={{ color: "black", size: "4em" }}>
                                            <FaClock/>
                                        </IconContext.Provider>
                                    </div>
                                    <div className='flex flex-col w-3/4'>
                                        <div className="text-2xl font-bold">DateTime</div>
                                        <div className="font-bold text-lg">{!isLoading?datetime:"Loading..."}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='md:w-3/4 w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='rounded-lg shadow-lg flex items-center justify-center'>
                                {!isLoading?<BarGraph datas={bardata}/>:<p>Loading...</p>}
                            </div>
                            <div className='rounded-lg shadow-lg flex items-center justify-center'>
                                {!isLoading?<CircleGraph datas={pieData} />:<p>Loading...</p>}
                            </div>
                            <div className='rounded-lg shadow-lg flex items-center justify-center'>
                                {!isLoading?<DoughnutGraph datas={doughnutData}/>:<p>Loading...</p>}
                            </div>
                            <div className='rounded-lg shadow-lg flex items-center justify-center'>
                                {!isLoading?<LineGraph datas={lineData}/>:<p>Loading...</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
