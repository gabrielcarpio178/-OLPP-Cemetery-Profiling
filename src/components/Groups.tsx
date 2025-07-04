import { FaPlus } from 'react-icons/fa6'
import ButtonTag from './inputData/ButtonTag'
import Sidebar from './subpage/Sidebar'
import 'animate.css'
import GroupsCards from './subpage/GroupsCards'
import axios from 'axios'
import UserData from '../UserData'
import { useEffect, useState } from 'react'
import InputTag from './inputData/InputTag'
import GroupModal from './subpage/GroupModal'
import { AlertSuccess } from './messages/AlertMessage'
import { useNavigate } from 'react-router'
import Dialog from './subpage/Dialog'
import SlotDeteils from './subpage/SlotDeteils'
import SlotFormModal from './subpage/SlotFormModal'

type Grouptype = {
    id: number;
    group_name: string;
    count_slot_name: number
}

type TSlotData = {
    id: number;
    slot_name: string;
    record_count: number,
}

type TeditData = {
    id: number,
    slot_name: string
}

export default function Groups() {

    const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`
    const token = UserData().token
    const navigate = useNavigate()
    
    const [openModal, setOpenModal] = useState(false)
    const [isShowMessageSuccess, setIsShowMessageSuccess] = useState(false)
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(0)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenEditModal, setOpenEditModal] = useState(false)
    const [search, setSearch] = useState("")
    const [isOpenDeteils, setIsOpenDeteils] = useState(false)
    const [isOpenSlotModalForm, setOpenSlotModalForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingDetiels, setLoadingDetiels] = useState(false)
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isOpenSlotModalFormEdit, setOpenSlotModalFormEdit] = useState(false)

    const [slotData, setSlotData] = useState<TSlotData[]>([])
    const [groudsData, setGroupData] = useState<Grouptype[]>([])
    const [getAllData, setAllData] = useState<Grouptype[]>([])
    const [editGroupName, setEditGroupName] = useState<Grouptype>()
    const [getEditSlot, setEditSlot] = useState<TeditData>()
    const [group_id, setGroup_id] = useState(0)
    const [deleteSlot_id, setDeleteSlot_id] = useState(0)


    //close add group form
    const closeModal = () =>{
        setOpenModal(false)
        setOpenEditModal(false)
    }

    const slotModal = () => {
        setIsOpenDeteils(false)
        setOpenSlotModalForm(true)
    }

    const slotAddForm = () =>{
        setOpenSlotModalForm(false);
        setIsOpenDeteils(true)
        setOpenSlotModalFormEdit(false)
    }

    const isOpenDeleteDialog = (data: {id: number}) =>{
        const {id} = data
        setDeleteSlot_id(id)
        setDialogOpen(true)
    }

    const clearActionSlot = () =>{
        setIsLoading(false)
        setIsShowMessageSuccess(true)
        openDeteils({id: group_id})
        slotAddForm()
        getGroupData()
        setTimeout(() => {
            navigate("/groups");
        }, 2000);
    } 

      //get the id of group for delete group
    const getDataDelete = (data: {id: number}) => {
        setDeleteOpen(true)
        setDeleteId(data.id)
    }

    const getDataChild = (data: {id: number,  group_name: string, count_slot_name: number}) =>{
        setOpenEditModal(true)
        setEditGroupName(data);
    }

      //search group ny name
    const searchData = (searchInfo: string) => {
        setSearch(searchInfo)
        const searchResult = getAllData.filter((data: any)=>{
            return (
                data.group_name.toLocaleLowerCase().includes(searchInfo.toLocaleLowerCase())
            )
        })
        setGroupData(searchResult)
    }

    const getEditData = async (data: TeditData)=>{
        setEditSlot(data)
        setOpenSlotModalFormEdit(true)
        setIsOpenDeteils(false)
    }


    //get all group data
    const getGroupData = async () => {
        try {
            
            const res = await axios.get(`${API_LINK}/getGroups`, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            setGroupData(res.data)
            setAllData(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    //get slot data by group id
    const openDeteils = async (data: {id: number})=>{
        const {id} = data
        setLoadingDetiels(true)
        try {
            const res = await axios.get(`${API_LINK}/groupSlot/${id}`,{
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            setGroup_id(id)
            setSlotData(res.data)
            setLoadingDetiels(false)
        } catch (error) {
            console.log(error)
        }

        setIsOpenDeteils(true)
    }

    
    const getDataSlot = async (data: {slot_id: number, group_id: number, slot_name: string}) =>{
        setIsLoading(true)
        const sendData = {
            group_id: data.group_id,
            slot_name: data.slot_name
        }
        try {
            const res = await axios.post(`${API_LINK}/addSlot`, sendData, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            if(res.status===200){
                clearActionSlot()
            }
        } catch (error) {
            setIsLoading(false)
            return error;
        }
    }


    // add group func
    const getDataSend = async (data: {group: string, id: number}) => {
        const send = {
            group: data.group
        }
        try {
            const res = await axios.post(`${API_LINK}/addGroup`, send,  {
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            if(res.status===200){
                setIsShowMessageSuccess(true)
                getGroupData()
                setTimeout(() => {
                    navigate("/groups");
                }, 2000);
            }
            setOpenModal(false)
            return;
        } catch (error) {
            return error
        }
        

    }

    //edit the group data
    const getDataEdit = async (data: {id: number, group: string}) =>{
        
        try {
            
            const res = await axios.put(`${API_LINK}/updateGroup`, data, {
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            if(res.status===200){
                setIsShowMessageSuccess(true)
                getGroupData()
                setTimeout(() => {
                    navigate("/groups");
                }, 2000);
            }
            setOpenEditModal(false)
            return;

        } catch (error) {
            return error
        }

    }

    const getEditDataSend =  async (data: {slot_id: number, group_id: number, slot_name: string}) =>{
        try {
            const res = await axios.put(`${API_LINK}/updateSlot`, data, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            if(res.status===200){
                clearActionSlot()
            }
        } catch (error) {
            setIsLoading(false)
            return error
        }
    }

    //delete slot function
    const getActionDeleteSlot = async (data: { isDelete: boolean, id: number })=>{
        const {isDelete, id} = data
        if(isDelete){
            try {
                const res = await axios.delete(`${API_LINK}/deleteSlot`, {
                    headers:{
                            'Content-type':'application/x-www-form-urlencoded',
                            "authorization" : `bearer ${token}`,
                        },
                    data: {id: id}
                    })
                if(res.status===200){
                    setIsShowMessageSuccess(true)
                    openDeteils({id: group_id})
                    getGroupData()
                    setTimeout(() => {
                        navigate("/groups");
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        }
        setDialogOpen(false)
    }

    //delete group func
    const getActionDelete = async (data: { isDelete: boolean, id: number }) => {
        const {isDelete, id} = data
        if(!isDelete){
            setDeleteOpen(false)
        }else{
            setDeleteLoading(true)
            try {
                
                const res = await axios.delete(`${API_LINK}/deleteGroups`, {
                    headers:{
                            'Content-type':'application/x-www-form-urlencoded',
                            "authorization" : `bearer ${token}`,
                        },
                        data: {
                            id: id
                        }
                    })
                if(res.status===200){
                    setDeleteLoading(false)
                    setDeleteOpen(false)
                    setIsShowMessageSuccess(true)
                    getGroupData()
                    setTimeout(() => {
                        navigate("/groups");
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }


    useEffect(()=>{
        getGroupData()
    },[])

    useEffect(() => {
        if (isShowMessageSuccess) {
            const timer = setTimeout(() => {
                setIsShowMessageSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isShowMessageSuccess]);
    
    return (
            <>
                <Sidebar/>

                {openModal&&<GroupModal isOpen={openModal} title="Add Groups" closeModal={closeModal} sendData={getDataSend}/>}
                
                {isOpenEditModal&&<GroupModal isOpen={isOpenEditModal} title="Edit Groups" closeModal={closeModal} sendData={getDataEdit} getData={editGroupName}/>}
                
                {isShowMessageSuccess&&<AlertSuccess isOpen={isShowMessageSuccess} message='Successfully'/>}
                
                {isDeleteOpen&&<Dialog isOPen={isDeleteOpen} title="Are you sure you want to delete this group?" setAction={getActionDelete} id={deleteId} isLoading={deleteLoading} />}
                
                {isOpenDeteils&&<SlotDeteils isOpenDialog={isOpenDeleteDialog} isLoadingDetiels={isLoadingDetiels} isOpenModal={slotModal} isOpen={isOpenDeteils} closeModal={()=>setIsOpenDeteils(false)} title='Slot Details' getSlotData={slotData} getEditData={getEditData}/>}
                
                {isDialogOpen&&<Dialog isOPen={isDialogOpen} title='Are you sure you want to delete this slot?' setAction={getActionDeleteSlot} id={deleteSlot_id} />}

                {isOpenSlotModalForm&&<SlotFormModal isLoading={isLoading} group_id={group_id} isOpen={isOpenSlotModalForm} isClose={slotAddForm} title="Add Slot" sendData={getDataSlot}/>}
                
                {/* edit slot modal */}
                {isOpenSlotModalFormEdit&&<SlotFormModal isLoading={isLoading} group_id={group_id} isOpen={isOpenSlotModalFormEdit} isClose={slotAddForm} title="Edit Slot" sendData={getEditDataSend} getData={getEditSlot}/>}

                <div className="pt-28 px-5 sm:mt-0 sm:pt-20 sm:ml-64 capitalize animate__animated animate__fadeIn min-h-screen bg-gray-100">
                    <h1 className='font-bold text-2xl'>
                        Groups
                    </h1>
                    <div className='mt-8'>
                        <div className="flex flex-row justify-end">
                            <div className="w-[10%]">
                                <ButtonTag text='Add' icon={FaPlus} onClick={()=>setOpenModal(true)}/>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <div className='flex flex-row gap-x-2 '>
                                <InputTag selector='search' type='text' label='search' flex='flex-row items-center gap-x-2 bg-white py-3 px-2 shadow rounded-lg sm:px-5' valueData={search} onChange={e=>searchData(e.target.value)} />
                                <div className='bg-white py-3 px-2 shadow rounded-lg sm:px-5 flex items-center'>
                                    Groups #: <span className='font-bold text-lg ml-2'>{groudsData.length}</span>
                                </div>
                            </div>

                            {groudsData.length===0&&<p className='mt-5'>No Group added</p>}
                            {groudsData.length!==0&&
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
                                    {groudsData.map(data=><div key={data.id}><GroupsCards getData={data} showDelete={getDataDelete} sendData={getDataChild} deteils={openDeteils}/></div>)}
                                </div>
                            }
                            
                        </div>

                    </div>
                </div>
            </>
        )
}
