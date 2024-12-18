import React from 'react'
import { useEffect, useState } from 'react';
import DataTable from './DataTable';

function WorkOrderTable() {
    const [workOrderPageData, setWorkOrderPageData] = useState();
    const [refreshTable, setRefreshTable] = useState(false);
    const [searchTableOn, setSearchTableOn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(5);

    useEffect(() => {

        if (!searchTableOn) {
            getWorkOrdersPaged(currentPage, currentPageSize);
        }
    }, [refreshTable, searchTableOn]);

    const updateTable = () => {
        setRefreshTable(!refreshTable);
    }

    const getOrSearch = (searchTerm = '', page, currentPageSize) => {

        if (searchTerm === '' || searchTerm === null) {
            getWorkOrdersPaged(page, currentPageSize);
        } else {
            getSearchWorkOrders(searchTerm, page, currentPageSize);
        }
    }

    const formatDate = (dateString) => {
        // Format a given date string to a normal readable format. 
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    }

    const payloadFormatting = (payload) => {
        // Format response payload to format date strings contained.
        // Note that this relies on fields being 'dateSubmitted' and 'dateCompleted'. Any updates will break this.
        const formattedPayload = {
            ...payload,
            data: payload.data.map(item => {
                return {
                    ...item,
                    departments: item.departments.join(", "),
                    dateSubmitted: formatDate(item.dateSubmitted),
                    dateCompleted: formatDate(item.dateCompleted)
                };
            })
        }
        return formattedPayload;
    }

    return (
        <>
            <h1>Work Order Manager</h1>
            <DataTable headers={['ID', 'Job Description', 'Facility Name', 'Date Submitted', 'Date Completed', 'Departments']}
                payload={workOrderPageData}
                searchMethod={getSearchWorkOrders}
                getMethod={getWorkOrdersPaged}
                putMethod={putWorkOrder}
                postMethod={postWorkOrder}
                getSearchMethod={getOrSearch}
                deleteMethod={deleteWorkOrder}
            />
        </>
    );

    async function getWorkOrdersPaged(page, pageSize) {

        try {
            const response = await fetch(`API/WorkOrders/Paged?page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            const responseJson = await response.json();
            const formattedResponseJson = payloadFormatting(responseJson);
            console.log(formattedResponseJson);
            setWorkOrderPageData(formattedResponseJson);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
        } catch (exception) {
            console.error('Issue fetching Departments list', exception);
        }
    }

    async function getSearchWorkOrders(searchTerm, page, pageSize) {
        setCurrentPage(1);
        try {

            const response = await fetch(`API/WorkOrders/Search?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },

            });
            const responseJson = await response.json();
            setWorkOrderPageData(responseJson);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
        } catch (exception) {
            console.error('Issue fetching Departments list', exception);
        }
    }

    async function postWorkOrder(newRow) {

        try {
            const response = await fetch('API/WorkOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(newRow)
            });
            //updateTable();
        } catch (exception) {
            console.error('Issue accessing and updating WorkOrders table', exception);
        }

    }

    async function putWorkOrder(row) {

        try {
            console.log('abc');

            const id = row.id;
            const name = row.name;
            const shortCode = row.shortCode;
            const update = { name, shortCode };

            const response = await fetch(`API/WorkOrders/${id}`, {
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

    async function deleteWorkOrder(row) {

        try {
            const id = row.id;

            const response = await fetch(`API/WorkOrders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            if (workOrderPageData.data.length === 1 || workOrderPageData.data.length === 0) {
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
