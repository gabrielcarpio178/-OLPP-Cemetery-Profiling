import React, { useState } from 'react'
import axios from 'axios';
import InputTag from './inputData/InputTag';
import { FaEyeSlash, FaEye } from 'react-icons/fa6';
import ButtonTag from './inputData/ButtonTag';
import { useNavigate } from 'react-router';
import 'animate.css'

export default function Login() {

    const [isShowPassword, setShowPassword] = useState(false)
    const [errors, setErros] = useState({ username: false, password: false})
    const [errorMessage, setErrorMessage] = useState("")
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState("") 
    const navigate = useNavigate();
    

    const getDataPassword = (data: {isShow: boolean}): void => {
        setShowPassword(data.isShow)
    };   

    const loginData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const formValues = {
            username: formData.get('username'),
            password: formData.get('password')  
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
                    setInvalidMessage(`"username" or "password" not match.`)
                }else{
                    setInvalidMessage(`something want wrong.`)
                }
            }
            setDisabledBtn(false)
        }

    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate__animated animate__fadeIn">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={loginData}>
                            <InputTag selector="username" placeholder='Username' label='Username' flex='flex-col' type='text' hasError={errors.username} errorMessage={errorMessage}/>
                            <InputTag selector="password" placeholder='Password' label='Password' flex='flex-col' hasError={errors.password} type={isShowPassword?'text':'password'} icon={isShowPassword?FaEyeSlash:FaEye} size={1.5} getDataIsShow={getDataPassword} errorMessage={errorMessage}/>
                            <p className="text-sm text-red-600 dark:text-red-500">{invalidMessage}</p>
                            <div>
                                <ButtonTag text='Login' type='submit' disabled={disabledBtn}/>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
