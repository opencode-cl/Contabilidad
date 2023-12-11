import React, { useState } from 'react';
import TableSelector from '../TableSelector';
import DataTable, {TableColumn} from 'react-data-table-component';
import Modal from '../Modal';

interface ItemsSelectorProps {
    items: any[],
    handleSelectWithReference: (selected: any) => void;
    onClose:()=>void
}

const ItemsSelector: React.FC<ItemsSelectorProps> = ({ items, handleSelectWithReference, onClose }) => {

    const itemsColumns:TableColumn<any>[] = [
        { 
            id: 'codigo',
            name: 'Codigo',
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
        <Modal type="info" title="Selector de Items" onClose={onClose}>
            <TableSelector 
                data={items}
                columns = {itemsColumns}
                onSelect={handleSelectWithReference}
            />
        </Modal>
    </section>
  );
};

export default ItemsSelector;