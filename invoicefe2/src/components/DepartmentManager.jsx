import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';

function DepartmentManager() {
    const [departments, setDepartments] = useState();

    useEffect(() => {
        populateDepartmentData();
    }, []);
    //console.log(departments.headers);

    //console.log(departments);
    return (
        <>
            <h1>Department Manager Temp</h1>
            
            <DataTable headers={['ID', 'Name', 'Short Code']} data={departments} /> 
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
        console.log(data);
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
}

function getToken() {
    return localStorage.getItem('token');
}


export default DepartmentManager;