import React, { useState } from 'react'
import axios from 'axios';

import { FaEyeSlash, FaEye, FaUser } from 'react-icons/fa6';
import ButtonTag from './inputData/ButtonTag';
import { Link, useNavigate } from 'react-router';
import 'animate.css'
import { IconContext } from 'react-icons/lib';
import { IoMdArrowRoundBack } from 'react-icons/io';
import churchImg from'./images/church-image.png';
import ourLadyOfPeace from "./images/our-lady-of-peace.png"

export default function Login() {

    const [isShowPassword, setShowPassword] = useState(false)
    const [errors, setErros] = useState({ username: false, password: false})
    const [errorMessage, setErrorMessage] = useState("")
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState("") 
    const [invalidAccount, setInvalidAccount] = useState(false)
    const navigate = useNavigate();

    const loginData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const formValues = {
            username: formData.get('username')?.toString(),
            password: formData.get('password')?.toString() 
        }
        setDisabledBtn(true)
        try {
            const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`
            const res = await axios.post(`${API_LINK}/login`, formValues);
            if(res.status===200){
                localStorage.setItem("user", JSON.stringify(res.data.user))
                localStorage.setItem("token", res.data.token)
                navigate("/dashboard")
                setInvalidMessage("")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if(error.status===400){
                    const serverErrors = error.response?.data.details[0];
                    setErrorMessage(serverErrors.message)
                    setInvalidMessage(``)
                    setErros({username: serverErrors.path[0] === "username", password: serverErrors.path[0] === "password"})
                }else if(error.status===401){
                    setErrorMessage("")
                    setInvalidAccount(true)
                    setInvalidMessage(`"username" or "password" not match.`)
                }else{
                    setInvalidMessage(`something want wrong.`)
                }
            }
            console.log(error)
            setDisabledBtn(false)
        }

    }

    return (
        <>
            
            <div className="w-full h-screen relative flex flex-row items-center justify-center">
                <div className='w-full flex md:flex-row h-full'>
                    <div className="md:w-[55%] bg-[#44618E] h-full hidden md:block">
                        <img src={churchImg} alt="church" className='h-full w-full'/>
                    </div>
                    <div className="md:w-[45%] bg-[#86ACE2] relative w-full">
                        <div className='absolute bottom-0 right-0 w-[65%] h-[50%]'>
                            <img src={ourLadyOfPeace} alt="Our Lady Of Peace" className='h-full w-full' />
                        </div>
                    </div>
                </div>
                
                <div className="absolute md:w-auto w-full md:h-auto h-1/2 md:p-0 p-5 animate__animated animate__fadeIn">
                    <div className="w-full h-full bg-[#001656] rounded-2xl shadow-blue-500 shadow-2xl flex md:flex-row relative">
                        <div className="md:w-[55%] md:flex hidden items-center justify-center relative">
                            <div className="bg-[#86ACE2] rounded w-[95%] h-[95%] opacity-100">
                                <img src={churchImg} alt="church" className='h-full w-full'/>
                            </div>
                            <div className='absolute self-start w-full h-full flex flex-col items-center p-5 gap-y-2'>
                                <Link to={"/"} className='self-start cursor-pointer'>
                                    <IconContext.Provider value={{ color: "white", size: "2em" }}>
                                        <IoMdArrowRoundBack/>
                                    </IconContext.Provider>
                                </Link>
                                <div className='text-white text-3xl font-semibold text-center font-serif'>
                                    OLPP Cemetery Profiling
                                </div>
                            </div>
                        </div>
                        <form className='md:w-[44%] absolute md:static w-full h-full flex flex-col justify-center md:block md:p-0 p-16' onSubmit={loginData}>
                            <h1 className='text-center md:p-10 font-serif md:text-5xl text-4xl text-white font-light w-full'>
                                Welcome
                            </h1>

                            <div className='flex flex-col gap-y-3 text-white'>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                                    <div className='relative'>
                                        <div className='absolute right-[3%] w-10 h-10 flex items-center justify-center'>
                                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                                <div>
                                                    <FaUser/>
                                                </div>
                                            </IconContext.Provider>   
                                        </div>
                                        <input  id="username" name="username" type="text" className={`border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500`} placeholder="Username" />
                                        {errors.username&&<p className="mt-2 text-sm text-red-600 dark:text-red-500">{errorMessage}</p>}
                                    </div>
                                    
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                    <div className='relative'>
                                        <div className='absolute right-[3%] w-10 h-10 flex items-center justify-center cursor-pointer' onClick={()=>setShowPassword(!isShowPassword)}>
                                            <IconContext.Provider value={{ color: "white", size: "1.5em" }}>
                                                <div>
                                                    {!isShowPassword? <FaEye/>:<FaEyeSlash/>}
                                                </div>
                                            </IconContext.Provider>   
                                        </div>
                                        <input id='password' name='password' type={isShowPassword?'text':'password'} className={`border text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500`} placeholder="Password" />
                                        {errors.password&&<p className="mt-2 text-sm text-red-600 dark:text-red-500">{errorMessage}</p>}
                                    </div>
                                </div>
                                {!errors.password&&!errors.username&&invalidAccount&&<p className="text-sm text-red-600 dark:text-red-500">{invalidMessage}</p>}
                                
                                <div>
                                    <ButtonTag color='bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800' text='Login' type='submit' disabled={disabledBtn}/>
                                </div>
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            

            
        </>
    )
}
