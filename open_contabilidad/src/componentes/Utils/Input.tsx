import { kMaxLength } from 'buffer'
import { ChangeEvent, FC } from 'react'

interface InputProps {
  type: 'text' | 'number' | 'email' | 'password'
  label: string
  value: string | number | undefined
  name: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?:boolean
  maxLength?: number;
  size?: string;
}

const Input: FC<InputProps> = ({
  type,
  label,
  value,
  name,
  placeholder="",
  error,
  disabled,
  onChange,
  required,
  maxLength,
  size = "lg"
}) => {

  const sizeTitleClass = size === "md" ? "mb-1" : "mb-2";
  const sizeInputClass = size === "md" ? "px-2 py-1 text-sm" : "px-3 py-2" 

  const titleClass = "block text-gray-700 text-sm dark:text-slate-200 font-bold " + sizeTitleClass
  const inputClass = 'shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' +sizeInputClass+ 
  (error ? " border-red-500" : "")

  return (
    <div className="input-wrapper">

      <label className={titleClass}
        htmlFor={name}>{label}
      </label>

      <input className={inputClass}
        type={type}
        id={name}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        required = {required}
        maxLength={maxLength}
      />

      {error && <p className="error text-right text-red-500">¡Campo no puede estar vacio!</p>}

    </div>
  )
}

export default Input