import React, { useEffect, useState } from 'react'
import ButtonTag from './inputData/ButtonTag'
import InputTag from './inputData/InputTag'
import Sidebar from './subpage/Sidebar'
import { FaEyeSlash, FaEye } from 'react-icons/fa6';
import UserData from '../UserData';
import axios from 'axios';
import { useNavigate } from 'react-router';
import {AlertSuccess} from './messages/AlertMessage';
import 'animate.css'

export default function Settings() {
    const [isOldShowPassword, setOldShowPassword] = useState(false)
    const [isNewShowPassword, setnewShowPassword] = useState(false)
    const [errors, setErros] = useState({ firstname: false, lastname: false, username: false, old_password: false, new_password: false })
    const [resError, setResError] = useState(false)
    const [resMessage, setResMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const user = UserData().user
    const [firstname, setFirstname] = useState(user.firstname)
    const [lastname, setLastname] = useState(user.lastname)
    const [username, setUsername] = useState(user.username)

    
    const token = UserData().token
    const navigate = useNavigate()
    const getOldDataPassword = (data: {isShow: boolean}): void => {
        setOldShowPassword(data.isShow)
    };  
    const getNewDataPassword = (data: {isShow: boolean}): void => {
        setnewShowPassword(data.isShow)
    };  
    const saveData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const formValues = {
            id: user.id,
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            role: user.role,
            username: formData.get('username'),
            new_password: formData.get('new_password'),
            old_password: formData.get('old_password')  
        }
        setDisabledBtn(true)
        const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`
        try {
            const res = await axios.put(`${API_LINK}/updateUser`, formValues, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
            });
            if(res.status===200){
                const updatedUserInfo = {
                    ...user,
                    firstname: formValues.firstname,
                    lastname: formValues.lastname,
                    username: formValues.username,
                    password: res.data.new_password
                };
                localStorage.setItem("user", JSON.stringify(updatedUserInfo));
                setOpen(true);
                setDisabledBtn(false)
                setResMessage("")
                setTimeout(() => {
                    navigate("/settings");
                }, 2000);
            }
        }catch(error){
            if (axios.isAxiosError(error)) {
                if(error.status===400){
                    const serverErrors = error.response?.data.details[0];
                    setErrorMessage(serverErrors.message)
                    setErros({firstname: serverErrors.path[0] === "firstname", lastname: serverErrors.path[0] === "lastname",username: serverErrors.path[0] === "username", old_password: serverErrors.path[0] === "old_password", new_password: serverErrors.path[0] === "new_password"})
                    setResError(false)
                    setResMessage("")
                }else if(error.status===401){
                    setErros({ firstname: false, lastname: false, username: false, old_password: false, new_password: false })
                    setResError(true)
                    setResMessage(error.response?.data.message)
                }
            }
            setDisabledBtn(false)
        }    
    }

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setOpen(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
            <>
                <Sidebar/>
                <AlertSuccess isOpen={isOpen} message="Successfully"/>
                <div className="pt-28 px-5 sm:mt-0 sm:pt-20 sm:ml-64 capitalize animate__animated animate__fadeIn min-h-screen bg-gray-100">
                    <h1 className='font-bold text-2xl'>
                        Settings
                    </h1>
                    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <form className="space-y-6" onSubmit={saveData}>
                                <InputTag valueData={firstname} onChange={e=>setFirstname(e.target.value)} selector="firstname" placeholder='Firstname' label='Firstname' flex='flex-col' type='text' hasError={errors.firstname} errorMessage={errorMessage}/>
                                <InputTag valueData={lastname} selector="lastname" placeholder='Lastname' label='Lastname' flex='flex-col' type='text' hasError={errors.lastname} onChange={e=>setLastname(e.target.value)}/>
                                <InputTag valueData={username} selector="username" placeholder='Username' label='Username' flex='flex-col' type='text' hasError={errors.username} errorMessage={errorMessage} onChange={e=>setUsername(e.target.value)}/>
                                <InputTag selector="old_password" placeholder='Old password' label='Old password' flex='flex-col' type={isOldShowPassword?'text':'password'}  icon={isOldShowPassword?FaEyeSlash:FaEye} getDataIsShow={getOldDataPassword} size={1.5} hasError={errors.old_password} errorMessage={errorMessage}/>
                                <InputTag selector="new_password" placeholder='new password' label='new password' flex='flex-col' type={isNewShowPassword?'text':'password'}  icon={isNewShowPassword?FaEyeSlash:FaEye} getDataIsShow={getNewDataPassword} size={1.5} hasError={errors.new_password} errorMessage={errorMessage} />
                                <div>
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 capitalize">{resError&&resMessage}</p>
                                </div>
                                <div>
                                    <ButtonTag text='Save' type='submit' disabled={disabledBtn}/>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
}
