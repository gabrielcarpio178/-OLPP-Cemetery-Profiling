import React from 'react'
import { FaPenToSquare, FaTrash, FaX } from 'react-icons/fa6'
import ButtonTag from '../inputData/ButtonTag';
import DataTable from 'react-data-table-component';
type TSlotData = {
    id: number,
    slot_name: string;
}

interface ISlotDeteils {
    isOpen: boolean
    title: string
    closeModal: ()=>void;
    getSlotData: TSlotData[];
    isOpenModal: () => void;
    isLoadingDetiels: boolean;
    isOpenDialog: (data: {id: number}) => void;
    getEditData?: (data: {id: number, slot_name: string, group_id: number}) => void
}

const SlotDeteils: React.FC<ISlotDeteils> = ({isOpen, title, closeModal, getSlotData, isOpenModal, isLoadingDetiels, isOpenDialog=()=>{}, getEditData=()=>{}}) => {

    const columns = [
        {name: "Slot name",  selector: (row: any) => row["Slot name"], sortable: true},
        {name: "Member Number", selector: (row: any) => row["Member Number"], sortable: true, width: "150px"},
        {name: "Action", selector: (row: any) => row["Action"], sortable: true, width: "150px"}
    ]

    const datas = getSlotData.map((data: any)=>{
        return ({
            "Slot name": <div className='capitalize'>{data.slot_name}</div>,
            "Member Number": data.record_count,
            "Action": <div className='flex flex-row gap-x-2 p-2'><ButtonTag icon={FaPenToSquare} color='bg-blue-500 hover:bg-blue-600' onClick={()=>getEditData(data)} /><ButtonTag onClick={()=>isOpenDialog({id: data.id})} icon={FaTrash} color='bg-red-500 hover:bg-red-600'/></div>
        })
    })
    
    return (
        <>
            <div className={`${isOpen?"":"hidden"} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-black/50`}>
                <div className="relative p-4 w-full max-w-md max-h-full animate__animated animate__fadeIn">
                    <div className="relative bg-gray-100 rounded-lg shadow-lg p-2">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {isLoadingDetiels?"Loading...":title}
                            </h3>
                            <button className='cursor-pointer' onClick={closeModal}>
                                <FaX/>
                            </button>
                        </div>
                        {getSlotData.length === 0 &&
                            <div className='flex items-center'>
                                No Added Slot
                            </div>
                        }
                        {getSlotData.length !== 0 &&
                            <DataTable className='my-3' columns={columns} data={datas} />
                        }
                        <ButtonTag text='Add Slot' onClick={isOpenModal}/>
                    </div>
                </div>
            </div>            
        </>
    )
}

export default SlotDeteils