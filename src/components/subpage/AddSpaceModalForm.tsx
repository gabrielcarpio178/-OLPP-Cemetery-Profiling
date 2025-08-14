import { FaX } from "react-icons/fa6";
import ButtonTag from "../inputData/ButtonTag";
import InputTag from "../inputData/InputTag";
import axios from "axios";
import { useState } from "react";

interface ISlotDeteils {
    isOpen: boolean;
    title: string;
    isClose: () => void;
    isLoading: boolean;
    sendData: (data: {slotId: number, spaceId: number, slot_name: string}) => void;
    selectedSlotId?: number;
    editData?: {spaceId: number, spaceName: string};
}
const SlotDeteils: React.FC<ISlotDeteils> = ({isOpen, title, isClose, isLoading, selectedSlotId, sendData, editData}) => {
    const [errors, setErrors] = useState({slot_name: false})
    const [errorMessage, setErrorMessage] = useState("");
    const [resError, setResError] = useState("");
    const [spaces_name, setSpaceName] = useState(editData?.spaceName??"")
    const sendDataForm = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formValues = {
            spaceId: editData?.spaceId??0,
            slot_name: formData.get("space_name")?.toString() ?? "",
            slotId : selectedSlotId??0
        }
        // how to fixed sendData is error
        const res = await sendData(formValues);
        
        if (axios.isAxiosError(res)){
            
            if(res.status===400){
                const serverErrors = res.response?.data.details[0];
                setErrorMessage(serverErrors.message)
                setErrors({slot_name: serverErrors.path[0] === "space name"})
            }else if(res.status===401) {
                setErrorMessage("")
                setErrors({slot_name: false})
                setResError(res.response?.data.message)
            }else{
                setErrorMessage("")
                setErrors({slot_name: false})
                setResError("")
            }
        }
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
                            <button className='cursor-pointer' onClick={isClose}>
                                <FaX/>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className='flex flex-col gap-y-4' onSubmit={sendDataForm}>
                                <InputTag selector='space_name' flex="flex-col" label="Space Name" type='text' hasError={errors.slot_name} errorMessage={errorMessage} valueData={spaces_name}  onChange={e=>setSpaceName(e.target.value)} />
                                {errors.slot_name&&<div className="mt-2 text-sm text-red-600 dark:text-red-500 capitalize">{resError}</div>}
                                <ButtonTag text='Submit' type='submit' disabled={isLoading}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SlotDeteils;