import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState, ReactNode} from 'react';
import Button from './Button';

interface ModalProps {
  children: ReactNode;
  onConfirm?: ()=>void;
  type: 'error' | 'info';
  title: string;
  onClose: ()=> void;
  width?:string;
  menu?:boolean;
}

const Modal: React.FC<ModalProps> = ({ children, onConfirm, title, onClose, width = "w-1/3", menu}) => {

  return (
    <section>
      
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className={"relative z-20 bg-white dark:bg-slate-800 p-4 rounded shadow-lg " +width}>

              <div className="flex justify-end">

                <span className="text-xl ml-4 dark:text-white mr-auto">{title}</span>

                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <hr className="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-slate-600 opacity-100 dark:opacity-50" />

              <div className="p-4 dark:text-slate-300">{children} </div>
              {menu &&
              <div>
              <hr className="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-slate-600 opacity-100 dark:opacity-50" />
              <div className="text-right">
               <Button onClick={onClose} text="Cerrar"/>

                {onConfirm && <Button type='primary' onClick={onConfirm} text="Enviar" />}
              </div>
              </div>}

            </div>
          </div>
        </div>
    </section>
  );
};

export default Modal;