import React, { useState } from 'react'
import { FaX } from 'react-icons/fa6'
import InputTag from '../inputData/InputTag'
import ButtonTag from '../inputData/ButtonTag'
import axios from 'axios'

type TslotInfo = {
    slotId : number,
    slotName: string
    groupName: string
}

type TsendAmount = {
    slotId: number,
    fullname: string,
    amount: number
}

interface IPayForm {
    title: string
    isOpen: boolean,
    slotInfo: TslotInfo,
    onClose: ()=>void,
    sendAmountData: (data: TsendAmount)=>void,
    btnIsLoading: boolean
}

const PayForm: React.FC<IPayForm> = ({title, isOpen, slotInfo, onClose =()=>{}, sendAmountData=()=>{}, btnIsLoading}) =>  {
    //dispay error
    const [hasError, setHasError] = useState({fullname: false, amount: false})
    const [errorMessage, setErrorMessage] = useState("")

    const sendAmount = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const formValues: TsendAmount = {
            slotId: slotInfo.slotId,
            fullname: formData.get("fullname")?.toString()??'',
            amount: parseInt(formData.get("amount")?.toString()??"0")
        }
        const res = await sendAmountData(formValues)
        if (axios.isAxiosError(res)){
            if(res.status===400){
                const serverErrors = res.response?.data.details[0];
                setErrorMessage(serverErrors.message);
                setHasError({fullname: serverErrors.path[0]==="fullname", amount: serverErrors.path[0]==="amount"});
            }
        }else{
            setErrorMessage("");
            setHasError({fullname: false, amount: false});
        }
    }
    return (
        <div className={`${isOpen?"":"hide"}flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-black/50`}>
            <div className="relative p-4 w-full max-w-md max-h-full animate__animated animate__fadeIn">
                <div className="relative bg-gray-100 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <div className='flex flex-col gap-y-1'>
                            <h3 className="text-xl font-semibold text-gray-900">
                                {title}
                            </h3>
                            <p className='text-sm capitalize'>{slotInfo.groupName} - {slotInfo.slotName}</p>
                        </div>
                        
                        <button className='cursor-pointer' onClick={()=>onClose()}>
                            <FaX/>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className='flex flex-col gap-y-4' onSubmit={sendAmount}>
                            <div className='flex flex-col'>
                                <InputTag selector='fullname' flex="flex-col" label="full name" type='text' hasError={hasError.fullname} errorMessage={errorMessage}/>
                                <p className='text-sm text-black/50'>Optional - N/A for no fullname</p>
                            </div>
                            <InputTag selector='amount' flex='flex-col' label="Amount" type='number' hasError={hasError.amount} errorMessage={errorMessage} />
                            <ButtonTag text='Submit' type='submit' disabled={btnIsLoading} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayForm