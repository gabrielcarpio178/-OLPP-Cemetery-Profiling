import React, { useEffect, useState } from 'react'
import { FaX } from 'react-icons/fa6';
import DragAndDropFile from './DragAndDropFile';
import InputTag from '../inputData/InputTag';
import SelectTag from '../inputData/SelectTag';
import ButtonTag from '../inputData/ButtonTag';
import ImageInputCard from './ImageInputCard';
import axios from 'axios';
import moment from "moment"

type Tgroups = {
    id: number,
    group_name: string
}

type Tslot = {
    id: number,
    group_id: number,
    slot_name: string
}

type Tspace = {
    space_id: number,
    space_name: string
    slot_id: number
}

type TselectTag = {
    value: string,
    text: string
}

type TsendData = {
    notImage: boolean,
    id: number
    image: File|null,
    file_name: string
    firstname: string|null,
    lastname: string|null,
    slot_id: number|null,
    group_id: number|null,
    space_id: number|null
    born: string|null,
    died: string|null,
    suffix: string|null,
    middlename: string|null,
}

type TeditData = {
    id: number,
    image_name: File,
    firstname: string,
    lastname: string,
    slot_id: number,
    group_id: number,
    space_id: number,
    born: string,
    died: string,
    suffix: string,
    middlename: string,
    group_name: string,
    slot_name: string,
    file_name: string
}


interface ContentTyps {
    isOpen: boolean;
    title: string;
    closeModal: ()=>void;
    slots: Tslot[],
    groups: Tgroups[],
    spaces: Tspace[];
    sendData: (data: TsendData) => void;
    onProgressImage: number;
    editData?: TeditData
}


const MasterListModal: React.FC<ContentTyps> = ({isOpen, title, closeModal = ()=>{}, groups, slots, spaces, sendData=()=>{}, onProgressImage, editData}) => {
    //initialize data
    const [files, setFiles] = useState<File | null>(editData?.image_name ?? null);
    const [imagePreview, setImagePreview] = useState<string | null>(editData?.file_name??null);
    const [groups_id, setGroups] = useState<TselectTag[]>([])
    const [slots_id, setSlots_id] = useState<TselectTag[]>([])
    const [spaceIds,setSpaceIds] = useState<TselectTag[]>([]);
    const [group_id, setGroupId] = useState<number>(editData?.group_id ?? 0);
    const [slot_id, setSlot_id] = useState<number>(editData?.slot_id ?? 0);
    const [space_id, setSpace_id] = useState<number>(editData?.space_id ?? 0);
    const [isEditSpace, setIsEditSpace] = useState<boolean>(editData===undefined)
    const [firstname, setfirstname] = useState<string>(editData?.firstname??"");
    const [lastname, setlastname] = useState<string>(editData?.lastname??"");
    const [middlename, setmiddlename] = useState<string>(editData?.middlename??"");
    const [suffix, setsuffix] = useState<string>(editData?.suffix??"");
    const [born, setborn] = useState<string>(editData!==undefined?moment(editData?.born).format("YYYY-MM-DD"):"");
    const [died, setdied] = useState<string>(editData!==undefined?moment(editData?.died).format("YYYY-MM-DD"):"");
    
    //interaction
    const [buttonLoading, setButtonLoading] = useState(false)
    const [errors, setErrors] = useState({slot_idError: false, group_idError: false, firstname: false, lastname: false, suffix: false, born: false, died: false, image: false, middlename: false})
    const [hasError, setHasError] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [notImage, setNotImage] = useState(false)

    const [isEdit, setIsEdit] = useState(editData===undefined)

    const capitalize = (str: string): string => {
        if (str.length === 0) return str;
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
    
    const handleFileDrop = (droppedFiles: File) => {
        setFiles(droppedFiles);
        setIsEdit(true)
        const file = droppedFiles;
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getRemove = () =>{
        setIsEdit(false)
        setImagePreview(null)
        setFiles(null)
        setHasError(true)
    }

    const getGroupData = async () =>{
        const dataResult = groups.map((data: Tgroups)=>{
            return { value: data.id.toString(), text: (data.group_name).toUpperCase() }
        })
        const temp_slot_id = editData===undefined?groups[0].id:group_id
        getSlot(temp_slot_id)
        setGroups(dataResult)
    }

    const setGroupsFunc = (id: number) =>{
        setGroupId(id)
        getSlot(id)
    }

    const setSpaceFunc = (id: number)=>{
        setSlot_id(id);
        getSpace(id);
    }

    const getSpace = (id: number)=>{
        const spaces_id = spaces.filter((data: Tspace)=> {return id === data.slot_id})
        const displaySpace = spaces_id.map((data: Tspace)=>{
            return {text: capitalize(data.space_name), value: data.space_id.toString()}
        })
        setSpaceIds(displaySpace);
    }

    const getSlot = async (id: number) =>{
        const slots_id = slots.filter((data: Tslot)=> {return id === data.group_id})
        const displaySlot = slots_id.map((data: Tslot)=>{
            return {text: capitalize(data.slot_name), value: data.id.toString()}
        })
        setSlot_id(isEditSpace?slots_id[0]?.id:slot_id)
        getSpace(isEditSpace?slots_id[0]?.id:slot_id);
        setSlots_id(displaySlot)
    }

    const submitData = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setButtonLoading(true)
        setHasError(false)
        const formData = new FormData(e.currentTarget)
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");
        const group = formData.get("group_id");
        const slot = formData.get("slot_id");
        const space = formData.get("space_id");
        const born = formData.get("born");
        const died = formData.get("died");
        const suffix = formData.get("suffix")
        const middlename = formData.get("middlename")

        const data: TsendData = {
            notImage: notImage,
            id: editData===undefined?0:editData.id,
            image: files,
            file_name: editData===undefined?"":editData?.file_name,
            firstname: typeof firstname === "string" ? firstname : null,
            lastname: typeof lastname === "string" ? lastname : null,
            group_id: typeof group === "string" ? parseInt(group) : null,
            slot_id: typeof slot === "string" ? parseInt(slot) : null,
            space_id: typeof space === "string" ? parseInt(space) : null,
            born: typeof born === "string" ? born : null,
            died: typeof died === "string" ? died : null,
            suffix: typeof suffix === "string" ? suffix : null,
            middlename: typeof middlename === "string" ? middlename : null,
        };

        const fields = { firstname, lastname, group, slot, born, died, suffix, middlename };
        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                setHasError(true)
                setButtonLoading(false)
                setErrorMessage(`"${key}" is not allowed to be empty`);
                setErrors({slot_idError: "slot"===key, group_idError:  "group"===key, firstname: "firstname"===key, lastname: "lastname"===key, suffix: "suffix"===key, born: "born"===key, died: "died"===key, image: false, middlename: "middlename"===key})
                return;
            }
        }

        const familyRoleSuffixes:[string|null, string|null, string|null, string|null, string|null, string|null, string|null] = ["JR", "SR", "II", "III", "IV","V", "N/A"];
        const upperCaseSuffix = (data.suffix===null?"":data.suffix).toLocaleUpperCase()
        if(!familyRoleSuffixes.includes(upperCaseSuffix)){
            setHasError(true)
            setButtonLoading(false)
            setErrorMessage('"suffix" is not available');
            setErrors({slot_idError: false, group_idError: false, firstname: false, lastname: false, suffix: true, born: false, died: false, image: false, middlename: false})
            return;
        }

        const res = await sendData(data);
        setButtonLoading(false)
        
        if (axios.isAxiosError(res)){
            if(res.status===400){
                setHasError(true)
                const serverErrors = res.response?.data.details[0];
                setErrorMessage(serverErrors.message);
                setErrors({
                    slot_idError: serverErrors.path[0] === "slot_id",
                    group_idError: serverErrors.path[0] === "group_id",
                    firstname: serverErrors.path[0] === "firstname",
                    lastname: serverErrors.path[0] === "lastname",
                    suffix: serverErrors.path[0] === "suffix",
                    born: serverErrors.path[0] === "born",
                    died: serverErrors.path[0] === "died",
                    image: serverErrors.path[0] === "image",
                    middlename: serverErrors.path[0] === "middlename"
                })
            }else if(res.status==500){
                setHasError(true)
            }
        }
        
    }

    const getIsError = (data: {isError: boolean}) => {
        setNotImage(data.isError)
        setHasError(true)
    }

    useEffect(()=>{
        getGroupData()
        setIsEditSpace(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className={`${isOpen?"":"hidden"} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-black/50`}>
                <div className="relative p-4 w-full max-w-md max-h-full animate__animated animate__fadeIn">
                    <div className="relative bg-gray-100 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {title}
                            </h3>
                            <button className='cursor-pointer' onClick={closeModal}>
                                <FaX/>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className='flex flex-col gap-y-3'onSubmit={submitData}>
                                
                                {!imagePreview&&
                                    <DragAndDropFile onDrop={handleFileDrop} error={{message: errorMessage, isError: errors.image}} isError={getIsError} />
                                }
                                {imagePreview&&
                                    <ImageInputCard hasError={hasError} onProgressImage={onProgressImage} imgFile={imagePreview} onRemove={getRemove} isEdit={isEdit}/>
                                }
                                <div className='flex flex-row gap-x-2'>
                                    <SelectTag flex={'flex-col w-[33.33%]'} selector={'group_id'} label={'Group'} datas={groups_id} valueData={group_id.toString()} onChange={e=>setGroupsFunc(parseInt(e.target.value))} hasError={errors.group_idError} errorMessage={errorMessage}/>

                                    {slots_id.length===0&&<InputTag selector='slot_id' type='text' flex="flex-col w-[33.33%]" valueData='No Slot Available' label="slot" disabled={true} hasError={errors.slot_idError} errorMessage={errorMessage}/>}    
                                    {slots_id.length!==0&&<SelectTag flex={'flex-col w-[33.33%]'} selector={'slot_id'} label={'slot'} datas={slots_id} disabled={slots_id.length===0} valueData={slot_id?.toString()} onChange={e=>setSpaceFunc(parseInt(e.target.value))}/>}

                                    {spaceIds.length===0&&<InputTag selector='space_id' type='text' flex="flex-col w-[33.33%]" valueData='No Slot Available' label="Space" disabled={true} hasError={errors.slot_idError} errorMessage={errorMessage}/>}    
                                    {spaceIds.length!==0&&<SelectTag flex={'flex-col w-[33.33%]'} selector={'space_id'} label={'Space'} datas={spaceIds} valueData={space_id?.toString()} onChange={e=>setSpace_id(parseInt(e.target.value))} />}

                                </div>
                                <div className='flex flex-row gap-x-2'>
                                    <InputTag selector='firstname' type='text' flex='flex-col' label='Firstname' hasError={errors.firstname} errorMessage={errorMessage} valueData={firstname} onChange={e=>setfirstname(e.target.value)} />
                                    <InputTag selector='lastname' type='text' flex='flex-col' label='Lastname' hasError={errors.lastname} errorMessage={errorMessage} valueData={lastname} onChange={e=>setlastname(e.target.value)} />
                                </div>
                                <div className='flex flex-row gap-x-2'>
                                    <InputTag selector='suffix' type='text' flex='flex-col' label='Suffix' hasError={errors.suffix} errorMessage={errorMessage} valueData={suffix} onChange={e=>setsuffix(e.target.value)} />
                                    <InputTag selector='middlename' type='text' flex='flex-col' label='Middle Initial' hasError={errors.middlename} errorMessage={errorMessage} valueData={middlename} onChange={e=>setmiddlename(e.target.value)} />
                                </div>
                                
                                <p className='text-sm text-black/50'>Suffix available "JR", "SR", "II", "III", "IV","V".  "N/A" if no suffix</p>
                                <div className='flex flex-row gap-x-3'>
                                    <InputTag selector='born' type='date' flex='flex-col w-full' label='born' hasError={errors.born} errorMessage={errorMessage} valueData={born} onChange={e=>setborn(e.target.value)}/>
                                    <InputTag selector='died' type='date' flex='flex-col w-full' label='died' hasError={errors.died} errorMessage={errorMessage} valueData={died} onChange={e=>setdied(e.target.value)} />
                                </div>

                                <ButtonTag type='submit' text='Submit' disabled={buttonLoading}/>
                            </form>
                            
                        </div>
                    </div>
                </div>
            </div>     
        </>
    )
}

export default MasterListModal
