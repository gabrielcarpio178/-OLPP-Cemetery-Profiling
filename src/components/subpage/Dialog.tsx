import React from 'react'
import { IconContext } from 'react-icons'
import { IoIosWarning } from 'react-icons/io'
import 'animate.css'
import ButtonTag from '../inputData/ButtonTag';

interface DialogData {
    id: number,
    isOPen: boolean,
    setAction: (data: { isDelete: boolean, id: number }) => void;
    title: string;
    isLoading?: boolean
}

const Dialog: React.FC<DialogData> = ({id, isOPen, setAction=()=>{}, title, isLoading=false}) => {

    const actionBtn = (isDeleteAction: boolean)=>{
        setAction({isDelete: isDeleteAction, id: id})
    }

    return (
        <div className={`${!isOPen?"hidden":""} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full flex bg-black/50`}>
            <div className="relative p-4 w-full max-w-md max-h-full animate__animated animate__fadeIn">
                <div className="relative bg-white rounded-lg shadow-sm">
                    <div className="p-4 md:p-5 text-center">
                        <div className='w-full flex justify-center'>
                            <IconContext.Provider value={{ color: "black", size: `4.5em` }}>
                                <IoIosWarning />
                            </IconContext.Provider>
                            
                        </div>
                        <h3 className="my-5 text-lg font-normal text-black">{title}</h3>
                        <div className='flex flex-row gap-x-4 px-10'>
                            <ButtonTag type="button" color="bg-red-600 hover:bg-red-800" onClick={()=>actionBtn(true)} text="Yes, I'm sure" disabled={isLoading} />
                            <ButtonTag type="button" color="bg-blue-700 hover:bg-blue-800" onClick={()=>actionBtn(false)} text="No, cancel" />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dialog
