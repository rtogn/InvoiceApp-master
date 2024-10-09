import { useEffect, useState } from 'react';
import '../css/PageList.css'
import PageListButton from './PageListButton'

const MAX_PAGE_DISPLAYED = 4;
//let start = 1;
//let end = MAX_PAGE_DISPLAYED;

function PageList({ curPage, setCurPage, totalPages, pageSize, setPageSize }) {
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(MAX_PAGE_DISPLAYED);


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

    const handleDropDownChange = (e) => {
        setPageSize(Number(e.target.value));
        getPageListBounds(curPage);
    }

    useEffect(() => {
        if (curPage > end || curPage === 0) {
            setCurPage(1);
        } 
        getPageListBounds(curPage);

    }, [totalPages, curPage]);


    const getPageListBounds = (page) => {

        // Determines starting and ending page number to display when jumping between selected pages
        if (totalPages <= MAX_PAGE_DISPLAYED) {
            //start = 1;
            //end = totalPages;
            setStart(1);
            setEnd(totalPages);
        } else {
            if (page <= Math.ceil(MAX_PAGE_DISPLAYED / 2)) {
                // Handle values between 1 and MAX_PAGE_DISPLAYED
                //start = 1;
                //end = MAX_PAGE_DISPLAYED;
                setStart(1);
                setEnd(MAX_PAGE_DISPLAYED);
            } else if (page + Math.floor(MAX_PAGE_DISPLAYED / 2) >= totalPages) {
                // Handle case when near end of list and more than 4 pages
                //start = totalPages - MAX_PAGE_DISPLAYED + 1;
                //end = totalPages
                setStart(totalPages - MAX_PAGE_DISPLAYED + 1);
                setEnd(totalPages);

            } else {
                // Handle middle values / normal case
                //start = page - Math.floor(MAX_PAGE_DISPLAYED / 2);
                //end = page + Math.floor(MAX_PAGE_DISPLAYED / 2) - 1;
                setStart(page - Math.floor(MAX_PAGE_DISPLAYED / 2));
                setEnd(page + Math.floor(MAX_PAGE_DISPLAYED / 2) - 1);
            }
        }
    }

    const setBounds = () => {

        // 'Move' the view left or right as values are incremented
        if (curPage === end && end != totalPages) {
            //start++;
            //end++;
            setStart(start + 1);
            setEnd(end + 1);
        }
        else if (curPage === start && start != 1) {
            //start--;
            //end--;
            setStart(start - 1);
            setEnd(end - 1);
        }
    }

    const pageListButtons = () => {


        let buttnList = [
            <PageListButton onClick={() => handleNumClick(1)} selected="first-page" title="First Page">{'<<'}</PageListButton>,
            <PageListButton onClick={() => handleArrowClick("-")} title="Previous Page">{"<"}</PageListButton>
        ];

        setBounds();

        for (let i = start; i <= end; i++) {
            buttnList.push(<PageListButton onClick={() => handleNumClick(i)} selected = { curPage === i ? "page-selected" : ""} >{i}</PageListButton>);
        }

        buttnList.push(<PageListButton onClick={() => handleArrowClick("+")} title="Next Page">{">"}</PageListButton>);
        buttnList.push(<PageListButton onClick={() => handleNumClick(totalPages)} selected="final-page" title="Last Page">{'>>'}</PageListButton>)
        return buttnList;
    }
    //value="5" onChange={e => setPageSize(e.target.value)}
    return (
        <nav className="">
            
            <ul className="no-bullets">
                {...pageListButtons()}   

                <select className="drop-down" value={pageSize} onChange={handleDropDownChange} title="Number per page"> 
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
            </ul>


        </nav>
    );
};

export default PageList;