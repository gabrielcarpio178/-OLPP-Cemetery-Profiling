import React, { useState } from 'react'
import { FaX } from 'react-icons/fa6'
import InputTag from '../inputData/InputTag'
import ButtonTag from '../inputData/ButtonTag'
import axios from 'axios'

type GetData = {
    id: number,
    group_name: string
}

interface GroupModalPropsType {
    isOpen: boolean
    title: string
    closeModal: ()=>void
    sendData: (data: {group: string, id:number}) => void
    getData?: GetData
}

const GroupModal: React.FC<GroupModalPropsType> = ({isOpen=false, title, closeModal, sendData=()=>{}, getData={id: 0, group_name: ""}}) => {
    const {id, group_name} = getData
    const [isLoading, setIsLoading] = useState(false)
    const [group, setGroupName] = useState(group_name.toLocaleUpperCase())
    const [errors, setErrors] = useState({group: false})
    const [errorMessage, setErrorMessage] = useState("")
    const sendDataForm = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.currentTarget)
        const formValues = {
            id: id,
            group: formData.get("group")?.toString() ?? ""
        }
        const res = await sendData(formValues)
        if (axios.isAxiosError(res)){
            if(res.status===400){
                const serverErrors = res.response?.data.details[0];
                setErrorMessage(serverErrors.message)
                setErrors({group: serverErrors.path[0] === "group"})
            }
            if(res.status===401){
                setErrors({group: true})
                setErrorMessage(res.response?.data.message)
            }
        }else {
            setErrorMessage("")
            setErrors({group: false})
        }
        setIsLoading(false)
    }

    return (
        <>
            <div className={`${isOpen?"":"hidden"} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-black/50`}>
                <div className="relative p-4 w-full max-w-md max-h-full animate__animated animate__fadeIn">
                    <div className="relative bg-gray-100 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {title}
                            </h3>
                            <button className='cursor-pointer' onClick={closeModal}>
                                <FaX/>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className='flex flex-col gap-y-4' onSubmit={sendDataForm}>
                                <InputTag selector='group' flex="flex-col" label="group" type='text' valueData={group} onChange={e=>setGroupName(e.target.value)} hasError={errors.group} errorMessage={errorMessage} />
                                <ButtonTag text='Submit' type='submit' disabled={isLoading}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>        
        </>
    )
}

export default GroupModal