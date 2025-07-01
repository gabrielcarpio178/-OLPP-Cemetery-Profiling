import { NavLink, Outlet, useNavigate } from 'react-router'
import Sidebar from './subpage/Sidebar'
import 'animate.css'
import { useEffect } from 'react'

export default function Payment() {
    const navigate = useNavigate()
    useEffect(()=>{
        navigate("records")
    },[])
    return (
            <>
                <Sidebar/>
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
