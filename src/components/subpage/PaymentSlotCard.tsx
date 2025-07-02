import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

type Tslot = {
    record_id: number|null
    firstname: string|null
    lastname: string|null
    middlename: string|null
    slot_id: number
    slot_name: string
    suffix: string|null
}

type Tfullname = {
    name: string|null,
    record_id: number|null
}

type TNameSlot = {
    slot_id: number,
    slot_name: string,
    fullname: Tfullname[]|null,
}


interface Islot {
    group_name: string,
    slots: Tslot[]
}

const PaymentSlotCard: React.FC<Islot> = ({slots, group_name}) => {
    const navigate = useNavigate();
    const [dataSlot, setDataSlot] = useState<TNameSlot[]>([]);
    function getSlot(): void {
        const fullnames = slots.reduce<TNameSlot[]>((acc, slot) => {
            if (slot.record_id !== null) {
                const existing = acc.find(f => f.slot_id === slot.slot_id);
                const fullname: Tfullname = {
                    name: [
                        slot.firstname,
                        slot.middlename ? `${slot.middlename}.` : "",
                        slot.lastname,
                        slot.suffix !== "N/A" ? slot.suffix : ""
                    ].filter(Boolean).join(" "),
                    record_id: slot.record_id
                };
    
                if (existing) {
                    existing.fullname?.push(fullname);
                } else {
                    acc.push({
                        slot_id: slot.slot_id,
                        slot_name: slot.slot_name,
                        fullname: [fullname]
                    });
                }
            } else {
                acc.push({
                    slot_id: slot.slot_id,
                    slot_name: slot.slot_name,
                    fullname: null
                });
            }
    
            return acc;
        }, []);
    
        setDataSlot(fullnames.reverse());
    }

    const handlePay = (id: number, slotName: string): void => {
        navigate(`/payment/records?slotId=${id}&slotName=${slotName}&groupName=${group_name}`);
    }
    

    useEffect(()=>{
        getSlot();
    },[])


    

    return (
        <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-0 w-full">
                {dataSlot.map((slots: TNameSlot)=>{
                    return (
                        <div key={slots.slot_id}>
                            <div onClick={()=>handlePay(slots.slot_id, slots.slot_name)} className='text-lg text-white uppercase bg-[#001656] hover:rounded-md hover:bg-gray-700 cursor-pointer p-1 hover:scale-105 transition-transform duration-100'>
                                {slots.slot_name}
                            </div>
                            <div>
                            {(slots.fullname ?? []).length > 0 ? (
                                slots.fullname?.map((fullname: Tfullname) => (
                                    <div key={fullname.name} className='text-xs p-2 bg-white border-b border-gray-200'>
                                        {fullname.name}
                                    </div>
                                ))
                            ) : (
                                <div className='text-xs text-gray-500 p-2 bg-white border-b border-gray-200'>available</div>
                            )}
                            </div>
                        </div>
                    )
                })}
            </div>
            
        </>
    )
}


export default PaymentSlotCard
