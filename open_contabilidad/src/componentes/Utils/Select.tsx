import { NO_OPTION } from '@/variablesglobales'
import { ChangeEvent, FC } from 'react'

interface SelectProps {
  label: string
  name: string
  title: string,
  error: boolean
  disabled?: boolean
  options: any[]
  optionsObject?: any[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  selected?: any
  size?: string
}   

const Select: FC<SelectProps> = ({
  name,
  title,
  disabled,
  onChange,
  options,
  selected,
  error,
  size = "lg"
}) => {

  const titleSizeClass = size === "md" ? "mb-1" : "mb-2";
  const selectSizeClass = size === "md" ? "p-1.5" : "p-2.5";

  return (
    <div className="input-wrapper">
        <label htmlFor={name} className="block text-gray-700 dark:text-slate-200 text-sm font-bold">{title}</label>
        <select 
        id={name}
        disabled = {disabled} 
        onChange = {onChange}
        defaultValue={selected ? selected.value : NO_OPTION}
        className={"bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " + selectSizeClass +
                  (error ? " border-red-500": " border-gray-300")}>
        <option value={NO_OPTION} hidden>Seleccione...</option>
        {options.map((item, index) => <option key={index} value={item.value} selected={item.value === selected?.value}>{item.text}</option>)}
        </select>
        {error && <p className="error text-right text-red-500">¡Campo no puede estar vacio!</p>}
    </div>
  )
}

export default Select
