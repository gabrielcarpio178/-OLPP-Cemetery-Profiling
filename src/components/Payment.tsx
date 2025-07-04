import { NavLink, Outlet, useNavigate } from 'react-router'
import Sidebar from './subpage/Sidebar'
import 'animate.css'
import { useSearchParams } from 'react-router-dom';
import PayForm from './subpage/PayForm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserData from '../UserData';
import { AlertSuccess } from './messages/AlertMessage';

type TsendAmount = {
    slotId: number,
    fullname: string,
    amount: number
}

type Turl = {
    slotId: number,
    slotName: string,
    groupName: string
}

export default function Payment() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`
    const token = UserData().token

    //interaction
    const [isPayFormOpen, setIsPayFormOpen] = useState(false);
    const [btnIsLoading, setBtnIsLoading] = useState(false)
    const [isOpenAlertMessage, setIsOpenAlertMessage] = useState(false)

    const slotId = searchParams.get("slotId") ?? '';
    const slotName = searchParams.get("slotName") ?? ''
    const groupName = searchParams.get("groupName") ?? ''

    const slotInfos: Turl = {
        slotId: parseInt(slotId),
        slotName: slotName,
        groupName: groupName
    }

    const cancelPay = ()=>{
        navigate("/payment/records")
    }

    const getAmountData = async (data: TsendAmount) =>{
        setBtnIsLoading(true)
        try {
            const res = await axios.post(`${API_LINK}/sendPayment`, data, {
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            if(res.status===200){
                setIsOpenAlertMessage(true)
                setBtnIsLoading(false)
                navigate("/payment")
                return;
            }
        } catch (error) {
            setBtnIsLoading(false)
            return error
        }
    }
    
    

    useEffect(() => {
        if (isOpenAlertMessage) {
            const timer = setTimeout(() => {
                setIsOpenAlertMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpenAlertMessage]);

    useEffect(() => {
        setIsPayFormOpen(slotId.length !== 0);
    }, [slotId]);
    return (
            <>
                <Sidebar/>
                {isOpenAlertMessage&&<AlertSuccess isOpen={isOpenAlertMessage} message="Successfully" />}

                {isPayFormOpen&&<PayForm title='Payment' isOpen={isPayFormOpen} slotInfo={slotInfos} onClose={cancelPay} sendAmountData={getAmountData} btnIsLoading={btnIsLoading}/>}
                
                <div className="pt-28 px-5 sm:mt-0 sm:pt-20 sm:ml-64 capitalize animate__animated animate__fadeIn min-h-screen bg-gray-100">
                    <h1 className='font-bold text-2xl'>
                        Payment
                    </h1>
                    <div className='flex flex-col mt-3'>
                        <ul className='flex flex-row gap-x-2'>
                            <li>
                                <NavLink to="records" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-[#001656] text-white" : "text-black bg-white"} flex items-center p-2 hover:text-white rounded-lg hover:bg-gray-600 group`}>Records</NavLink>
                            </li>
                            <li>
                                <NavLink to="history" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-[#001656] text-white" : "text-black bg-white"} flex items-center p-2 hover:text-white rounded-lg hover:bg-gray-600 group`}>History</NavLink>
                            </li>
                        </ul>
                        <Outlet/>
                    </div>
                    
                </div>
            </>
        )
}
