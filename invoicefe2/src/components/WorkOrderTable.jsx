import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import SearchTable from './SearchTable';

function WorkOrderTable() {
    const [departments, setDepartments] = useState();
    const [refreshTable, setRefreshTable] = useState(false);
    const [searchTableOn, setSearchTableOn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(5);

    useEffect(() => {
        if (searchTableOn) {
            console.log("peep1");
            getDepartmentsPaged(currentPage, currentPageSize);
        } else {
            setCurrentPage(1);
        }
    }, [refreshTable]);

    const updateTable = () => {
        setRefreshTable(!refreshTable);
    }

    return (
        <>
            <h1>Work Order Table Temp</h1>
            <DataTable headers={['ID', 'Name', 'Short Code']}
                payload={departments}
                searchMethod={getSearchDepartments}
                getMethod={getDepartmentsPaged}
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
            const responseJson = await response.json();
            setDepartments(responseJson); ///was responeJson.data
            setCurrentPage(page);
            setCurrentPageSize(pageSize);

            //console.log("Response from dept controller:");
            //console.log(responseJson);
        } catch (exception) {
            console.error('Issue fetching Departments list', exception);
        }
    }

    async function getSearchDepartments(searchTerm, page, pageSize) {
        try {

            const response = await fetch(`API/Departments/Search?searchTerm=${searchTerm}page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
                
            });
            console.log("aaaResponse from dept controller:");
            console.log("aResponse from dept controller:");
            const responseJson = await response.json();
            setDepartments(responseJson); ///was responeJson.data
            //setCurrentPage(page);
            //setCurrentPageSize(pageSize);
            //setSearchTableOn(true);
            //updateTable();
            console.log("Response from dept controller:");
            console.log(responseJson);
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
            updateTable();
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
            updateTable();
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
            if (departments.data.length === 1) {
                setCurrentPage(currentPage - 1);
            };
            updateTable();
        } catch (exception) {
            console.error('Issue accessing and updating Departments table', exception);
        }
    }
}

function getToken() {
    return localStorage.getItem('token');
}


export default WorkOrderTable;
