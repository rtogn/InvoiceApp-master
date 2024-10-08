import { useState } from 'react';
import '../css/Forms.css'

function SearchTable({ searchMethod }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        searchMethod(searchTerm);
    }

    const clear = () => {
        setSearchTerm('');
    }

    return (
        <>
        <form onSubmit={handleSubmit} onChange={handleSubmit}>
            <input type='text' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder='Search' />
            <button className='submit-button' type='submit'>Search</button>
                <button onClick={clear} className='submit-button' type='submit'>Clear</button>
        </form>
        
        </>
    );
};

export default SearchTable;

