import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';

function DepartmentTable() {
    const [departments, setDepartments] = useState();
    const [refreshTable, setRefreshTable] = useState(false);

    useEffect(() => {
        getDepartments();
    }, [refreshTable]);

    const finalFormUpdateTable = () => {
        setRefreshTable(!refreshTable);
    }

    return (
        <>
            <h1>Department Manager Temp</h1>
            <DataTable headers={['ID', 'Name', 'Short Code']}
                data={departments}
                putMethod={putDepartment}
                postMethod={postDepartment}
                deleteMethod={deleteDepartment}
            /> 
        </>
    );

    async function getDepartments() {
        getDepartmentsPaged(1, 2);
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


    async function getDepartmentsPaged(page, pageSize) {
        try {
            const response = await fetch(`API/Departments/Paged?page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            const data = await response.json();
            //setDepartments(data);
            console.log(data);
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
            //const jsonresponse = await response.json();
            finalFormUpdateTable();
            //return jsonresponse //read response
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
            finalFormUpdateTable();
        } catch (exception) {
            console.error('Issue accessing and updating Departments table', exception);
        }
    }

    async function deleteDepartment(row) {
        try {
            const id = row.id;

            const response = await fetch(`API/Departments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
            });

            finalFormUpdateTable();
        } catch (exception) {
            console.error('Issue accessing and updating Departments table', exception);
        }
    }
}

function getToken() {
    return localStorage.getItem('token');
}


export default DepartmentTable;


//const [curRow, setCurRow] = useState(null);
//const handleUpdateNewRow = (newDepartment) => {
//    newDepartment = { 'id': 'Pending', ...newDepartment };
//    setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
//};

//const handleUpdate = (updatedRow) => {
//    const hasId = updatedRow?.id !== undefined;
//    //hasId ? handleUpdateEditRow(updatedRow) : handleUpdateNewRow(updatedRow);
//    handleEditRow(updatedRow);
//};

//const updateTable = async () => {
//    const newData = await postDepartment(curRow);
//    handleAddNew(newData);
//};

//const handleAddNew = (newData) => {
//    setDepartments((data) => [...data, newData]);
//};

//const handleEditRow = (updatedRow) => {
//    setDepartments((data) =>
//        data.map((row) =>
//            row.id === updatedRow.id ? updatedRow : row
//        )
//    );
//};

//const handleDeleteRow = (removedRow) => {
//    //something something filter
//    setDepartments((data) =>
//        data.filter(row => row.id != removedRow.id).map(
//            filtered => (
//                filtered
//            )
//        )
//    );
//    setRefreshTable(!refreshTable);
//};

//useEffect(() => {
//    if (curRow != null) {
//        updateTable();
//    }
//}, [curRow]);