import React, { useState } from 'react'
import InputTag from '../inputData/InputTag'
import moment from 'moment';

import { FaX } from 'react-icons/fa6';


interface DiePerson {
    firstnameData?: string,
    lastnameData?: string,
    suffixData?: string,
    middlenameData?: string,
    bornData?: string,
    diedData?: string
}

const AddDiePersonForm: React.FC<DiePerson> = ({firstnameData, lastnameData, suffixData, middlenameData, bornData, diedData}) => {
    const [firstname, setfirstname] = useState<string>(firstnameData?firstnameData:'');
    const [lastname, setlastname] = useState<string>(lastnameData?lastnameData:'');
    const [middlename, setmiddlename] = useState<string>(suffixData?suffixData:'');
    const [suffix, setsuffix] = useState<string>(middlenameData?middlenameData:'');
    const [born, setborn] = useState<string>(bornData?bornData:'');
    const [died, setdied] = useState<string>(diedData?diedData:'');
    return (

            <>
                <div className='flex flex-col p-4 rounded shadow-lg relative'>
                    <div className='absolute right-3 top-3 cursor-pointer'>
                        <FaX/>
                    </div>
                    <div className='flex flex-row gap-x-2'>
                        <InputTag selector='firstname' valueData={firstname} type='text' flex='flex-col' label='Firstname' onChange={e=>setfirstname(e.target.value)} />
                        <InputTag selector='lastname' type='text' flex='flex-col' label='Lastname' valueData={lastname} onChange={e=>setlastname(e.target.value)} />
                    </div>
                    <div className='flex flex-row gap-x-2'>
                        <InputTag selector='suffix' type='text' flex='flex-col' label='Suffix' valueData={suffix} onChange={e=>setsuffix(e.target.value)} />
                        <InputTag selector='middlename' type='text' flex='flex-col' label='Middle Initial' valueData={middlename} onChange={e=>setmiddlename(e.target.value)} />
                    </div>
                    
                    <p className='text-sm text-black/50'>Suffix available "JR", "SR", "II", "III", "IV","V".  "N/A" if no suffix</p>
                    <div className='flex flex-row gap-x-3'>
                        <InputTag selector='born' type='date' flex='flex-col w-full' label='born' valueData={born} onChange={e=>setborn(e.target.value)}/>
                        <InputTag selector='died' type='date' flex='flex-col w-full' label='died' valueData={died} onChange={e=>setdied(e.target.value)} />
                    </div>
                </div>
            </>

    )
}

export default AddDiePersonForm