import React from 'react'


interface ImgFIle {
    imgFile: string;
    onRemove: ()=>void;
    onProgressImage: number
    hasError: boolean,
    isEdit: boolean
}
const ImageInputCard: React.FC<ImgFIle> = ({imgFile, onRemove=()=>{}, onProgressImage, hasError, isEdit}) => {
    const API_LINK = import.meta.env.VITE_APP_API_LNK
    const image = isEdit?imgFile:`${API_LINK}/uploads/${imgFile}`
    return (
        <div className="flex flex-col items-center justify-center w-full py-[23.2%] bg-gray-50 rounded-2xl border border-gray-300 border-dashed bg-center bg-cover relative" style={{ backgroundImage: `url(${image})`}}>
            {!hasError&&
            <>
                <div className='w-full h-full bg-black/50 absolute rounded-2xl'></div>
                <div className='w-full flex flex-col items-center px-5 absolute bottom-3'>
                    <p className='text-lg font-semibold text-white'>Loading...</p>
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: `${onProgressImage}%`}}>{`${onProgressImage}%`}</div>
                    </div>
                </div>
            </>
            }  
            {hasError&& <div className="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none" onClick={onRemove}>Remove Image</div>}         
        </div>
    )
}

export default ImageInputCard