import React, { ReactNode } from 'react';
import axios from 'axios';
import { API_CONTABILIDAD } from '@/variablesglobales';

interface ButtonProps {
    children: ReactNode;
    type?: undefined | 'primary' | 'danger';
    options: { params: any, headers: any, endpoint: string };
}

const APIDownloadButton: React.FC<ButtonProps> = ({ children, type, options }) => {

    let buttonClass = 'py-2 px-4 mx-2 border border-gray-400 shadow bg-slate-100 hover:bg-slate-300 rounded-md';

    if (type === 'primary') {
        buttonClass = 'py-2 px-4 border border-blue-700 bg-blue-500 hover:bg-blue-700 rounded-md text-white';
    } else if (type === 'danger') {
        buttonClass = 'button danger';
    }

    const handleOnClick = () => {
        axios
            .get(API_CONTABILIDAD + options.endpoint, { params: options.params, headers: options.headers, responseType: 'blob' })
            .then((response) => {
                window.open(URL.createObjectURL(response.data));
            })
            .catch((err) => {
            });
    }

    return (

        <button className={buttonClass} onClick={handleOnClick}>
            {children}
        </button>

    );
};

export default APIDownloadButton;