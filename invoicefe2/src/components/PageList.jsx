import { useState } from 'react';
import '../css/PageList.css'
import PageListButton from './PageListButton'

const MAX_PAGE_DISPLAYED = 3;

function PageList({ curPage, setCurPage, totalPages }) {

    const handleArrowClick = (direciton) => {
        //direciton === "+" ? setCurPage(curPage + 1) : setCurPage(curPage - 1);
        if (direciton === "+" && curPage < totalPages) {
            setCurPage(curPage + 1);
        } else if (direciton === "-" && curPage > 1) {
            setCurPage(curPage - 1);
        }
    }

    const handleNumClick = (index) => {
        setCurPage(index);
        //console.log("Break");
        //console.log(curPage);
        //console.log(index);
    }

    const pageListButtons = () => {
        let buttnList = [<PageListButton onClick={() => handleArrowClick("-")}>{"<<"}</PageListButton>];

        // Generate page number buttons up to max value. 
        // Current selection determined based on curPage state variable comapred to the index.
        for (let i = 1; i <= totalPages; i++) {
            buttnList.push(<PageListButton onClick={() => handleNumClick(i)} selected = { curPage === i ? "page-selected" : ""} >{i}</PageListButton>);
        }
        buttnList.push(<PageListButton onClick={() => handleArrowClick("+")}>{">>"}</PageListButton>);
        buttnList.push(<PageListButton selected="final-page">{totalPages}</PageListButton>)
        return buttnList;
    }

    return (
        <nav className="">
            
            <ul className="no-bullets">
                {...pageListButtons() }     
            </ul>

        </nav>
    );
};

export default PageList;

//<PageListButton>{"<<"}</PageListButton>
//<PageListButton>{curPage}</PageListButton>
//<PageListButton>{curPage + 1}</PageListButton>
//<PageListButton>{curPage + 2}</PageListButton>
//<PageListButton>{curPage + 3}</PageListButton>
//<PageListButton>{">>"}</PageListButton>
//<PageListButton>{totalPages}</PageListButton>