import { ChangeEvent, FC } from 'react'

interface ICheckboxProps {
  label?: string
  value?: string | number
  name: string
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  checked?:boolean
}

const Checkbox: FC<ICheckboxProps> = ({
  label,
  value,
  name,
  disabled,
  onChange,
  checked
}) => {
  return (
    <div className="input-wrapper">
      <input  type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      id={label}
      value={value}
      onChange={onChange} 
      disabled = {disabled}
      checked = {checked} />
      {label && <label htmlFor={label} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>}
    </div>
  )
}

export default Checkbox

