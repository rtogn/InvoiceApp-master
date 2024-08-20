import React from 'react'
import { useEffect, useState } from 'react';

function DataTable({ headers, data }) {

    const contents = data === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : (<>
            <table className="table table-striped" aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        {headers.map((header, index) =>
                            <th key={index}>{header}</th>     
                        )}
                    <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            {Object.values(row).map((cell, cellIndex)=> (
                            <td key={cellIndex}>{cell}</td>
                            ))}
                            <td><button>Beep</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>cats</p>
        </>);

    return (
        <>
            {contents}
        </>
    
    );
}

export default DataTable;