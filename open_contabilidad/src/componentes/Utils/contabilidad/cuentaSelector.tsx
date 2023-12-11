import React, { useState } from 'react';
import TableSelector from '../TableSelector';
import DataTable, {TableColumn} from 'react-data-table-component';
import Modal from '../Modal';

interface CuentaSelectorProps {
    cuentas: any[],
    handleSelectWithReference: (selected: any) => void;
    onClose:()=>void
}

const CuentaSelector: React.FC<CuentaSelectorProps> = ({ cuentas, handleSelectWithReference, onClose }) => {

    const cuentasColumns:TableColumn<any>[] = [
        { 
            id: 'cuenta',
            name: 'Cuenta',
            sortable: true,
            width: '6rem',
            selector:(row) => row.codigo
        },
        { 
            id: 'nombre',
            name: 'Nombre',
            wrap:true,
            selector:(row) => row.nombre
        },
    ]

  return (
    <section>
        <Modal type="info" title="Selector de Cuenta" onClose={onClose}>
            <TableSelector 
                data={cuentas}
                columns = {cuentasColumns}
                onSelect={handleSelectWithReference}
            />
        </Modal>
    </section>
  );
};

export default CuentaSelector;