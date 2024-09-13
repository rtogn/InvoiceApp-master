import { useState } from 'react';
import '../css/PageList.css'
import PageListButton from './PageListButton'

const MAX_PAGE_DISPLAYED = 4;
let start = 1;
let end = MAX_PAGE_DISPLAYED;

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
        jumpBounds(index);
        setCurPage(index);
    }

    const jumpBounds = (page) => {
        if (page != 1) {
            start = page - 1;
            end = Math.min(page + 2, totalPages);
        } else {
            start = 1;
            end = Math.min(MAX_PAGE_DISPLAYED, totalPages);
        }
        
    }

    const setBounds = () => {
        if (curPage === end && end != totalPages) {
            start++;
            end++;
        }
        else if (curPage === start && start != 1) {
            start--;
            end--;
        }
    }

    const pageListButtons = () => {


        let buttnList = [
            <PageListButton onClick={() => handleNumClick(1)} selected="first-page">{'<<'}</PageListButton>,
            <PageListButton onClick={() => handleArrowClick("-")}>{"<"}</PageListButton>
        ];

        setBounds();

        for (let i = start; i <= end; i++) {
            buttnList.push(<PageListButton onClick={() => handleNumClick(i)} selected = { curPage === i ? "page-selected" : ""} >{i}</PageListButton>);
        }

        buttnList.push(<PageListButton onClick={() => handleArrowClick("+")}>{">"}</PageListButton>);
        buttnList.push(<PageListButton onClick={() => handleNumClick(totalPages) } selected="final-page">{'>>'}</PageListButton>)
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