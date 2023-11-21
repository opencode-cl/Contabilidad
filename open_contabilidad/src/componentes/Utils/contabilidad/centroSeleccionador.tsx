import React, { useState } from 'react';
import TableSelector from '../TableSelector';
import DataTable, {TableColumn} from 'react-data-table-component';
import Modal from '../Modal';

interface CentroSelectorProps {
    centros: any[],
    handleSelectWithReference: (selected: any) => void;
    onClose:()=>void
}

const CentroSelector: React.FC<CentroSelectorProps> = ({ centros, handleSelectWithReference, onClose }) => {

    const centrosColumns:TableColumn<any>[] = [
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
        <Modal type="info" title="Selector de Centros" onClose={onClose}>
            <TableSelector 
                data={centros}
                columns = {centrosColumns}
                onSelect={handleSelectWithReference}
            />
        </Modal>
    </section>
  );
};

export default CentroSelector;