import { useEffect, useState } from 'react';
import './GameGrid.css';

const GRID_SIZE = 400;
const VERT_DIST = 20;
const HORZ_DIST = 1;

function GameGrid() {
    const [boxes, setBoxes] = useState(Array(GRID_SIZE).fill(false));
    const [start, setStart] = useState(false);
    const [generationCounter, setGenerationCounter] = useState(0);
    const [generations, setGenerations] = useState(1);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const toggleBox = (index) => {
        const newBoxes = [...boxes];
        newBoxes[index] = !newBoxes[index];
        console.log(index);
        setBoxes(newBoxes);
    }

    const clear = () => {
        setBoxes(Array(GRID_SIZE).fill(false));
    }

    const checkBounds = (index) => {

        const up = index - VERT_DIST;
        const down = index + VERT_DIST;
        const left = index - HORZ_DIST;
        const right = index + HORZ_DIST;
        const topRight = up + 1;
        const bottomRight = down + 1;
        const topLeft = up - 1;
        const bottomLeft = down - 1;
        
        const neighbors = [boxes[up], boxes[down], boxes[left], boxes[right], boxes[topRight], boxes[bottomRight], boxes[topLeft], boxes[bottomLeft]];
        const neighborCount = neighbors.filter(item => item === true).length;
        //console.log(neighbors);
        //console.log(neighborCount.length);
        return neighborCount;
    }

    useEffect(() => {
        if (start && generationCounter < generations) {
            runNextGeneration();
        }
    }, [start, generationCounter]);

    const runNextGeneration = async () => {
        const newBoxes = [...boxes];
            for (let j = 0; j < newBoxes.length; j++) {

                const neighborCount = checkBounds(j);
                if (boxes[j] == true) { //Alive
                    if (neighborCount < 2) {
                        newBoxes[j] = false; // Kill if less than 2 neighbors (underpopulation)

                    } else if (neighborCount == 2 || neighborCount == 3) {
                        newBoxes[j] = true; // Keep alive if 2 or 3 neighbors (Stable)
                    } else if (neighborCount > 3) {
                        newBoxes[j] = false; // Kill if > 3 neighbors (overpopulation)
                    }

                } else { //Dead
                    if (neighborCount == 3) {
                        newBoxes[j] = true // Live by reproduction if neighbors == 3
                        console.log("dead");
                    }
                }
            }
        setBoxes(newBoxes);
        await timeout(350);


            setGenerationCounter(prev => prev + 1);
    }

    const setStar = () => {
        const newBoxes = [...boxes];
        newBoxes[65] = true;
        newBoxes[66] = true;
        newBoxes[72] = true;
        newBoxes[73] = true;
        newBoxes[86] = true;
        newBoxes[87] = true;
        newBoxes[91] = true;
        newBoxes[92] = true;
        newBoxes[103] = true;
        newBoxes[106] = true;
        newBoxes[108] = true;
        newBoxes[110] = true;
        newBoxes[112] = true;
        newBoxes[115] = true;
        newBoxes[123] = true;
        newBoxes[124] = true;
        newBoxes[125] = true;
        newBoxes[127] = true;
        newBoxes[128] = true;
        newBoxes[130] = true;
        newBoxes[131] = true;
        newBoxes[133] = true;
        newBoxes[134] = true;
        newBoxes[135] = true;
        newBoxes[144] = true;
        newBoxes[146] = true;
        newBoxes[148] = true;
        newBoxes[150] = true;
        newBoxes[152] = true;
        newBoxes[154] = true;
        newBoxes[165] = true;
        newBoxes[166] = true;
        newBoxes[167] = true;
        newBoxes[171] = true;
        newBoxes[172] = true;
        newBoxes[173] = true;
        newBoxes[205] = true;
        newBoxes[206] = true;
        newBoxes[207] = true;
        newBoxes[211] = true;
        newBoxes[212] = true;
        newBoxes[213] = true;
        newBoxes[224] = true;
        newBoxes[226] = true;
        newBoxes[228] = true;
        newBoxes[230] = true;
        newBoxes[232] = true;
        newBoxes[234] = true;
        newBoxes[243] = true;
        newBoxes[244] = true;
        newBoxes[245] = true;
        newBoxes[247] = true;
        newBoxes[248] = true;
        newBoxes[250] = true;
        newBoxes[251] = true;
        newBoxes[253] = true;
        newBoxes[254] = true;
        newBoxes[255] = true;
        newBoxes[263] = true;
        newBoxes[266] = true;
        newBoxes[268] = true;
        newBoxes[270] = true;
        newBoxes[272] = true;
        newBoxes[275] = true;
        newBoxes[286] = true;
        newBoxes[287] = true;
        newBoxes[291] = true;
        newBoxes[292] = true;
        newBoxes[305] = true;
        newBoxes[306] = true;
        newBoxes[312] = true;
        newBoxes[313] = true;
        setBoxes(newBoxes);


    }

    const runSimulation = (generations) => {
        setGenerations(generations);
        setStart(true);
        setGenerationCounter(0);   
    }

    return (
        <>
            <button onClick={() => runSimulation(30) }>Start</button>
            <button onClick={() => setStart(false)}>Pause</button>
            <button onClick={() => runSimulation(1)}>{'>>'}</button>
            <button onClick={setStar}>Star</button>
            <button onClick={clear}>Clear</button>
            <div className="grid">
                {boxes.map((isWhite, index) => (
                    <div
                        key={index}
                        className={`box ${isWhite ? '' : 'black'}`}
                        onClick={() => {
                            toggleBox(index);
                        }}
                    ></div>
                ))}
            </div>
        </>
    );
};

export default GameGrid;