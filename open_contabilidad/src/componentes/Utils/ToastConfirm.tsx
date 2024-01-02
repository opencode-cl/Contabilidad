import React, { useEffect, useRef } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ConfirmationToastProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({ message, onConfirm, onCancel }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      // Cierra el modal si se hace clic fuera de él
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel && onCancel();
      }
    };

    // Agrega el EventListener al montar el componente
    document.addEventListener('mousedown', handleClickOutside);

    // Limpia el EventListener al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div ref={modalRef} className="rounded-xl top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50">
    <div className="flex gap-3 bg-yellow-400 ng bg-opacity-90 flex-col items-center p-4 rounded-lg">
      <p className="mb-4">{message}</p>
      <div className='grid grid-cols-2'>
        <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={onConfirm}>
          Confirmar
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
  );
};

export default ConfirmationToast;