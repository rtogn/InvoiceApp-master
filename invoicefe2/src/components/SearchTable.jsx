import { useState } from 'react';
import '../css/Forms.css'

function SearchTable({ searchMethod }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        searchMethod(searchTerm);
    }

    const handleChange = (event) => {
        const target = event.target.value;
        setSearchTerm(target);
        searchMethod(target); // Call the search method directly on change
    }

    const clear = () => {
        setSearchTerm('');
        searchMethod('');
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
                <input type='text' value={searchTerm} onChange={handleChange} placeholder='Search' />
            <button className='submit-button' type='submit'>Search</button>
                <button onClick={clear} className='submit-button' type='submit'>Clear</button>
        </form>
        
        </>
    );
};

export default SearchTable;

