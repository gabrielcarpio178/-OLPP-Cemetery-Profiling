import axios from "axios"
import UserData from "../../UserData"
import { useEffect, useState } from "react"
import PaymentSlotCard from "./PaymentSlotCard"
import InputTag from "../inputData/InputTag"

type SlotItem = {
    record_id: number|null,
    slot_id: number,
    group_id: number,
    slot_name: string,
    group_name: string,
    firstname: string|null,
    lastname: string|null,
    middlename: string|null,
    suffix: string|null
}

type GroupedItem = {
    group_id: number;
    group_name: string;
    slots: {
        record_id: number|null,
        slot_id: number;
        slot_name: string;
        firstname: string | null;
        lastname: string|null,
        middlename: string|null,
        suffix: string|null
    }[];
};

const Records = () => {
    
    const API_LINK = `${import.meta.env.VITE_APP_API_LNK}/auth`
    const token = UserData().token

    //datas
    const [allData, getAllData] = useState<GroupedItem[]>([])
    const [searchDatas, getAllSearchData] = useState<SlotItem[]>([])

    //interaction
    const [search, setSearch] = useState("")


    const getSlotAll = async ()=>{
        try {

            const res = await axios.get(`${API_LINK}/getAllSlot`,{
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`
                }
            })
            getAllSearchData(res.data)
            searchContent(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getSearch = (searchText: string):void=>{
        setSearch(searchText)
        if (searchText.length === 0) {
            getSlotAll()
        };
        const searchRes = searchDatas.filter((data: SlotItem)=>{
            return (
                data.firstname?.toLocaleUpperCase().includes(searchText.toLocaleUpperCase())
            )
        })
        searchContent(searchRes)
    }

    const searchContent = (data: SlotItem[]): void => {
        const grouped: GroupedItem[] = [];
        data.forEach((item: SlotItem) => {
            const existingGroup = grouped.find(g => g.group_id === item.group_id);

            const slot = {
                record_id : item.record_id!==undefined?item.record_id:null,
                slot_id: item.slot_id,
                slot_name: item.slot_name,
                firstname: item.firstname,
                lastname: item.lastname,
                middlename: item.middlename,
                suffix: item.suffix
            };

            if (existingGroup) {
                existingGroup.slots.push(slot);
            } else {
                grouped.push({
                    group_id: item.group_id,
                    group_name: item.group_name,
                    slots: [slot]
                });
            }
        });
        getAllData(grouped);
    }

    useEffect(()=>{
        getSlotAll()
    },[])

    return(
        <> 
        <div className="bg-white shadow rounded-lg mt-3 sm:w-full md:w-1/2 lg:w-1/4 p-3">
            <InputTag label="Search" flex="flex-col" type="text" selector={"search"} valueData={search} onChange={e=>getSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-3 w-full gap-4">
            {allData.map((data: GroupedItem)=>{
                return (
                    <div key={data.group_id} className='bg-white shadow rounded-lg sm:px-3 sm:py-1 uppercase flex flex-row gap-x-3'>
                        <div className="flex flex-col w-full">
                            <div className="font-semibold">
                                Group: {data.group_name}
                            </div>
                            <PaymentSlotCard slots={data.slots} group_name={data.group_name}/>
                        </div>
                    </div>
                )
            })}
        </div>
        
            
        </>
    )
}


export default Records