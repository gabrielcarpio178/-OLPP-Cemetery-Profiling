import { useEffect, useState } from 'react';
import ButtonTag from './inputData/ButtonTag'
import UserAccessModal from './subpage/UserAccessModal';
import Sidebar from './subpage/Sidebar'
import { FaPlus, FaPenToSquare, FaTrash } from 'react-icons/fa6'
import UserData from '../UserData';
import axios from 'axios';
import { AlertSuccess } from './messages/AlertMessage';
import { useNavigate } from 'react-router';
import DataTable from 'react-data-table-component';
import 'animate.css';
import Dialog from './subpage/Dialog';
import InputTag from './inputData/InputTag';

type UsersData = {
    id: number
    firstname: string,
    lastname: string,
    role: string,
    isActive: boolean,
    username: string,
    action: React.HTMLElementType
}

type UserEdit = {
    id: number
    firstname: string,
    lastname: string,
    role: string,
}

export default function UserAccess() {
    const [addOpen, setAddOpen] = useState(false)
    const [editOpen, seteditOpen] = useState(false)
    const [isMessage, setMessage] = useState(false);
    const [usersData, setUsersData] = useState<UsersData[]>([]);
    const [editData, setEditData] = useState<UserEdit>()
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(0)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [editIdData, setEditIdData] = useState(0)
    const [getAllData, setAllData] = useState<UsersData[]>([])
    const [searchText, setSearchText] = useState("")
    const [isLoadingContent, setIsloadingContent] = useState(false)
    const navigate = useNavigate()
    const isOpenAdd = () => {
        setAddOpen(true);
    };
    const isCloseAdd = ()=>{
        setAddOpen(false)
    }

    const isCloseEdit = () =>{
        seteditOpen(false)
    }
    const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`;
    const token = UserData().token
    const user = UserData().user;

    const addUser = async (data: { firstname: string, lastname: string, role: string, username: string, password: string })=>{
        const sendData = {
            firstname: data.firstname,
            lastname: data.lastname,
            role: data.role,
            username: data.username,
            password: data.password,
        }
        try {
           
            await axios.post(`${API_LINK}/addUser`, sendData, {
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            setAddOpen(false)
            setMessage(true)
            setTimeout(() => {
                navigate("/user_access");
            }, 2000);
            getUsersData()
            setSearchText("")
            return;
        } catch (error) {
            return error;
        }
    }

    const editId = async (id: number)=>{
        setEditIdData(id)
        setUpdateLoading(true)
        try {
            const res = await axios.get(`${API_LINK}/getUserEdit/${id}`,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                },
                data: {
                    id: id
                }
            })
            const data = res.data[0];
            setEditData({
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role
            });
            
            setUpdateLoading(false)
            seteditOpen(true);
        } catch (error) {
            return error;
        }

    }


    const editUser = async (data: {id: number, firstname: string, lastname: string, role: string, username: string, password: string})=>{
        const dataSave = {
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            role: data.role
        }
        try {
            await axios.put(`${API_LINK}/updateUserData`, dataSave,  {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
            })
            seteditOpen(false)
            setMessage(true)
            setSearchText("")
            setTimeout(() => {
                navigate("/user_access");
            }, 2000);
            getUsersData()
            return;
        } catch (error) {
            return error
        }
    }

    const delelteId = async (id: number)=>{
        setDeleteId(id)
        setDialogOpen(true)
    }

    const getAction = async (data: {isDelete: boolean, id: number})=>{
        const {isDelete, id} = data
        if(isDelete){
            setDeleteLoading(true)
            try {
                const res = await axios.delete(`${API_LINK}/deleteUser`,{
                    headers:{
                            'Content-type':'application/x-www-form-urlencoded',
                            "authorization" : `bearer ${token}`,
                        },
                        data: {
                            id: id
                        }}
                    )
                if(res.status===200){
                    setAddOpen(false)
                    setMessage(true)
                    setSearchText("")
                    setTimeout(() => {
                        navigate("/user_access");
                    }, 2000);
                    getUsersData()
                }
            } catch (error) {
                console.log(error)
            }
            setDeleteLoading(false)
        }
        setDialogOpen(false)
    }

    const getUsersData = async () => {
        setIsloadingContent(true)
        try {
            const res = await axios.get(`${API_LINK}/getUserAccess/${user.id}` ,{
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            const users = res.data.map((user: UsersData)=>{
                return {
                    id: user?.id,
                    "NAME": `${user?.firstname} ${ user?.lastname}`,
                    "ROLE": user?.role,
                    "ACTIVE": user?.isActive?"Online":"Offline",
                    "USERNAME": user?.username,
                    "ACTION": <div className='flex flex-row gap-x-2 p-2'><ButtonTag icon={FaPenToSquare} onClick={()=>editId(user?.id)} color='bg-blue-500 hover:bg-blue-600'/><ButtonTag icon={FaTrash} color='bg-red-500 hover:bg-red-600' onClick={()=>delelteId(user?.id)} /></div>
                }
            })
            setAllData(users)
            setUsersData(users)
            setIsloadingContent(false)
        } catch (error) {
            console.log(error)
        }
    }

    const temp_columns = [
        {name: "NAME", selector: (row: any) => row.NAME, sortable: true },
        {name: "USERNAME", selector: (row: any) => row.USERNAME, sortable: true },
        {name: "ROLE", selector: (row: any) => row.ROLE },
        {name: "ACTIVE", selector: (row: any) => row.ACTIVE },

    ]
    const actionColumn = {
        name: "ACTION",
        selector: (row: any) => row.ACTION,
        width: "150px"
    };

    const columns = user.role==="admin" ? [...temp_columns, actionColumn] : temp_columns;

    const searchData = (searchInfo: string) => {
        setSearchText(searchInfo)
        const searchResult = getAllData.filter((data:any)=>{
            return (data["NAME"].toLocaleLowerCase().includes(searchInfo.toLocaleLowerCase())||data["USERNAME"].toLocaleLowerCase().includes(searchInfo.toLocaleLowerCase())||data["ROLE"].toLocaleLowerCase().includes(searchInfo.toLocaleLowerCase()))
        })
        setUsersData(searchResult)
    }

    useEffect(()=>{
        getUsersData()
    },[])

    useEffect(() => {
        getUsersData()
        if (isMessage) {
            const timer = setTimeout(() => {
                setMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isMessage]);
    return (
            <>
                <Sidebar/>
                {isMessage&&
                    <AlertSuccess isOpen={isMessage} message="Successfully"/>
                }
                {isDialogOpen&&
                    <Dialog id={deleteId} isOPen={isDialogOpen} setAction={getAction} title="Are you sure you want to delete this user?" isLoading={deleteLoading}/>
                }
                {addOpen&&
                    <UserAccessModal roleContent="add" title="Add User Access" isOpen={addOpen} getDataInput={addUser} onClose={isCloseAdd}/>
                }
                {editOpen&&
                    <UserAccessModal roleContent="edit" title="Edit User Access" isOpen={editOpen} getDataInput={editUser} onClose={isCloseEdit} editId={editIdData} editData={editData} isLoadingUpdate={updateLoading}/>
                }
                {isLoadingContent&&
                    <div className='text-2xl'>Loading...</div>
                }
                {!isLoadingContent&&
                    <div className="pt-28 px-5 sm:mt-0 sm:pt-20 sm:ml-64 capitalize animate__animated animate__fadeIn min-h-screen bg-gray-100">
                        <h1 className='font-bold text-2xl'>
                            user access
                        </h1>
                        <div className='mt-8'>
                            {user.role==="admin"&&
                                <div className="flex flex-row justify-end">
                                    <div className="w-[10%]">
                                        <ButtonTag text='Add' icon={FaPlus} onClick={isOpenAdd}/>
                                    </div>
                                </div>
                            }
                            <div className='mt-6 bg-white w-full'>
                                <div className='w-[40%] ml-5'>
                                    <InputTag selector='search' label='Search' type='text' flex='flex-row items-center gap-x-2' valueData={searchText} onChange={e=>searchData(e.target.value)} />
                                </div>
                                <DataTable columns={columns} data={usersData} pagination paginationPerPage={7} responsive paginationRowsPerPageOptions={[1,2,3,4,5,6,7]}></DataTable>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
}

