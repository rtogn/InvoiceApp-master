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
    const [clickMode, setClickMode] = useState('point');

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    const toggleBox = (index) => {
        //const newBoxes = [...boxes];
        
        switch (clickMode) {
            case 'point':
                setPoint(index);
                break;
            case 'box':
                setBox(index);
                break;
            case 'glider':
                setGlider(index);
                break;
            case 'pulsar':
                setPulsar();
                break;
            case 'rpentomino':
                setRpentomino(index);
                break;
            case 'pentadecathlon':
                setPentaDecathlon();
                break;
            case 'blinker':
                setBlinker(index);
                break;
            case 'toad':
                setToad(index);
                break;
            default:
                console.log("nothing");
        }
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
        //console.log(boxes);
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

    const handleClickModeChange = (event) => {
        setClickMode(event.target.value);
    }

    const runSimulation = (generations) => {
        setGenerations(generations);
        setStart(true);
        setGenerationCounter(0);   
    }

    const setPoint = (index) => {
        // Set click location to spawn a single point
        const newBoxes = [...boxes];
        newBoxes[index] = !newBoxes[index];
        setBoxes(newBoxes);
    }

    const setRpentomino = (index) => {
        // Set click location to spawn an Rpentomino
        const newBoxes = [...boxes];
        newBoxes[index] = true;
        newBoxes[index + 1] = true;
        newBoxes[index + VERT_DIST] = true;
        newBoxes[index + VERT_DIST - 1] = true;
        newBoxes[index + VERT_DIST * 2] = true;
        setBoxes(newBoxes);
    }

    const setBox = (index) => {
        // Set click location to spawn a glider
        const newBoxes = [...boxes];
        newBoxes[index] = true;
        newBoxes[index + 1] = true;
        newBoxes[index + VERT_DIST] = true;
        newBoxes[index + VERT_DIST + 1] = true;
        setBoxes(newBoxes);
    }

    const setToad = (index) => {
        // Set click location to spawn a Toad
        const newBoxes = [...boxes];
        newBoxes[index] = true;
        newBoxes[index + 1] = true;
        newBoxes[index - 1] = true;
        newBoxes[index + VERT_DIST - 1] = true;
        newBoxes[index + VERT_DIST] = true;
        newBoxes[index + VERT_DIST - 2] = true;
        setBoxes(newBoxes);
    }

    const setGlider = (index) => {
        // Set click location to spawn a glider
        const newBoxes = [...boxes];
        newBoxes[index] = true;
        newBoxes[index + VERT_DIST + 1] = true;
        newBoxes[index + (VERT_DIST * 2)] = true;
        newBoxes[index + (VERT_DIST * 2) + 1] = true;
        newBoxes[index + (VERT_DIST * 2) - 1] = true;
        setBoxes(newBoxes);
    }


    const setPentaDecathlon = () => {
        // Set grid to be a PentaDecathlon 
        const newBoxes = [...boxes];
        const set = [89, 108, 109, 110, 127, 128, 129, 130,
            131, 267, 268, 269, 270, 271, 288, 289, 290, 309
        ];

        for (let i = 0; i < set.length; i++) {
            newBoxes[set[i]] = true;
        }

        setBoxes(newBoxes);
    }

    const setPulsar = () => {
        // Set grid to be a pulsar 
        const newBoxes = [...boxes];
        const set = [65, 66, 72, 73, 86, 87, 91, 92, 103, 106,
            108, 110, 112, 115, 123, 124, 125, 127,
            128, 130, 131, 133, 134, 135, 144, 146,
            148, 150, 152, 154, 165, 166, 167, 171,
            172, 173, 205, 206, 207, 211, 212, 213,
            224, 226, 228, 230, 232, 234, 243, 244,
            245, 247, 248, 250, 251, 253, 254, 255,
            263, 266, 268, 270, 272, 275, 286, 287,
            291, 292, 305, 306, 312, 313
        ];

        for (let i = 0; i < set.length; i++) {
            newBoxes[set[i]] = true;
        }

        setBoxes(newBoxes);
    }
    return (
        <>
            <button onClick={() => runSimulation(100) }>Start</button>
            <button onClick={() => setStart(false)}>Pause</button>
            <button onClick={() => runSimulation(1)}>{'>>'}</button>
            <button onClick={clear}>Clear</button>

            <select value={clickMode} onChange={handleClickModeChange}>
                <option value="point">point</option>
                <option value="box">box</option>
                <option value="glider">glider</option>
                <option value="pulsar">pulsar</option>
                <option value="toad">toad</option>
                <option value="blinker">blinker</option>
                <option value="rpentomino">Rpentomino</option>
                <option value="pentadecathlon">pentadecathlon</option>
            </select>


            <div className="grid">
                {boxes.map((isWhite, index) => (
                    <div
                        key={index}
                        className={`box ${isWhite ? '' : 'black'}`}
                        onClick={() => {
                            toggleBox(index, clickMode);
                        }}
                    ></div>
                ))}
            </div>
        </>
    );
};

export default GameGrid;