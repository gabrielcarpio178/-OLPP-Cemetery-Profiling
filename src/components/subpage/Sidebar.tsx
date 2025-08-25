import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router';
import { FaArrowRightFromBracket, FaChartSimple, FaBars, FaXmark, FaUsers, FaGear, FaUsersBetweenLines, FaCreditCard, FaList } from "react-icons/fa6";
import UserData from '../../UserData';
import axios from 'axios';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const [isloading, setIsloading] = useState(false)

    const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`
    const userData = UserData().user
    const token = UserData().token

    const logout = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault(); 
        setIsloading(true)
        try {
            
            const res = await axios.get(`${API_LINK}/logout/${userData.id}`, {
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            }) 
            if(res.status===200){
                localStorage.removeItem("user");
                localStorage.removeItem("token")
                navigate("/login")
            }


        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            
            <header className='fixed top-0 left-0 z-40 w-full h-16 flex items-center justify-between px-3 sm:px-5 md:px-7 lg:px-10' style={{backgroundColor: 'var(--sidebar-color)'}}>
                <div className='text-md sm:text-lg md:text-xl lg:text-2xl text-white font-bold'>
                    OLPP Cemetery Profiling
                </div>
                <div className='text-white flex flex-col items-center text-sm sm:text-md md:text-lg lg:text-xl'>

                    <div className='capitalize'>
                        {userData.firstname} {userData.lastname}
                    </div>
                    <div className='font-bold capitalize'>
                        {userData.role}
                    </div>
                </div>
            </header>

            <button type="button" className="z-[1] fixed top-16 inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400" onClick={toggleSidebar}>
                <span className="sr-only">Open sidebar</span>
                <FaBars/>
            </button>

            <aside className={`fixed top-16 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
                <div className="h-full px-3 py-4 overflow-y-auto" style={{backgroundColor: 'var(--sidebar-color)'}}>
                    <ul className="space-y-2 font-medium">
                        <li key={0}>
                            <div className='flex justify-end sm:hidden'>
                                <button type="button" className="flex items-center p-2 text-white cursor-pointer hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg group" onClick={toggleSidebar}>
                                    <span className="sr-only">close sidebar</span>
                                    <FaXmark/>
                                </button>
                            </div>
                            
                        </li>
                        
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-gray-100" : "text-white"} flex items-center p-2 hover:text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <div className='group-hover:text-gray-900'>
                                    <FaChartSimple/>
                                </div>
                                <span className="ms-3">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/groups" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-gray-100" : "text-white"} flex items-center p-2 hover:text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <div className='group-hover:text-gray-900'>
                                    <FaUsersBetweenLines/>
                                </div>
                                <span className="ms-3">Groups</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/master_list" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-gray-100" : "text-white"} flex items-center p-2 hover:text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <div className='group-hover:text-gray-900'>
                                    <FaList/>
                                </div>
                                <span className="ms-3">Master List</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/payment" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-gray-100" : "text-white"} flex items-center p-2 hover:text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <div className='group-hover:text-gray-900'>
                                    <FaCreditCard/>
                                </div>
                                <span className="ms-3">Payment</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/user_access" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-gray-100" : "text-white"} flex items-center p-2 hover:text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <div className='group-hover:text-gray-900'>
                                    <FaUsers/>
                                </div>
                                <span className="ms-3">User Access</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settings" className={({ isActive }: { isActive: boolean }) => `${isActive ? "bg-gray-100" : "text-white"} flex items-center p-2 hover:text-gray-900 rounded-lg hover:bg-gray-100 group`}>
                                <div className='group-hover:text-gray-900'>
                                    <FaGear/>
                                </div>
                                <span className="ms-3">Settings</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink onClick={logout} to="/logout" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-100 group hover:text-gray-900">
                                {isloading&&<p>Loading...</p>}
                                {!isloading&&
                                    <>
                                        <div className='group-hover:text-gray-900'>
                                            <FaArrowRightFromBracket/>
                                        </div>
                                        <span className="ms-3">Logout</span>
                                    </>
                                        
                                }
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>

        </>
    )
}