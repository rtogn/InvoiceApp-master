import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';

function DepartmentManager() {
    const [departments, setDepartments] = useState();

    useEffect(() => {
        populateDepartmentData();
    }, []);

    const handleUpdate = (updatedRow) => {
        setDepartments((prevData) =>
            prevData.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            )
        )
    }            ;

    return (
        <>
            <h1>Department Manager Temp</h1>
            <DataTable headers={['ID', 'Name', 'Short Code']} data={departments} putMethod={putDepartment} onUpdate={handleUpdate} /> 
        </>

    );

    async function populateDepartmentData() {
        const response = await fetch('API/Departments', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        const data = await response.json();
        const head = data.headers;
        setDepartments(data);
    }

    async function postDepartment() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ name: 'Naa', shortCode: 'Waa' })
        };
    }

    async function putDepartment(row) {
        const id = row.id;
        const name = row.name;
        const shortCode = row.shortCode;
        const update = { name, shortCode};

        const response = await fetch(`API/Departments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(update)
        });
        return response;
    }
}

function getToken() {
    return localStorage.getItem('token');
}


export default DepartmentManager;