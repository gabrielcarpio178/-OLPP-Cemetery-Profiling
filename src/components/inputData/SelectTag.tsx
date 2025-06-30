interface SelectData {
    value: string;
    text: string;
}


interface DataContent {
    flex: string;
    selector: string;
    label: string;
    valueData?: string;
    hasError?: boolean;
    errorMessage?: string;
    datas: SelectData[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean
}

const SelectTag: React.FC<DataContent> = ({flex, selector, label, valueData="", hasError=false, errorMessage="", datas, onChange=()=>{}, disabled=false}) => {
    const errorClass = hasError?"border border-red-500 text-red-900 placeholder-red-700 bg-red-50":"border border-gray-300 placeholder-gray-500"

    return (
        <div className={`flex ${flex}`}>
            <label htmlFor={selector} className="block text-sm font-medium text-gray-700 capitalize">
                {label}
            </label>
            <div className="mt-1 relative">
                
                <select id={selector} name={selector} className={`appearance-none rounded-md relative block w-full px-3 py-2 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errorClass}`} onChange={onChange} value={valueData} disabled={disabled}>
                    {datas.map((data: SelectData)=>(
                        <option key={data.value} value={data.value}>{data.text}</option>
                    ))}
                </select>


            </div>
            {hasError&&
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{hasError&&errorMessage}</p>
            }
        </div>
    )
}

export default SelectTag


