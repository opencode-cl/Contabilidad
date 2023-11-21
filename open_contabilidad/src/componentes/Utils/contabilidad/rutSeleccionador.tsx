import React, { useState } from 'react';
import TableSelector from '../TableSelector';
import DataTable, {TableColumn} from 'react-data-table-component';
import Modal from '../Modal';

interface RutSelectorProps {
    nombres: any[],
    handleSelectWithReference: (selected: any) => void;
    onClose:()=>void
}

const RutSelector: React.FC<RutSelectorProps> = ({ nombres, handleSelectWithReference, onClose }) => {

    const rutColumns:TableColumn<any>[] = [
        { 
            id: 'rut',
            name: 'Rut',
            width: '6rem',
            selector:(row) => row.codigo+"-"+row.dv
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
        <Modal type="info" title="Selector de Rut" onClose={onClose}>
            <TableSelector 
                data={nombres}
                columns = {rutColumns}
                onSelect={handleSelectWithReference}
            />
        </Modal>
    </section>
  );
};

export default RutSelector;