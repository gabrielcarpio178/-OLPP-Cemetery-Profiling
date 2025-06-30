import React, { useEffect, useRef, useState } from 'react'
import InputTag from '../inputData/InputTag';
import ButtonTag from '../inputData/ButtonTag';
import SelectTag from '../inputData/SelectTag';
import { FaX } from 'react-icons/fa6';
import { FaEyeSlash, FaEye } from 'react-icons/fa6';
import 'animate.css';
import axios from 'axios';

type DataEdit = {
    id: number
    firstname: string,
    lastname: string,
    role: string,
}


interface DataContent {
    isOpen: boolean;
    getDataInput: (data: {id:number, firstname: string, lastname: string, role: string, username: string, password: string }) => void;
    onClose: () => void;
    title: string,
    roleContent: "add"|"edit",
    editData?: DataEdit | null;
    isLoadingUpdate?: boolean
    editId?: number
}

const UserAccessModal: React.FC<DataContent> = ({getDataInput=()=>{}, isOpen, onClose=()=>{}, title, roleContent, editData, isLoadingUpdate=false, editId})=> {
    const [isShowPassword, setShowPassword] = useState(false)
    const [errors, setErros] = useState({ firstname: false, lastname: false, role: false, username: false,  password: false })
    const formRef = useRef<HTMLFormElement>(null);

    const [firstname, setFirstname] = useState(editData?.firstname ?? "")
    const [lastname, setLastname] = useState(editData?.lastname ?? "")
    const [role, setRole] = useState(editData?.role ?? "")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [resError, setResError] = useState("")
    const [isLoading, setLoading] = useState(isLoadingUpdate)
    const getDataPassword = (data: {isShow: boolean}): void => {
        setShowPassword(data.isShow)
    };   
    
    const submitData = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const formValues = {
            id: editId ?? 0,
            firstname: formData.get("firstname")?.toString() ?? "",
            lastname: formData.get("lastname")?.toString() ?? "",
            role: formData.get("role")?.toString() ?? "",
            username: formData.get('username')?.toString() ?? "",
            password: formData.get('password')?.toString() ?? "" 
        }

        const res = await getDataInput(formValues)
        if (axios.isAxiosError(res)){
            
            if(res.status===400){
                const serverErrors = res.response?.data.details[0];
                setErrorMessage(serverErrors.message)
                setErros({firstname: serverErrors.path[0] === "firstname", lastname: serverErrors.path[0] === "lastname",role: serverErrors.path[0] === "role", username: serverErrors.path[0] === "username",  password: serverErrors.path[0] === "password"})
                setResError("")
            }
            if(res.status===401){
                setErrorMessage("")
                setResError(res.response?.data.message)
            }
        }else{
            formRef.current?.reset();
        }
        setLoading(false)
    }

    useEffect(()=>{
        if (isOpen) {
            if(roleContent==="add"){
                setErros({ firstname: false, lastname: false, role: false, username: false,  password: false })
                setResError("")
                setErrorMessage("")
                setFirstname("")
                setLastname("")
                setRole("")
                setUsername("")
                setPassword("")
                formRef.current?.reset();
            }
        }    
    }, [isOpen])

    return (
        <>
            <div className={`${isOpen?"":"hidden"} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-black/50`}>
                <div className="relative p-4 w-full max-w-md max-h-full animate__animated animate__fadeIn">
                    <div className="relative bg-gray-100 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {title}
                            </h3>
                            <button className='cursor-pointer' onClick={() => onClose()}>
                                <FaX/>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className="space-y-4" onSubmit={submitData} ref={formRef}>
                                <InputTag selector='firstname' type='text' flex={'flex-col'} label="Firstname" hasError={errors.firstname} errorMessage={errorMessage} valueData={firstname} onChange={(e)=>setFirstname(e.target.value)} />
                                <InputTag selector='lastname' type='text' flex={'flex-col'} label="Lastname"  hasError={errors.lastname} errorMessage={errorMessage} valueData={lastname} onChange={(e)=>setLastname(e.target.value)}/>
                                <SelectTag datas={[{value: "admin", text:"admin"}, { value: "encoder", text:"encoder"}]} selector='role' flex={'flex-col'} label="role"  hasError={errors.role} errorMessage={errorMessage} valueData={role} onChange={(e) => setRole(e.target.value)} />
                                {
                                    roleContent==="add"&&
                                    <>
                                        <InputTag selector='username' type='text' flex={'flex-col'} label="Username" hasError={errors.username} errorMessage={errorMessage} valueData={username} onChange={(e)=>setUsername(e.target.value)} />
                                        <InputTag selector="password" placeholder='Password' label='Password' flex='flex-col' type={isShowPassword?'text':'password'} icon={isShowPassword?FaEyeSlash:FaEye} size={1.5} getDataIsShow={getDataPassword}  hasError={errors.password} errorMessage={errorMessage} valueData={password} onChange={(e)=>setPassword(e.target.value)}/>
                                    </>
                                    
                                }
                                <div>
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 capitalize">{resError}</p>
                                </div>
                                <ButtonTag type='submit' text='Submit' disabled={isLoading}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default UserAccessModal