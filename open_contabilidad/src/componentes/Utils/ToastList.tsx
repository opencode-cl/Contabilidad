import React, { useState } from 'react';
import Toast from './Toast';
import { IToast } from '@/interfaces/IToast';
import { Dispatch, SetStateAction } from 'react';

interface ToastListProps {
  toasts: IToast[];
  position?: 'bottom-right' | 'bottom-mid';
  setToasts?: Dispatch<SetStateAction<IToast[]>>
}

const ToastList: React.FC<ToastListProps> = ({ toasts, position ="bottom-right", setToasts}) => {
  const toastListClasses = `fixed ${
    position === 'bottom-right' ? 'bottom-0 right-0' : 'bottom-0 left-1/2 transform -translate-x-1/2'
  } z-30`

  return (
    <div className={toastListClasses}>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          duration={toast.duration}
          type={toast.type}
          onClose={() => {
            setToasts? setToasts(toasts.filter((item) => item.id !== toast.id)) : ""
          }}
        />
      ))}
    </div>
  );
};

export default ToastList;