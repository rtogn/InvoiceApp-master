import { useState } from 'react';
import '../css/PageList.css'

function PageListButton({ selected, onClick, children }) {

    return (
        <li>
            <button className={selected} onClick={onClick}> {children} </button>
        </li>
    );
};

export default PageListButton;