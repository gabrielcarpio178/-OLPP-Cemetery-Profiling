import axios from "axios"
import UserData from "../../UserData"
import { useEffect, useState, type JSX } from "react"
import { TbCurrencyPeso } from "react-icons/tb";
import moment from "moment";
import DataTable from "react-data-table-component";
import InputTag from "../inputData/InputTag";

type TgetPaymentByGroup = {
    id: number,
    slot_id: number|null,
    slot_name: string|null,
    group_name: string,
    total_amount: number|null,
    paymentDate: Date| null
}

type TresDatasTable = {
    amount: number
    fullname: string
    group_name: string
    id: number
    paymentDate: string
    slot_id: number 
    slot_name: string
}


type Tcolumn = {
    "FULLNAME": string,
    "GROUP NAME": string
    "SLOT NAME": string
    "AMOUNT": JSX.Element,
    "DATE": string
}

const History = () => {

    //data content
    const [paymentByGroup, setPaymentByGroup] = useState<TgetPaymentByGroup[]>([]);
    const [allPaymentByGroup, setAllPaymentByGroup] = useState<TresDatasTable[]>([]);
    const [datasTable, setDatasTable] = useState<Tcolumn[]>([]);

    //interaction
    const [search, setSearch] = useState<string>("")

    const API_LINK = import.meta.env.VITE_APP_API_LNK+"/auth"
    const token = UserData().token
    
    const getPaymentByGroup = async (): Promise<void> => {

        try {
            const res = await axios.get(`${API_LINK}/getPaymenByGroup`,{
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            setPaymentByGroup(res.data)
            getpaymentHistory()
        }catch(error) {
            console.log(error)
        }

    }

    function formatDate(isoString: string): string {
        return moment(isoString).format('MMMM DD YYYY');
    }

    const getpaymentHistory = async (): Promise<void> =>{

        try {
            const res = await axios.get(`${API_LINK}/getpaymentHistory`,{
                headers: {
                    'Content-type':'application/x-www-form-urlencoded',
                    "authorization" : `bearer ${token}`,
                }
            })
            setAllPaymentByGroup(res.data)
            getDataTable(res.data)
        }catch(error) {
            console.log(error)
        }

    }

    const searchData = (searchText: string)=>{
        setSearch(searchText)
        const filterData: TresDatasTable[] = allPaymentByGroup.filter(data=>{
            return (
                data.fullname.toLocaleUpperCase().includes(searchText.toLocaleUpperCase())||
                data.group_name.toLocaleUpperCase().includes(searchText.toLocaleUpperCase())||
                data.slot_name.toLocaleUpperCase().includes(searchText.toLocaleUpperCase())||
                formatDate(data.paymentDate).toLocaleUpperCase().includes(searchText.toLocaleUpperCase())
            )
        })
        console.log(filterData)
        const dispayData: Tcolumn[] = filterData.map((data: TresDatasTable)=>{
            return (
                {
                    "FULLNAME": data.fullname,
                    "GROUP NAME": data.group_name,
                    "SLOT NAME": data.slot_name,
                    "AMOUNT": <div className="flex flex-row items-center"><div><TbCurrencyPeso/></div><p>{data.amount}</p></div>,
                    "DATE": formatDate(data.paymentDate)
                }
            )
        })
        setDatasTable(dispayData)
    }

    const getDataTable = (results: TresDatasTable[])=>{
        
        const datas: Tcolumn[]  = results.map((data: TresDatasTable)=>{
            return (
                {
                    "FULLNAME": data.fullname,
                    "GROUP NAME": data.group_name,
                    "SLOT NAME": data.slot_name,
                    "AMOUNT": <div className="flex flex-row items-center"><div><TbCurrencyPeso/></div><p>{data.amount}</p></div>,
                    "DATE": formatDate(data.paymentDate)
                }
            )
        })  
        setDatasTable(datas)
    }

    const column = [
        {name: "FULLNAME", selector: (row: any) => row["FULLNAME"], sortable: true },
        {name: "GROUP NAME", selector: (row: any) => row["GROUP NAME"], sortable: true },
        {name: "SLOT NAME", selector: (row: any) => row["SLOT NAME"], sortable: true },
        {name: "AMOUNT", selector: (row: any) => row["AMOUNT"], sortable: true },
        {name: "DATE", selector: (row: any) => row["DATE"], sortable: true },
    ]

    useEffect(()=>{
        getPaymentByGroup()
    }, [])

    return (
        <>
            <div className="animate__animated animate__fadeIn">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] mt-3 w-full gap-4">
                    {paymentByGroup.map((data: TgetPaymentByGroup)=>{
                        return (
                            <div key={data.id} className="bg-white shadow rounded-lg flex flex-col items-center py-2">
                                <h3 className="font-bold text-lg">{data.group_name}</h3>
                                <div className="flex flex-row items-center">
                                    <div><TbCurrencyPeso/></div>
                                    <p>{data.total_amount===null?0:data.total_amount}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex flex-col gap-y-2 mt-3">
                    <div className="mt-3 bg-white shadow rounded-lg p-2 sm:w-full md:w-1/2 lg:w-1/4">
                        <InputTag label="Search" flex="flex-col" type="text" selector={"search"} valueData={search} onChange={e=>searchData(e.target.value)}/>
                    </div>
                    <DataTable columns={column} data={datasTable} pagination paginationPerPage={5} responsive paginationRowsPerPageOptions={[1,2,3,4,5,6,7,8]} />
                </div>
            </div>
        </>
    )
}


export default History