import React, { useState, useEffect } from 'react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ToastProps {
  message: string;
  duration: number;
  type: 'warning' | 'success' | 'info' | 'danger';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration);
  }, [duration, onClose]);

  const handleClose = () => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 500);
  }

  const toastClasses = `flex mb-4 mr-4 p-4 transition-opacity duration-300 rounded-lg text-white ${
    type === 'warning'
      ? 'bg-yellow-500'
      : type === 'success'
      ? 'bg-green-500'
      : type === 'info'
      ? 'bg-blue-500'
      : 'bg-red-500'
  } ${visible ? 'opacity-100' : 'opacity-0 -z-50'}`;

  return (
    <div className={toastClasses}>
      <InformationCircleIcon className='w-6 h-6  mr-2 align-middle' />
        <p className="align-middle">{message}</p>
        
        <a onClick={handleClose}><XMarkIcon className='w-4 h-4 ml-auto mt-1 align-middle focus:ring-4 focus:ring-white' /></a>
    </div>
  );
};

export default Toast;