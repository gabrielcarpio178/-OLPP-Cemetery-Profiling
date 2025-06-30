import React, { useState } from 'react'
import { IconContext, type IconType } from 'react-icons';


interface DataContent {
    flex: string;
    selector: string;
    label: string;
    type: "password"|"text"|"number"|"date"|"checkbox";
    placeholder?: string;
    icon?: IconType;
    icon_color?: string;
    size?: number;
    getDataIsShow?: (data: { isShow: boolean }) => void;
    valueData?: string;
    hasError?: boolean;
    errorMessage?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean
}

const InputTag: React.FC<DataContent> = ({flex, selector, label, type, placeholder="", icon: Icon, icon_color="black" , size = 2, getDataIsShow=()=>{}, valueData, hasError=false, errorMessage="", onChange=()=>{}, disabled=false}) => {
    const [isShow, setIsShow] = useState(false);
    
    const setPasswordType = ()=>{
        const newShow = !isShow;
        setIsShow(newShow);
        getDataIsShow({ isShow: newShow });
    }
    

    const errorClass = hasError?"border border-red-500 text-red-900 placeholder-red-700 bg-red-50":"border border-gray-300 placeholder-gray-500"
    return (
        <div className={`flex ${flex}`}>
            <label htmlFor={selector} className="block text-sm font-medium text-gray-700 capitalize">
                {label}
            </label>
            <div className="mt-1 relative">
                <input id={selector} name={selector} type={type} className={`appearance-none rounded-md relative block w-full px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errorClass}`} placeholder={placeholder} autoComplete='true' value={valueData} onChange={(e)=>{onChange(e)}} disabled={disabled}/>
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer translate-0 z-[999]' onClick={()=>(setPasswordType())}>
                    {Icon && 
                        <IconContext.Provider value={{ color: icon_color, size: `${size}em` }}>
                            {Icon && <Icon />}
                        </IconContext.Provider>
                    }
                </div>
                
            </div>
            {hasError&&
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{hasError&&errorMessage}</p>
            }
        </div>
    )
}

export default InputTag


