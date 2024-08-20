import React from 'react'
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import DepartmentManager from './components/DepartmentManager';
import './App.css';

function App() {
    const [departments, setDepartments] = useState();

    useEffect(() => {
        populateDepartmentData();
    }, []);

    const contents = departments === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : (<>
            <table className="table table-striped" aria-labelledby="tabelLabel">
                <tbody>
                    {departments.map(departments =>
                        <tr key={departments.id}>
                            <td>{departments.name}</td>
                            <td>{departments.shortCode}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <p>cats</p>
        </>);
    //authenticate();
    //postDepartment();
    return (
        <>

            <h1 id="tabelLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the servertest.Test</p>
            <DepartmentManager /> 
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