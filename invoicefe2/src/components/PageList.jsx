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
        getPageListBounds(index);
        setCurPage(index);
    }

    const getPageListBounds = (page) => {
        // Determines starting and ending page number to display when jumping between selected pages
        if (totalPages <= MAX_PAGE_DISPLAYED) {
            start = 1;
            end = totalPages;
        } else {
            if (page <= Math.ceil(MAX_PAGE_DISPLAYED / 2)) {
                // Handle values between 1 and MAX_PAGE_DISPLAYED
                start = 1;
                end = MAX_PAGE_DISPLAYED;
            } else if (page + Math.floor(MAX_PAGE_DISPLAYED / 2) >= totalPages) {
                // Handle case when near end of list and more than 4 pages
                start = totalPages - MAX_PAGE_DISPLAYED + 1;
                end = totalPages
            } else {
                // Handle middle values / normal case
                start = page - Math.floor(MAX_PAGE_DISPLAYED / 2);
                end = page + Math.floor(MAX_PAGE_DISPLAYED / 2) - 1;
            }
        }
    }

    const setBounds = () => {
        // 'Move' the view left or right as values are incremented
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