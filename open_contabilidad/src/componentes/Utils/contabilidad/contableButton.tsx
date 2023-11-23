import React from 'react';

interface ContableButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean
  className?:string
}

const ContableButton: React.FC<ContableButtonProps> = ({ onClick,className, children, disabled=false }) => {
  
  const buttonClass = 'bg-gray-500 text-white font-bold py-2 px-2 rounded ' + (className ? ` ${className}` : "");
  const disabledClass = disabled ? "opacity-50" : "hover:bg-gray-600"

  return (
    <button
      className={buttonClass + disabledClass}
      onClick={onClick}
      disabled = {disabled}
    >
      {children}
    </button>
  );
};

export default ContableButton;