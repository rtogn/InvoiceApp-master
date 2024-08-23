import React from 'react'
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import DepartmentTable from './components/DepartmentTable';
import './App.css';

function App() {

    return (
        <>

            <h1 id="tabelLabel">Work Order Demo</h1>
            <p>This component demonstrates fetching data from the server.</p>
            <DepartmentTable /> 
            <LoginForm />
        </>

    );

    function getToken() {
        return localStorage.getItem('token');
    }

    async function populateDepartmentData() {
        const response = await fetch('API/Departments', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        const data = await response.json();
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
        console.log(requestOptions);
        const response = await fetch('API/Departments', requestOptions);
        const data = await response.json();
        console.log(data);
        return data;
        //this.setState({ postId: data.id });
    }
}

export default App;