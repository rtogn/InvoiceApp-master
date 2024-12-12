import { useEffect, useState } from 'react';
import './GBGrid.css';
import Dissassembler from './Disassembler';
import Registers from './GB/Registers';
import Memory from './GB/Memory';

const GRID_SIZE = 23040;
const VERT_DIST = 160;
const HORZ_DIST = 1;

function GBGrid() {


    return (
        <>
            <button onClick={() => getRegister('a') }>TEST</button>
            <div></div>
            <canvas className="aCanvas" width="140" height="160" ></canvas>
            <div>   </div>
            <Dissassembler />
            <Registers></Registers>

        </>
    );
};

export default GBGrid;