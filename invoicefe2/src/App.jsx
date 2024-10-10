import React from 'react'
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import DepartmentTable from './components/DepartmentTable';
import WorkOrderTable from './components/WorkOrderTable';
import ConwaysGOL from './components/ConwaysGOL';
import MenuPage from './components/MenuPage';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState('login');

    const handleLogin = () => {
        setIsAuthenticated(true);
        setCurrentPage('menu');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('login');
    };

    const routeTo = (page) => {
        setCurrentPage(page);
    };

    // List of pages for the menu to dispaly as buttons that change the 
    // route. Must have a unique route name. 
    const pageList = [
        { route: 'departments', title: 'Departments Table' },
        { route: 'workorders', title: 'Work Orders Table' },
        { route: 'conwaysGOL', title: 'Conways Game' }
    ];

    return (
        <>
            <h1 id="tabelLabel">Work Order Demo</h1>
            <p>This component demonstrates fetching data from the server.</p>

            <div>
                {currentPage === 'login' && !isAuthenticated && <LoginForm setAuth={handleLogin} />}
                {currentPage === 'menu' && isAuthenticated && <MenuPage routeTo={routeTo} pages={pageList} />}
                {currentPage === 'departments' && isAuthenticated && <DepartmentTable />}
                {currentPage === 'workorders' && isAuthenticated && <WorkOrderTable />}
                {currentPage === 'conwaysGOL' && isAuthenticated && <ConwaysGOL />}

                {currentPage != 'menu' && isAuthenticated &&
                    <button onClick={() => { routeTo('menu') }}>{'<< Back'}</button>
                }
                {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
            </div>
        </>

    );

    function getToken() {
        return localStorage.getItem('token');
    }
}

export default App;