import React from 'react'
import { FaPenToSquare, FaTrash, FaX } from 'react-icons/fa6'
import ButtonTag from '../inputData/ButtonTag';

type TSlotData = {
    id: number,
    slot_name: string;
    spaces: {space: string|null, space_id: number| null}[];
}

type TgetSpaceData = {
    spaceId: number
    spaceName: string
   
}

interface ISlotDeteils {
    isOpen: boolean
    title: string
    closeModal: ()=>void;
    getSlotData: TSlotData[];
    isOpenModal: () => void;
    isOpenModalSpace: (data: {id: number}) => void;
    isLoadingDetiels: boolean;
    isOpenDialog: (data: {id: number}) => void;
    getEditData?: (data: {id: number, slot_name: string}) => void
    sendDataEdit: (data: TgetSpaceData) => void
    sendDataDelete: (data: {spaceId: number}) => void
}

const SlotDeteils: React.FC<ISlotDeteils> = ({isOpen, isLoadingDetiels, title, getSlotData ,closeModal, isOpenModal, isOpenModalSpace, sendDataEdit=()=>{}, sendDataDelete=()=>{}, getEditData=()=>{}, isOpenDialog=()=>{}}) => {
    return (
        <>
            <div className={`${isOpen?"":"hidden"} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-black/50`}>
                <div className="relative p-4 animate__animated animate__fadeIn">
                    <div className="relative bg-gray-100 rounded-lg shadow-lg p-2">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {isLoadingDetiels?"Loading...":`${title}`}
                            </h3>
                            <button className='cursor-pointer' onClick={closeModal}>
                                <FaX/>
                            </button>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                        {getSlotData.map((slotData)=>{
                            return (
                                <div className='flex flex-row gap-x-4 items-center' key={slotData.id}>
                                    <div className='bg-white py-3 px-2 shadow rounded-lg sm:px-5 capitalize hover:bg-gray-200 flex flex-row items-center justify-center'>
                                        <div className={`flex flex-col items-center gap-y-2`}>
                                        <div className='text-gray-900 font-bold'>{slotData.slot_name}</div>
                                        <div className={`flex flex-row gap-x-2`}>
                                            <ButtonTag icon={FaPenToSquare} color='bg-blue-500 hover:bg-blue-600' onClick={()=>getEditData({id:slotData.id, slot_name: slotData.slot_name})} />
                                            <ButtonTag icon={FaTrash} color='bg-red-500 hover:bg-red-600' onClick={()=>isOpenDialog({id: slotData.id})}/>
                                        </div>
                                        </div>
                                    </div>
                                    <div className='flex gap-4 md:flex-nowrap sm:flex-wrap lg:flex-nowrap'>
                                        {slotData.spaces.map((space)=>{
                                            return (
                                                <div key={space.space_id} className='bg-white py-3 px-2 shadow rounded-lg sm:px-5 capitalize hover:bg-gray-200 flex flex-row items-center justify-center'>
                                                    <div className={`flex flex-col items-center gap-y-2 ${space.space!=null?'':'w-24'}`}>
                                                        <div className='text-gray-900'>{space.space!=null?space.space:'No Added Space'}</div>
                                                        <div className={`flex flex-row gap-x-2 ${space.space!=null?'':'hidden'}`}>
                                                            <ButtonTag icon={FaPenToSquare} onClick={()=>sendDataEdit({spaceId: space.space_id??0, spaceName: space.space??''})}  color='bg-blue-500 hover:bg-blue-600' />
                                                            <ButtonTag icon={FaTrash} onClick={()=>sendDataDelete({spaceId: space.space_id??0})} color='bg-red-500 hover:bg-red-600' />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <ButtonTag text='Add Space' onClick={()=>isOpenModalSpace({id: slotData.id})}/>
                                </div>
                            )
                        })}
                        <div className='mt-2'>
                            <ButtonTag text='Add Slot' onClick={isOpenModal} />
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>            
        </>
    )
}

export default SlotDeteils