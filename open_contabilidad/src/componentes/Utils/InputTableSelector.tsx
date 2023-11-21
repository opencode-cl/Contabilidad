import { title } from 'process';
import { ChangeEvent, FC } from 'react'

interface InputTableSelectorProps {
    onClick: ()=>void;
    label: string;
    description?:any;
    error?: boolean
}

const InputTableSelector: FC<InputTableSelectorProps> = ({
    onClick, label, description ="", error= false
}) => {
  return (
    <div className="">
        <label className="block text-gray-700 dark:text-slate-200  text-sm font-bold mb-2" htmlFor="{label}">
                {label}
        </label>
        <div>
        <table className={"bg-gray-100 rounded-md text-sm dark:bg-slate-700" + (error? " border border-red-500": "")}>
          <tr>

            {description !==""  && <td className='p-2'>
            <span className='ml-2'>{description}</span>
            </td>}

            <td className='p-2'>
            <button 
          className='bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md text-white'
          onClick={onClick}>Seleccionar</button>
            </td>
          </tr>
        </table>

        </div>
        {error && <p className="error text-right text-red-500">¡Campo no puede estar vacio!</p>}
    </div>
  )
}

export default InputTableSelector