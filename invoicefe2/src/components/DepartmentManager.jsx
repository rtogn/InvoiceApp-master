import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';

function DepartmentManager() {
    const [departments, setDepartments] = useState();

    useEffect(() => {
        getDepartments();
    }, []);

    const handleUpdateEditRow = (updatedRow) => {
        setDepartments((prevData) =>
            prevData.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            )
        );
    };

    const handleUpdateNewRow = (newDepartment) => {
        newDepartment = { 'id': 'Pending', ...newDepartment };
        setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
        //getDepartments();
    };

    const handleUpdate = (updatedRow) => {
        //getDepartments();
        const hasId = updatedRow?.id !== undefined;
        hasId ? handleUpdateEditRow(updatedRow) : handleUpdateNewRow(updatedRow); 
    }

    return (
        <>
            <h1>Department Manager Temp</h1>
            <DataTable headers={['ID', 'Name', 'Short Code']}
                data={departments}
                onUpdate={handleUpdate}
                putMethod={putDepartment}
                postMethod={postDepartment}
                deleteMethod={deleteDepartment}
            /> 
        </>
    );

    async function getDepartments() {
        try {
            const response = await fetch('API/Departments', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            const data = await response.json();
            const head = data.headers;
            setDepartments(data);
        } catch (exception) {
            console.error('Issue fetching Departments list', exception);
        }

    }

    async function postDepartment(newRow) {
        try {
            const response = await fetch('API/Departments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(newRow)
            });

            //console.log(response);
        } catch (exception) {
            console.error('Issue accessing and updating Departments table', exception);
        }
        
    }

    async function putDepartment(row) {
        try {
            const id = row.id;
            const name = row.name;
            const shortCode = row.shortCode;
            const update = { name, shortCode };

            const response = await fetch(`API/Departments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(update)
            });
        } catch (exception) {
            console.error('Issue accessing and updating Departments table', exception);
        }
    }

    async function deleteDepartment(row) {
        try {
            console.log(row);
            const id = row.id;

            const response = await fetch(`API/Departments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
        } catch (exception) {
            console.error('Issue accessing and updating Departments table', exception);
        }
    }
}

function getToken() {
    return localStorage.getItem('token');
}


export default DepartmentManager;