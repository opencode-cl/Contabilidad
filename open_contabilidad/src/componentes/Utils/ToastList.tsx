import React, { useState } from 'react';
import Toast from './Toast';
import { IToast } from '@/interfaces/IToast';
import { Dispatch, SetStateAction } from 'react';
import ConfirmationToast from './ToastConfirm';

interface ToastListProps {
  toasts: IToast[];
  position?: 'bottom-right' | 'bottom-mid' | 'center';
  setToasts?: Dispatch<SetStateAction<IToast[]>>
}

const ToastList: React.FC<ToastListProps> = ({ toasts, position ="bottom-right", setToasts}) => {
  const [isConfirmationToastOpen, setIsConfirmationToastOpen] = useState(false);

  let toastListClasses = 'fixed z-30';

  if (position === 'bottom-right') {
    toastListClasses += ' bottom-0 right-0';
  } else if (position === 'bottom-mid') {
    toastListClasses += ' bottom-0 left-1/2 transform -translate-x-1/2';
  } else if (position === 'center') {
    toastListClasses += ' top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  }

  return (
    <div className={toastListClasses}>
      {toasts.map((toast, index) => (
        <React.Fragment key={toast.id}>
        {toast.type === 'confirmation' ? (
          <ConfirmationToast
            message={toast.message}
            onConfirm={() => {
              toast.onConfirm && toast.onConfirm(); // Invoca la función onConfirm si está definida
              setToasts && setToasts(toasts.filter((item) => item.id !== toast.id));
            }}
            onCancel={() => setToasts && setToasts(toasts.filter((item) => item.id !== toast.id))}
          />
        ) : (
          <Toast
            key={toast.id}
            message={toast.message}
            duration={toast.duration}
            type={toast.type}
            onClose={() => setToasts && setToasts(toasts.filter((item) => item.id !== toast.id))}
          />
        )}
      </React.Fragment>
      ))}
    </div>
  );
};

export default ToastList;