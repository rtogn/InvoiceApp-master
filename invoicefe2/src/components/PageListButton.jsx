import { useState } from 'react';
import '../css/PageList.css'

function PageListButton({ selected, onClick, title, children }) {

    return (
        <li>
            <button className={selected} onClick={onClick} title={title}> {children} </button>
        </li>
    );
};

export default PageListButton;