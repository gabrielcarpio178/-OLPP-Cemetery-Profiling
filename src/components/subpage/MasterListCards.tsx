import React, { version } from 'react'
import ButtonTag from '../inputData/ButtonTag'
import { FaPenToSquare, FaTrash, FaCreditCard } from 'react-icons/fa6'
import axios from 'axios'
import UserData from '../../UserData'
import { useNavigate } from 'react-router'

type TdeleteRecords = {
    id: number,
    image_name: string
}

type TeditData = {
    id: number,
    image_name: Blob,
    firstname: string,
    lastname: string,
    slot_id: number,
    group_id: number,
    born: string,
    died: string,
    suffix: string,
    middlename: string,
    group_name: string,
    slot_name: string,
    file_name: string
}

interface Irecords {
    id: number,
    firstname: string,
    lastname: string,
    group_name: string,
    image_name: string,
    middlename: string,
    slot_name: string,
    suffix: string,
    slot_id: number,
    group_id: number
    born: string,
    died: string
    deleteRecord: (data: TdeleteRecords)=>void
    editRecord: (data: TeditData)=>void
}

const MasterListCards: React.FC<Irecords> = ({id, firstname, lastname, group_name, image_name, middlename, slot_name, slot_id, group_id, suffix, born, died, deleteRecord=()=>{}, editRecord=()=>{}}) => {
    const API_LINK = import.meta.env.VITE_APP_API_LNK
    // const token = UserData().token
    const navigate = useNavigate();
    
    // async function convertImg(image: string): Promise<Blob>{
    //     const res = await axios.get(`${API_LINK}/auth/uploads/${image}`, {
    //         headers: { 
    //             'Content-Type': 'application/json',
    //             "authorization" : `bearer ${token}`
    //         },
    //         responseType: 'blob',
    //     });
    //     const blob = res.data;
    //     return blob
    // }


    const cloudStorage = import.meta.env.VITE_APP_API_IMAGE
    const CLOUD_VERSION = import.meta.env.VITE_APP_API_CLOUD_VERSION

    async function convertImg(image: string): Promise<Blob> {
        const url = `https://res.cloudinary.com/${cloudStorage}/image/upload/${CLOUD_VERSION}/uploads/${image}`;

        const res = await axios.get(url, {
            responseType: 'blob',
        });

        return res.data;
    }
    const handleEdit = async () => {
        const imageBlob = await convertImg(image_name); 
        editRecord({
            id, firstname, lastname, group_id, image_name: imageBlob, middlename, slot_id, suffix, born, died, group_name, slot_name, file_name: image_name
        });
    }

    return (
        <>
            <div className="max-w-full rounded overflow-hidden shadow-lg">
                <img className="w-full" src={`https://res.cloudinary.com/${cloudStorage}/image/upload/${CLOUD_VERSION}/uploads/${image_name}`} alt={`${firstname} ${middlename}. ${lastname} ${suffix!=="N/A"?`${suffix}.`:""}`} />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{firstname} {middlename}. {lastname} <span className='capitalize'>{suffix!=="N/A"?`${suffix}.`:""}</span></div>
                    <div className="text-gray-700 text-base flex flex-col gap-y-1">
                        <div className='capitalize'>group name: {group_name}</div>
                        <div className='capitalize'>slot name: {slot_name}</div>
                    </div>
                </div>
                <div className="px-6 pb-4 flex flex-row gap-x-2">
                    <ButtonTag icon={FaCreditCard} onClick={()=>navigate(`/payment/records?slotId=${slot_id}&slotName=${slot_name}&groupName=${group_name}`)} />
                    <ButtonTag icon={FaPenToSquare} onClick={handleEdit} color='bg-blue-500 hover:bg-blue-600'/>
                    <ButtonTag icon={FaTrash} onClick={()=>deleteRecord({id, image_name})} color='bg-red-500 hover:bg-red-600'/>
                </div>
            </div>
        
        </>
    )
}

export default MasterListCards
