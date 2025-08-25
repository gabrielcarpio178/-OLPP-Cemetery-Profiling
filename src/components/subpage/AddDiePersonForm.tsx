import React, { useState } from 'react'
import InputTag from '../inputData/InputTag'
import moment from 'moment';

import { FaX } from 'react-icons/fa6';

type PersonForm = {
    id: number;
    firstName?: string;
    lastName?: string;
    suffix?: string,
    middleName?:string
    died?: string,
    born?: string
};


interface DiePerson {
    removeInput: ()=>void,
    index: number,
    personForm: PersonForm;
    onFieldChange: (index: number, field: string, value: string) => void;
}

const AddDiePersonForm: React.FC<DiePerson> = ({ index ,personForm, removeInput, onFieldChange}) => {
    const [firstname, setfirstname] = useState<string>(personForm.firstName || '')
    const [lastname, setlastname] = useState<string>(personForm.lastName || '')
    const [middlename, setmiddlename] = useState<string>(personForm.middleName || '')
    const [suffix, setsuffix] = useState<string>(personForm.suffix || '')
    const [born, setborn] = useState<string>(personForm.born || '')
    const [died, setdied] = useState<string>(personForm.died || '')

    const firstNameFun = (text: string)=>{
        setfirstname(text)
        return text
    }
    const lastNameFun = (text: string)=>{
        setlastname(text)
        return text
    }
    const middleNameFun = (text: string)=>{
        setmiddlename(text)
        return text
    }
    const suffixFun = (text: string)=>{
        setsuffix(text)
        return text
    }
    const bornFun = (text: string)=>{
        setborn(text)
        return text
    }
    const diedFun = (text: string)=>{
        setdied(text)
        return text
    }
    return (
            <>
                <div className='flex flex-col p-4 rounded shadow-lg relative'>
                    {index!=0&&
                        <div className='absolute right-3 top-3 cursor-pointer' onClick={removeInput}>
                            <FaX/>
                        </div>
                    }
                    <div className='flex flex-row gap-x-2'>
                        <InputTag selector='firstname' valueData={firstname} type='text' flex='flex-col' label='Firstname' onChange={e=>onFieldChange(index, 'firstName', firstNameFun(e.target.value))} />
                        <InputTag selector='lastname' type='text' flex='flex-col' label='Lastname' valueData={lastname} onChange={(e) => onFieldChange(index, 'lastName', lastNameFun(e.target.value))} />
                    </div>
                    <div className='flex flex-row gap-x-2'>
                        <InputTag selector='suffix' type='text' flex='flex-col' label='Suffix' valueData={suffix} onChange={e=> onFieldChange(index, 'suffix', suffixFun(e.target.value))} />
                        <InputTag selector='middlename' type='text' flex='flex-col' label='Middle Initial' valueData={middlename} onChange={e=>onFieldChange(index, 'middleName', middleNameFun(e.target.value))} />
                    </div>
                    
                    <p className='text-sm text-black/50'>Suffix available "JR", "SR", "II", "III", "IV","V".  "N/A" if no suffix</p>
                    <div className='flex flex-row gap-x-3'>
                        <InputTag selector='born' type='date' flex='flex-col w-full' label='born' valueData={born} onChange={e=>onFieldChange(index, 'born', bornFun(e.target.value))}/>
                        <InputTag selector='died' type='date' flex='flex-col w-full' label='died' valueData={died} onChange={e=>onFieldChange(index, 'died', diedFun(e.target.value))} />
                    </div>
                </div>
            </>

    )
}

export default AddDiePersonForm