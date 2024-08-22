import React from 'react'
import { useState } from 'react';
import PopOut from './PopOut';
//import edit from '../assets/edit.svg';

function DataTable({ headers, data, onUpdate, putMethod }) {
    const [showPopOut, setShowPopOut] = useState(false);
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
        setShowPopOut(true);
    };
    function handleClosePopOut() {
        setShowPopOut(false);
        setCurrentRow(null);
    };
    function handleSavePopOut() {
        onUpdate(currentRow);
        putMethod(currentRow);
        handleClosePopOut();
    };

    const contents = data === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : (<>
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
                        <tr key={row.id}>
                            {Object.values(row).map((cell, cellIndex)=> (
                            <td key={cellIndex}>{cell}</td>
                            ))}
                            <td><button onClick={() => handleEditClick(row)} title="Edit Row">Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PopOut show={showPopOut} onClose={handleClosePopOut}>
                {currentRow && (
                    <div>
                        <h3>Edit Values</h3>
                        {Object.entries(currentRow).map(([key, value], index) => (
                            <div key={index}>
                                <label>{key}: </label>
                                <input type="text" name={key} defaultValue={value} onChange={handleFormChange} />
                            </div>
                        ))}
                        <button onClick={handleSavePopOut} title="Save Changes">Save</button>
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