import React from 'react'
import { useState } from 'react';
import PopOut from './PopOut';
//import edit from '../assets/edit.svg';

function DataTable({ headers, data, onUpdate, putMethod, postMethod, deleteMethod }) {
    const [showEditPopOut, setShowEditPopOut] = useState(false);
    const [showAddPopOut, setShowAddPopOut] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [newRow, setNewRow] = useState(null);
    const [currentRow, setCurrentRow] = useState(null);

    function handleFormChange(e) {
        const { name, value } = e.target;
        setCurrentRow((currentRow) => ({
            ...currentRow,
            [name]: value,
        }));
        //console.log(currentRow); 
    }

    function handleEditClick(row) {
        setCurrentRow(row);
        setShowEditPopOut(true);
    };

    function handleAddClick() {
        setShowAddPopOut(true);
    };

    function handleDeleteConfirmNo() {
        setShowConfirmation(true);
    }

    function handleDeleteConfirmYes(row) {
        deleteMethod(row);
        handleClosePopOuts();
        
    }
    

    function handleCloseDeleteConfirmPopOuts() {
        // Delete confirm box goes back to edit screen, not to main level
        setShowConfirmation(false);
    }

    function handleClosePopOuts() {
        // CLose method for all popouts. 
        setShowEditPopOut(false);
        setShowAddPopOut(false);
        setShowConfirmation(false);
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
        onUpdate(newRow);
        postMethod(newRow);
        handleClosePopOuts();
    };

    function handleSaveEditPopOut() {
        onUpdate(currentRow);
        putMethod(currentRow);
        handleClosePopOuts();
    };

    const contents = data === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : (<>
            {/* Refactor this popout into separate component */}
            <button onClick={handleAddClick} id="add-button" name="AddButton" title="Add To Table" >+</button>
            <PopOut show={showAddPopOut} onClose={handleClosePopOuts}>
                <div>
                    <h3>Add a Department</h3>
                    
                    <div key="name">
                        <label>Name: </label>
                        <input type="text" name="name" placeholder="Name" onChange={handleAddFormChange} />
                    </div>
                    <div key="shortCode">
                        <label>Short Code: </label>
                        <input type="text" name="shortCode" placeholder="ShortCode" onChange={handleAddFormChange} />
                    </div>
                    <button onClick={handleSaveAddPopOut} title="Save Changes">Save</button>
                </div>
            </PopOut>

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

            {/* Refactor this popout into separate component */}
            <PopOut show={showEditPopOut} onClose={handleClosePopOuts}>
                {currentRow && (
                    <div>
                        <h3>Edit Values</h3>
                        {Object.entries(currentRow).map(([key, value], index) => (
                            <div key={index}>
                                <label>{key}: </label>
                                <input type="text" name={key} defaultValue={value} onChange={handleFormChange} />
                            </div>
                        ))}
                        <button onClick={handleSaveEditPopOut} id="popout-confirm-yes" title="Save Changes">Save</button>
                        <button id="popout-delete" onClick={handleDeleteConfirmNo} title="Delete">Delete</button>
                        <PopOut show={showConfirmation} onClose={handleCloseDeleteConfirmPopOuts}>
                            <h3>Are you sure you want to delete this Department?</h3>

                            <div id="popout-delete-confirm-buttons">
                                <button id="popout-confirm-yes" onClick={() => handleDeleteConfirmYes(currentRow)} title="Confirm Delete">Yes</button>
                                <button id="popout-confirm-no" onClick={handleCloseDeleteConfirmPopOuts} title="Cancel Delete">No</button>
                            </div>
                        </PopOut>
                    </div>
                )}
            </PopOut>
        </>);
    return (
        <>
            {contents}
        </>
    
    );
}

export default DataTable;