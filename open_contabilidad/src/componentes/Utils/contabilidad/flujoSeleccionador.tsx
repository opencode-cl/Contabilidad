import React, { useState } from 'react';
import TableSelector from '../TableSelector';
import DataTable, {TableColumn} from 'react-data-table-component';
import Modal from '../Modal';

interface ItemsSelectorProps {
    flujos: any[],
    handleSelectWithReference: (selected: any) => void;
    onClose:()=>void
}

const FlujosSelector: React.FC<ItemsSelectorProps> = ({ flujos, handleSelectWithReference, onClose }) => {

    const flujosColumns:TableColumn<any>[] = [
        { 
            id: 'codigo',
            name: 'Codigo',
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
        <Modal type="info" title="Selector de flujos" onClose={onClose}>
            <TableSelector 
                data={flujos}
                columns = {flujosColumns}
                onSelect={handleSelectWithReference}
            />
        </Modal>
    </section>
  );
};

export default FlujosSelector;