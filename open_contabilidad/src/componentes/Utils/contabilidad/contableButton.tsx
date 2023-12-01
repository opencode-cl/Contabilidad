import React from 'react';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

interface ContableButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  tooltipText?: string;
}

const ContableButton: React.FC<ContableButtonProps> = ({
  onClick,
  className,
  children,
  disabled = false,
  tooltipText, 
}) => {
  const buttonClass = 'bg-gray-500 text-white font-bold py-2 px-2 rounded ' + (className ? ` ${className}` : "");
  const disabledClass = disabled ? "opacity-50" : "hover:bg-gray-600";

  return (
    <div data-tooltip-id="my-tooltip" data-tooltip-content={tooltipText}>
      <button
        className={buttonClass + disabledClass}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
      <Tooltip id="my-tooltip" place="top" ></Tooltip>
    </div>
  );
};

export default ContableButton;