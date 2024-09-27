import { useState } from 'react';

function MenuPage({routeTo, pages}) {

    return (
        <>
            <h1>menu page</h1>
            <div>
                {pages.map((page) =>
                    <button key={page.route} onClick={() => { routeTo(page.route) } }>{page.title}</button>
                )}
            </div>
        </>
    );
}

export default MenuPage;