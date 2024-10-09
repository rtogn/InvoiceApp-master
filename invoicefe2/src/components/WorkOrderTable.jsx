import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';

function WorkOrderTable() {
    const [departments, setDepartments] = useState();
    const [refreshTable, setRefreshTable] = useState(false);
    const [searchTableOn, setSearchTableOn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(5);

    useEffect(() => {

        if (!searchTableOn) {
            getDepartmentsPaged(currentPage, currentPageSize);
        }
    }, [refreshTable, searchTableOn]);

    const updateTable = () => {
        setRefreshTable(!refreshTable);
    }

    const getOrSearch = (searchTerm = '', page, currentPageSize) => {

        if (searchTerm === '' || searchTerm === null) {
            getDepartmentsPaged(page, currentPageSize);
        } else {
            getSearchDepartments(searchTerm, page, currentPageSize);
        }
    }

    return (
        <>
            <h1>Department Manager Temp</h1>
            <DataTable headers={['ID', 'Name', 'Short Code']}
                payload={departments}
                searchMethod={getSearchDepartments}
                getMethod={getDepartmentsPaged}
                putMethod={putDepartment}
                postMethod={postDepartment}
                getSearchMethod={getOrSearch}
                deleteMethod={deleteDepartment}
            />
        </>
    );

    async function getDepartmentsPaged(page, pageSize) {

        try {
            const response = await fetch(`API/Departments/Paged?page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            const responseJson = await response.json();
            setDepartments(responseJson);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
        } catch (exception) {
            console.error('Issue fetching Departments list', exception);
        }
    }

    async function getSearchDepartments(searchTerm, page, pageSize) {
        setCurrentPage(1);
        try {

            const response = await fetch(`API/Departments/Search?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },

            });
            const responseJson = await response.json();
            setDepartments(responseJson);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
            //setSearchTableOn(true);
            //updateTable();
            //console.log("Response from dept controller:");
            //console.log(responseJson);
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
            //updateTable();
        } catch (exception) {
            console.error('Issue accessing and updating Departments table', exception);
        }

    }

    async function putDepartment(row) {

        try {
            console.log('abc');

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
            console.log('abc');
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
            if (departments.data.length === 1 || departments.data.length === 0) {
                setCurrentPage(currentPage - 1);
            };
            //setCurrentPage(1);
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
