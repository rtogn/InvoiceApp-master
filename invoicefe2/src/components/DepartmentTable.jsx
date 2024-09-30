import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import SearchTable from './SearchTable';

function DepartmentTable() {
    const [departments, setDepartments] = useState();
    const [refreshTable, setRefreshTable] = useState(false);
    const [searchTableOn, setSearchTableOn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(5);

    useEffect(() => {
        getDepartmentsPaged(currentPage, currentPageSize);
    }, [refreshTable]);

    const updateTable = () => {
        setRefreshTable(!refreshTable);
        
    }

    const testSearch = (term) => {
        if (term != '') {
            getSearchDepartments(term, 1, currentPageSize);
        } else {
            updateTable();
        }
    }

    return (
        <>
            <h1>Department Manager Temp</h1>
            <DataTable headers={['ID', 'Name', 'Short Code']}
                payload={departments}
                searchMethod={testSearch}
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

            const response = await fetch(`API/Departments/Search?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
                
            });
            const responseJson = await response.json();
            setCurrentPage(1);
            setCurrentPageSize(pageSize);
            setDepartments(responseJson); ///was responeJson.data

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