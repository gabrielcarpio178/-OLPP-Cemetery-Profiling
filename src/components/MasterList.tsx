import { FaPlus } from 'react-icons/fa6'
import ButtonTag from './inputData/ButtonTag'
import Sidebar from './subpage/Sidebar'
import 'animate.css'
import MasterListModal from './subpage/MasterListModal'
import { useEffect, useState } from 'react'
import UserData from '../UserData'
import axios from 'axios';
import { AlertSuccess } from './messages/AlertMessage'
import { useNavigate } from 'react-router'
import MasterListCards from './subpage/MasterListCards'
import Dialog from './subpage/Dialog'
import InputTag from './inputData/InputTag'

type Tgroup = {
    id: number,
    group_name: string
}


type Tslot = {
    slot_name: string,
    id: number,
    group_id: number
}

type Tspace = {
    space_name: string,
    space_id : number;
    slot_id: number
}

type PersonForm = {
    id: number;
    firstName?: string;
    lastName?: string;
    suffix?: string,
    middleName?:string
    died?: string,
    born?: string
};


type TgetData = {
    id: number,
    notImage: boolean,
    image: File|null,
    slot_id: number|null,
    space_id: number|null,
    group_id: number|null,
    file_name: string|null
    personForms: PersonForm[]
}

type TsendData = {
    id: number,
    image_name: File,
    firstname: string,
    lastname: string,
    slot_id: number,
    group_id: number,
    space_id: number,
    born: string,
    died: string,
    suffix: string,
    middlename: string,
    group_name: string,
    slot_name: string,
    file_name: string
}

type TgetRecords = {
    id: number,
    firstname: string,
    lastname: string,
    group_name: string,
    image_name: string,
    middlename: string,
    slot_name: string,
    space_id: number,
    space_name: string,
    suffix: string,
    born: string,
    died: string
    slot_id: number,
    group_id: number,
}


type TeditData = {
    id: number,
    image_name: Blob,
    firstname: string,
    lastname: string,
    slot_id: number,
    group_id: number,
    space_id: number,
    born: string,
    died: string,
    suffix: string,
    middlename: string,
    group_name: string,
    slot_name: string,
    file_name: string
}

type TdeleteIds = {
    id: number,
    image_name: string
}

export default function MasterList() {
    const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`;
    const token = UserData().token
    const navigate = useNavigate()

    //interaction hook
    const [isaddOpen, setAddOpen] = useState(false)
    const [isOpenAlert, setIsOpenAlert] = useState(false)
    const [onProgressImage, setOnProgress] = useState(0)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [isLoadingContent, setIsloadingContent] = useState(false)
    
    //selected ids
    const [deleteIds, setDeleteIds] = useState<TdeleteIds>({id: 0, image_name: ""})
    
    //get group and slot hook
    const [groups, setGroups] = useState<Tgroup[]>([])
    const [slots, setSlots] = useState<Tslot[]>([])
    const [spaces, setSpaces] = useState<Tspace[]>([])
    const [records, setRecords] = useState<TgetRecords[]>([])
    const [fullrecords, setFullRecords] = useState<TgetRecords[]>([])
    const [editData, seteditData] = useState<TeditData>()
    
    const openAddModal = () =>{
        setAddOpen(true)
    }

    const closeAddModal = () =>{
        setAddOpen(false)
        setEditModalOpen(false)
    }

    const getGroupData = async () =>{
        try {
            
            const res = await axios.get(`${API_LINK}/getGroups`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            getSlot();
            setGroups(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getSlot = async () =>{

        try {
            const res = await axios.get(`${API_LINK}/getSlot`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            setSlots(res.data)
            getSpace();
        } catch (error) {
            console.log(error)
        }
    }

    const getSpace = async () =>{
        try {
            const res = await axios.get(`${API_LINK}/getSpace`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            setSpaces(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getRecords = async () =>{
        setSearch("")
        setIsloadingContent(true)
        try {
            const res = await axios.get(`${API_LINK}/getRecords`,{
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            setRecords(res.data)
            setFullRecords(res.data)
            setIsloadingContent(false)
        } catch (error) {
            console.log(error)
        }
    }

    const getData = async (data: TgetData) =>{
        console.log(data)
        // setOnProgress(0)
        // const sendData = {
        //     image: data.image,
        //     slot_id: data.slot_id,
        //     group_id: data.group_id,
        //     space_id: data.space_id,
        //     firstname: data.firstname,
        //     lastname: data.lastname,
        //     suffix: data.suffix,
        //     middlename: data.middlename,
        //     born: data.born,
        //     died: data.died
        // }
        // if(!data.notImage){
        //     try {
        //         const res = await axios.post(`${API_LINK}/addRecords`, sendData, {
        //             headers: {
        //                 'Content-type':'multipart/form-data',
        //                 "authorization" : `bearer ${token}`
        //             },
        //             onUploadProgress: (progressEvent) => {
        //                 const { loaded, total } = progressEvent;
        //                 if (total !== undefined) {
        //                     const percentCompleted = Math.round((loaded * 100) / total);
        //                     setOnProgress(percentCompleted)
        //                 }
        //             }
        //         })
        //         if(res.status===200){
        //             setAddOpen(false)
        //             setIsOpenAlert(true)
        //             setTimeout(() => {
        //                 navigate("/master_list");
        //             }, 2000);
        //         }
        //     } catch (error) {
        //         return error
        //     }
        //     getRecords()
        // }
    }

    const deleteRecord = (data: TdeleteIds) =>{
        setDeleteDialog(true)
        setDeleteIds(data)
    }

    const deleteGetAction = async (data: {id: number, isDelete: boolean})=>{
        const {isDelete} = data
        if(!isDelete){
            setDeleteDialog(false)
            return;
        }
        setDeleteLoading(true)
        try {
            const res = await axios.delete(`${API_LINK}/deleteRecord`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                },
                data: deleteIds
            })

            if(res.status===200){
                setDeleteDialog(false)
                setIsOpenAlert(true)
                setDeleteLoading(false)
                setTimeout(() => {
                    navigate("/master_list");
                }, 2000);
            }
        } catch (error) {
            console.log(error)
        }
        getRecords()
    }

    function blobToFile(blob: Blob, filename: string): File {
        return new File([blob], filename, { type: blob.type });
    }

    const geteditData = (data: TeditData) =>{
        const image = blobToFile(data.image_name, data.file_name);
        setEditModalOpen(true)
        const sendeditData: TsendData = {
            id: data.id,
            image_name: image,
            firstname: data.firstname,
            lastname: data.lastname,
            slot_id: data.slot_id,
            group_id: data.group_id,
            space_id: data.space_id,
            born: data.born,
            died: data.died,
            suffix: data.suffix,
            middlename: data.middlename,
            group_name: data.group_name,
            slot_name: data.slot_name,
            file_name: data.file_name
        }
        seteditData(sendeditData)
    }

    const getEdit = async (data: TgetData) =>{
        const sendData = {
            id: data.id,
            image: data.image,
            slot_id: data.slot_id,
            group_id: data.group_id,
            space_id: data.space_id,
            file_name: data.file_name
        }
        if(!data.notImage){
            try {
                const res = await axios.put(`${API_LINK}/editRecords`, sendData, {
                    headers: {
                        'Content-type':'multipart/form-data',
                        "authorization" : `bearer ${token}`
                    },
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        if (total !== undefined) {
                            const percentCompleted = Math.round((loaded * 100) / total);
                            setOnProgress(percentCompleted)
                        }
                    }
                })
                if(res.status===200){
                    setEditModalOpen(false)
                    setAddOpen(false)
                    setIsOpenAlert(true)
                    setTimeout(() => {
                        navigate("/master_list");
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
            getRecords()
        }
        
    }

    const searchData = (searchValue: string) =>{
        setSearch(searchValue)
        const resFilter = fullrecords.filter((data: TgetRecords)=>{
            return (
                data.group_name.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase())||
                data.slot_name.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase())||
                data.firstname.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase())||
                data.lastname.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase())||
                data.suffix.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase())
            )
        })
        setRecords(resFilter)
    }

    useEffect(() => {
            if (isOpenAlert) {
                const timer = setTimeout(() => {
                    setIsOpenAlert(false);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }, [isOpenAlert]);

    useEffect(()=>{
        getRecords()
        getGroupData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
            <>
                <Sidebar/>
                {isOpenAlert&&<AlertSuccess isOpen={isOpenAlert} message="Successfully"/>}
                {deleteDialog&&<Dialog id={deleteIds?.id} isOPen={deleteDialog} setAction={deleteGetAction} title={'Are you sure you want to delete this record?'} isLoading={deleteLoading} />}
                
                {isaddOpen&&<MasterListModal spaces={spaces} onProgressImage={onProgressImage} groups={groups} slots={slots} isOpen={isaddOpen} title='Add Records' closeModal={closeAddModal} sendData={getData}/>}
                
                {editModalOpen&&<MasterListModal spaces={spaces} onProgressImage={onProgressImage} groups={groups} slots={slots} isOpen={editModalOpen} title='Edit Records' closeModal={closeAddModal} sendData={getEdit} editData={editData as TsendData}/>} 
                {isLoadingContent&&
                    <div className="pt-28 px-5 sm:mt-0 sm:pt-20 sm:ml-64 capitalize min-h-screen bg-gray-100">
                        <p className='text-2xl'>Loading</p>
                    </div>
                }
                {!isLoadingContent&&
                    <div className="pt-28 px-5 sm:mt-0 sm:pt-20 sm:ml-64 capitalize animate__animated animate__fadeIn min-h-screen bg-gray-100">
                        <h1 className='font-bold text-2xl'>
                            Master List
                        </h1>
                        
                        <div className="flex flex-row justify-end mb-2">
                            <div className="w-[10%]">
                                <ButtonTag text='Add' icon={FaPlus} onClick={openAddModal}/>
                            </div>
                        </div>

                        <div className='w-full sm:w-3/4 md:w-1/2 lg:w-1/4 bg-white py-3 px-2 shadow rounded-lg sm:px-5'>
                            <InputTag label='Search' type='text' flex='flex-col' selector={'search'} valueData={search} onChange={e=>searchData(e.target.value)}/>
                        </div>

                        <div className='grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {records.map((data: TgetRecords) => {
                                return(
                                    <div key={data.id}>
                                        <MasterListCards born={data.born} died={data.died} id={data.id} deleteRecord={deleteRecord} firstname={data.firstname} lastname={data.lastname} group_name={data.group_name} image_name={data.image_name} middlename={data.middlename} slot_name={data.slot_name} suffix={data.suffix} slot_id={data.slot_id} group_id={data.group_id} space_name={data.space_name} space_id={data.space_id} editRecord={geteditData}/>
                                    </div>
                                )})}
                        </div>
                    </div>
                }
                
            </>
        )
}
