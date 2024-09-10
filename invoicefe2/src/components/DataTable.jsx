import React from 'react'
import { useEffect, useState } from 'react';
import PopOut from './PopOut';
import DeleteConfirmPopOut from './DeleteConfirmPopOut';
import AddPopOut from './AddPopOut';
import EditPopOut from './EditPopOut';
import PageList from './PageList';
//import edit from '../assets/edit.svg';

function DataTable({ headers, payload, getMethod, putMethod, postMethod, deleteMethod }) {
    const data = payload?.data || [];
    const page = payload?.page || 0;
    const pageSize = payload?.pageSize || 0;
    const totalRecords = payload?.totalRecords || 0;
    const totalPages = payload?.totalPages || 0;

    const [showEditPopOut, setShowEditPopOut] = useState(false);
    const [showAddPopOut, setShowAddPopOut] = useState(false);
    const [newRow, setNewRow] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(page);

    useEffect(() => {
        getMethod(currentPage, pageSize);
    }, [currentPage]);


    function handleEditClick(row) {
        setCurrentRow(row);
        setShowEditPopOut(true);
    };

    function handleAddClick() {
        setShowAddPopOut(true);
    };

    function handleClosePopOuts() {
        // CLose method for all popouts. 
        setShowEditPopOut(false);
        setShowAddPopOut(false);
        setCurrentRow(null);
    };

    function handleAddFormChange(e) {
        const { name, value } = e.target;
        setNewRow((addRow) => ({
            ...addRow,
            [name]: value,
        }));
    }

    function handleSaveAddPopOut() {
        postMethod(newRow);
        handleClosePopOuts();
    };

    function handleSaveEditPopOut() {
        putMethod(currentRow);
        handleClosePopOuts();
    };

    const contents = data === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : (<>
            <button onClick={handleAddClick} id="add-button" name="AddButton" title="Add To Table" >+</button>
            <AddPopOut show={showAddPopOut}
                save={handleSaveAddPopOut}
                onChange={handleAddFormChange}
                onClose={handleClosePopOuts} />
            <div>
                <table className="table table-striped" aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            {headers.map((header, index) =>
                                <th key={index}>{header}</th>     
                            )}
                        <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} id="table-row">
                                {Object.values(row).map((cell, cellIndex)=> (
                                <td key={cellIndex}>{cell}</td>
                                ))}
                                <td><button onClick={() => handleEditClick(row)} id="table-button" title="Edit Row">Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <PageList curPage={currentPage} setCurPage={setCurrentPage} totalPages={totalPages} />
            </div>
            <EditPopOut show={showEditPopOut}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                onSave={handleSaveEditPopOut}
                onClose={handleClosePopOuts}
                deleteMethod={deleteMethod} />
        </>);
    return (
        <>
            {contents}
        </>
    
    );
}

export default DataTable;