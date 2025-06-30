import React from 'react'
import ButtonTag from '../inputData/ButtonTag'
import { FaPenToSquare, FaTrash } from 'react-icons/fa6'

type GetData = {
    group_name: string,
    id: number
    count_slot_name: number
}

interface TypeContent {
    showDelete: (data: {id: number})=>void
    getData: GetData
    sendData: (data: GetData) => void
    deteils: (data: {id: number})=>void
}

const GroupsCards:React.FC<TypeContent> = ({showDelete=()=>{}, getData, sendData=()=>{}, deteils=()=>{}}) => {

    return (
        <>
            <div className='w-full bg-white py-3 px-2 shadow rounded-lg sm:px-5 uppercase hover:bg-gray-200 flex flex-row gap-x-3'>
                <div className='w-3/4'>
                    <div className='font-semibold'>
                        Group: <span className='ml-2'> {getData.group_name}</span>
                    </div>
                    <div className='font-semibold'>
                        Slot #: <span className='ml-2'> {getData.count_slot_name}</span>
                    </div>
                    <button className='bg-blue-700 cursor-pointer text-white w-full rounded hover:bg-[#001656]' onClick={()=>deteils({id: getData.id})}>Slots</button>
                </div>
                <div className='flex flex-col w-1/4 gap-y-2'>
                    <ButtonTag icon={FaPenToSquare} onClick={()=>sendData(getData)} color='bg-blue-500 hover:bg-blue-600' />
                    <ButtonTag icon={FaTrash} color='bg-red-500 hover:bg-red-600' onClick={()=>showDelete({id: getData.id})} />
                    
                </div>
            </div>
        </>
    )
}

export default GroupsCards